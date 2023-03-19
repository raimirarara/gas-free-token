import { ethers } from "ethers"
import { v4 as uuidv4 } from "uuid"
import * as admin from "firebase-admin"

export class TokenService {
  private static TopCollectionName = "Contract"
  private static TopCollectionNameTestMode = "Contract-Test"

  private static getDB(testMode: boolean) {
    const firestore = admin.firestore()
    if (testMode) {
      return firestore.collection(this.TopCollectionNameTestMode)
    } else {
      return firestore.collection(this.TopCollectionName)
    }
  }

  private static verifySignature(address: string, signature: string) {
    if (!address) throw new Error("Authentication error: Address is not supplied.")
    if (!signature) throw new Error("Authentication error: Signature is not supplied.")

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
    const TokenAddress = uuidv4()

    // Save the owner address to Firestore
    const OwnerAddress = walletAddress.toLowerCase() // Ensure the address is in lowercase

    await this.getDB(testMode).doc(TokenAddress).set({
      OwnerAddress: OwnerAddress,
    })

    // Return the token address
    return { tokenAddress: TokenAddress }
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

    const { abi, bytecode } = await this.getContractData()
    const provider = this.getProvider()
    const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

    const { walletAddressList, amountList } = await this.getWalletAddressAndAmounts(tokenAddress, db)

    const wallet = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)
    const contract = await factory.deploy(tokenName, tokenSymbol, walletAddressList, amountList)

    const web3ContractAddress = await contract.getAddress()
    await this.updateWeb3ContractAddress(tokenAddress, web3ContractAddress, db)

    return { web3ContractAddress }
  }

  static async getTokenData(
    tokenAddress: string,
    db: admin.firestore.CollectionReference<admin.firestore.DocumentData>
  ) {
    const tokenDoc = await db.doc(tokenAddress.toLowerCase()).get()
    const tokenData = tokenDoc.data()

    if (!tokenData) {
      throw new Error("Authentication error: You are not allowed to execute this method.")
    }

    return tokenData
  }

  static validateOwnership(walletAddress: string, tokenData: admin.firestore.DocumentData) {
    const ownerAddress = tokenData.OwnerAddress

    if (ownerAddress !== walletAddress.toLowerCase() || tokenData.web3ContractAddress) {
      throw new Error("Authentication error: You are not allowed to execute this method.")
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
      .collection("WalletAddress")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          addressData[doc.id] = doc.data()
        })
      })

    const walletAddressList = Object.keys(addressData)
    const amountList = walletAddressList.map((walletAddress) => {
      return addressData[walletAddress].Amount
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
}
