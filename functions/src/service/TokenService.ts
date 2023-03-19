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
    // Verify the signature
    if (!testMode) this.verifySignature(walletAddress, signature)

    // Get the owner address from Firestore
    const db = this.getDB(testMode)
    const tokenDoc = await db.doc(tokenAddress.toLowerCase()).get()
    const tokenData = tokenDoc.data()
    if (!tokenData) {
      throw new Error(`Authentication error: You are not allowed to execute this method.`)
    }
    const ownerAddress = tokenData.OwnerAddress
    if (ownerAddress !== walletAddress.toLowerCase()) {
      throw new Error(`Authentication error: You are not allowed to execute this method.`)
    }

    //  Web3ContractAddressに値が入っていたら以下のエラーメッセージを返却
    if (tokenData.web3ContractAddress) {
      throw new Error(`Authentication error: You are not allowed to execute this method.`)
    }

    // Deploy a new contract
    const path = "../contracts/MyERC20.json"
    const { abi, bytecode } = require(path)

    const provider = new ethers.JsonRpcProvider("http://localhost:8545") //切り替えられるようにする
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" //TODO: 環境変数化 これはHardhatの秘密鍵

    // データベースに登録されている(walletAddress, Token)の組み合わせを全取得する
    const combinationOfWalletAddressAndToken: any = {}
    await db
      .doc(tokenAddress.toLowerCase())
      .collection("WalletAddress")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          combinationOfWalletAddressAndToken[doc.id] = doc.data()
        })
      })

    const walletAddressList = Object.keys(combinationOfWalletAddressAndToken)
    const amountList = walletAddressList.map((walletAddress) => {
      return combinationOfWalletAddressAndToken[walletAddress].Amount
    })

    // Create the contract object
    const wallet = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(abi, bytecode, wallet)
    const contract = await factory.deploy(tokenName, tokenSymbol, walletAddressList, amountList)

    // web3ContractAddressをDBに書き込む
    const web3ContractAddress = await contract.getAddress()
    await db.doc(tokenAddress.toLowerCase()).set({
      web3ContractAddress,
    })

    return { web3ContractAddress }
  }
}
