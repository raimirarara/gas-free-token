import { ethers } from "ethers"
import { v4 as uuidv4 } from "uuid"
import * as admin from "firebase-admin"

export class TokenService {
  private static TopCollectionName = "Contract"
  private static TopCollectionNameTestMode = "Contract-Test"

  private static verifySignature(address: string, signature: string) {
    if (!address) throw new Error("Authentication error: Address is not supplied.")
    if (!signature) throw new Error("Authentication error: Signature is not supplied.")

    // Verify the signature using ethers.js
    const messageHash = ethers.hashMessage(address)
    const recoveredAddress = ethers.recoverAddress(messageHash, signature)

    // Check if the recovered address matches the supplied address
    if (recoveredAddress !== address) {
      throw new Error("Authentication error: Signature cannot be verified.")
    }
  }

  static async create(address: string, signature: string, testMode: boolean = false) {
    // Verify the signature
    if (!testMode) this.verifySignature(address, signature)

    // Generate a new UUID for the token address
    const TokenAddress = uuidv4()

    // Save the owner address to Firestore
    const OwnerAddress = address.toLowerCase() // Ensure the address is in lowercase

    await admin
      .firestore()
      .collection(testMode ? this.TopCollectionNameTestMode : this.TopCollectionName)
      .doc(TokenAddress)
      .set({
        OwnerAddress: OwnerAddress,
      })

    // Return the token address
    return { TokenAddress }
  }
}
