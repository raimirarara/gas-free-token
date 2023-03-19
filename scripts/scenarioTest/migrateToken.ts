import { ethers } from "ethers"
;(async () => {
  // 署名を行う
  const wallet = ethers.Wallet.createRandom()
  const message = wallet.address
  const signature = await wallet.signMessage(message)

  // トークンを作成する
  const response = await fetch("http://127.0.0.1:5001/gas-free-token/asia-northeast1/create", {
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
  const tokenAddress = responseBody.tokenAddress

  // トークンを移行する
  const url = "http://127.0.0.1:5001/gas-free-token/asia-northeast1/create"
  const response2 = await fetch("http://127.0.0.1:5001/gas-free-token/asia-northeast1/migrate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tokenAddress: tokenAddress,
      tokenName: "TEST TOKEN",
      tokenSymbol: "TEST",
      walletAddress: wallet.address,
      signature: signature,
    }),
  })

  const responseBody2 = await response2.json()
  console.log({ responseBody2 })
})()
