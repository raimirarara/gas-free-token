import * as functions from "firebase-functions"
import { TokenService } from "../service/TokenService"

export const Create = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*")
    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "GET")
        res.set("Access-Control-Allow-Headers", "Authorization, Content-Type")
        res.set("Access-Control-Max-Age", "3600")
        res.status(204).send("")
        return
    }

    type RequestData = {
        address: string
        signature: string
    }
    const { address, signature }: RequestData = req.body
    const responseBody = await TokenService.create(address, signature)
    res.status(200).send(responseBody)
})
