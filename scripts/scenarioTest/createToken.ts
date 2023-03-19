import { ethers } from "ethers"
;(async () => {
  // 署名を行う
  const wallet = ethers.Wallet.createRandom()
  const message = wallet.address
  const signature = await wallet.signMessage(message)
  console.log({ wallet, message, signature })

  // トークンを作成する
  const url = "http://127.0.0.1:5001/gas-free-token/us-central1/create"
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      walletAddress: wallet.address,
      signature: signature,
    }),
  })

  const responseBody = await response.json()
  console.log({ responseBody })
})()
