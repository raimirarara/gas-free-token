import * as functions from "firebase-functions"
import { TokenService } from "../service/TokenService"

export const MigrateTest = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET")
    res.set("Access-Control-Allow-Headers", "Authorization, Content-Type")
    res.set("Access-Control-Max-Age", "3600")
    res.status(204).send("")
    return
  }

  type RequestData = {
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
    walletAddress: string
    signature: string
  }
  const { tokenAddress, tokenName, tokenSymbol, walletAddress, signature }: RequestData = req.body
  try {
    const responseBody = await TokenService.migrate(
      tokenAddress,
      tokenName,
      tokenSymbol,
      walletAddress,
      signature,
      true
    )
    res.status(200).send(responseBody)
  } catch (error: any) {
    res.status(400).send(error.message)
  }
})
