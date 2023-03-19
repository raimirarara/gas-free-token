import { ethers } from "ethers"
import { v4 as uuidv4 } from "uuid"
import * as admin from "firebase-admin"
import { FieldValue } from "firebase-admin/firestore"

interface TokenInfo {
  tokenAddress: string
  token: number
}

export class TokenService {
  private static TopCollectionName = "contract"
  private static TopCollectionNameTestMode = "contract-test"
  private static walletAddressName = "walletAddress"

  private static getDB(testMode: boolean) {
    const firestore = admin.firestore()
    if (testMode) {
      return firestore.collection(this.TopCollectionNameTestMode)
    } else {
      return firestore.collection(this.TopCollectionName)
    }
  }

  private static verifySignature(address: string, signature: string) {
    // Verify the signature using ethers.js
    const message = address
    const recoveredAddress = ethers.verifyMessage(message, signature)

    // Check if the recovered address matches the supplied address
    if (recoveredAddress !== address) {
      console.log({ address, signature, recoveredAddress })
      throw new Error("Authentication error: Signature cannot be verified.")
    }
  }

  static async create(walletAddress: string, signature: string, testMode: boolean = false) {
    // Verify the signature
    if (!walletAddress) throw new Error("Authentication error: walletAddress is not supplied.")
    if (!signature) throw new Error("Authentication error: signature is not supplied.")
    if (!testMode) this.verifySignature(walletAddress, signature)

    // Generate a new UUID for the token address
    const tokenAddress = uuidv4().replace(/-/g, "").toLowerCase()

    // Save the owner address to Firestore
    const ownerAddress = walletAddress.toLowerCase() // Ensure the address is in lowercase

    await this.getDB(testMode).doc(tokenAddress).set({
      ownerAddress,
    })

    // Return the token address
    return { tokenAddress }
  }

  static async migrate(
    tokenAddress: string,
    tokenName: string,
    tokenSymbol: string,
    walletAddress: string,
    signature: string,
    testMode: boolean = false
  ) {
    if (!testMode) this.verifySignature(walletAddress, signature)

    const db = this.getDB(testMode)
    const tokenData = await this.getTokenData(tokenAddress, db)
    this.validateOwnership(walletAddress, tokenData)

    const { walletAddressList, amountList } = await this.getWalletAddressAndAmounts(tokenAddress, db)

    const { abi, bytecode } = await this.getContractData()
    const provider = this.getProvider()
    const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

    const wallet = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)
    const contract = await factory.deploy(tokenName, tokenSymbol, walletAddressList, amountList)

    const web3ContractAddress = await contract.getAddress()
    await this.updateWeb3ContractAddress(tokenAddress, web3ContractAddress, db)

    return { web3ContractAddress }
  }

  static async balanceOf(tokenAddress: string, walletAddress: string, testMode: boolean = false) {
    // Check if the token has already been migrated to another contract
    const migratedTokenAddress = await this.getDB(testMode).doc(tokenAddress).get()
    const data = migratedTokenAddress.data()
    if (data?.Web3ContractAddress) {
      throw new Error(`This token is already migrated into ${data.Web3ContractAddress}`)
    }

    const tokenBalance = await this.getTokenBalance(tokenAddress, walletAddress, testMode)
    const tokenInfo: TokenInfo = {
      tokenAddress,
      token: tokenBalance,
    }

    // Return the token balance info
    return tokenInfo
  }

  static async transfer(
    tokenAddress: string,
    to: string,
    amount: number,
    walletAddress: string,
    signature: string,
    testMode: boolean = false
  ) {
    // Check if the token has already been migrated to another contract
    const migratedTokenAddress = await this.getDB(testMode).doc(tokenAddress).get()
    const data = migratedTokenAddress.data()
    if (data?.Web3ContractAddress) {
      throw new Error(`This token is already migrated into ${data.Web3ContractAddress}`)
    }

    // Verify the signature
    if (!testMode) this.verifySignature(walletAddress, signature)

    // Get the sender's token balance
    const senderTokenBalance = await this.getTokenBalance(tokenAddress, walletAddress, testMode)

    // Check if the sender has enough tokens to transfer
    if (senderTokenBalance < amount) {
      throw new Error(`Insufficient balance. You do not have enough tokens to complete this transaction.`)
    }

    // Create a Firestore transaction to update the sender's and recipient's token balances
    const batch = admin.firestore().batch()

    const senderRef = this.getDB(testMode).doc(tokenAddress).collection("balances").doc(walletAddress.toLowerCase())
    const recipientRef = this.getDB(testMode).doc(tokenAddress).collection("balances").doc(to.toLowerCase())

    // Get the recipient's balance
    const recipientDoc = await recipientRef.get()

    // If the recipient document does not exist, create it with amount field set to 0
    if (!recipientDoc.exists) {
      await recipientRef.set({ amount: 0 })
    }

    batch.update(senderRef, { amount: FieldValue.increment(-amount) })
    batch.update(recipientRef, { amount: FieldValue.increment(amount) })

    await batch.commit()

    // Return a success message
    return { message: `Transfer successful. ${amount} tokens transferred from ${walletAddress} to ${to}` }
  }

  static async getTokenData(
    tokenAddress: string,
    db: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  ) {
    const tokenDoc = await db.doc(tokenAddress.toLowerCase()).get()
    const tokenData = tokenDoc.data()

    if (!tokenData) {
      throw new Error("Authentication error: You are not allowed to execute this method.(1)")
    }

    return tokenData
  }

  static validateOwnership(walletAddress: string, tokenData: admin.firestore.DocumentData) {
    const ownerAddress = tokenData.ownerAddress
    if (ownerAddress !== walletAddress.toLowerCase() || tokenData.web3ContractAddress) {
      throw new Error("Authentication error: You are not allowed to execute this method.(2)")
    }
  }

  static async getContractData() {
    const contracts = require("../contracts/MyERC20.json")
    const { abi, bytecode } = contracts
    return { abi, bytecode }
  }

  static getProvider() {
    const providerUrl = process.env.PROVIDER_URL || "http://localhost:8545"
    return new ethers.JsonRpcProvider(providerUrl)
  }

  static async getWalletAddressAndAmounts(
    tokenAddress: string,
    db: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  ) {
    const addressData: any = {}

    await db
      .doc(tokenAddress.toLowerCase())
      .collection(this.walletAddressName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          addressData[doc.id] = doc.data()
        })
      })

    const walletAddressList = Object.keys(addressData)
    const amountList = walletAddressList.map((walletAddress) => {
      return addressData[walletAddress].amount
    })

    return { walletAddressList, amountList }
  }

  static async updateWeb3ContractAddress(
    tokenAddress: string,
    web3ContractAddress: string,
    db: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  ) {
    await db.doc(tokenAddress.toLowerCase()).set({
      web3ContractAddress,
    })
  }

  static async getTokenBalance(tokenAddress: string, walletAddress: string, testMode: boolean): Promise<number> {
    // Fetch the token balance of the wallet address
    const docRef = this.getDB(testMode).doc(tokenAddress).collection("balances").doc(walletAddress.toLowerCase())

    // Check if the wallet address exists in the balances collection
    const doc = await docRef.get()
    if (!doc.exists) {
      throw new Error("NotFound error: The requested wallet address could not be found in the database. ")
    }

    // Get the token balance for the wallet address
    const balanceData = doc.data()
    if (balanceData?.amount === undefined) {
      throw new Error("Error: Token balance not found for the requested wallet address.")
    }

    // Return the token balance
    return balanceData.amount as number
  }
}
