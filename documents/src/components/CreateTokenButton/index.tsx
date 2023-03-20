import { Button, Container, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import { Buffer } from "buffer"

export default function CreateTokenButton() {
  const { ethereum } = window as any
  const [tokenAddress, setTokenAddress] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [signature, setSignature] = useState("")

  let accounts: any
  let sign: any
  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  async function createToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    // get account
    try {
      accounts = await ethereum.request({
        method: "eth_accounts",
      })
    } catch (err) {
      console.error(err)
      console.log(`Error: ${err.message}`)
    }
    const address = ethers.getAddress(accounts[0])

    setWalletAddress(address || "Not able to get accounts")
    // get signature
    const exampleMessage = address
    try {
      const from = address
      const msg = `0x${Buffer.from(exampleMessage, "utf8").toString("hex")}`
      sign = await ethereum.request({
        method: "personal_sign",
        params: [msg, from],
      })
      setSignature(sign)
    } catch (err) {
      console.error(err)
    }

    // トークンを作成する
    const url = "http://127.0.0.1:5001/gas-free-token/us-central1/create"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: address,
        signature: sign,
      }),
    })

    const responseBody = await response.json()
    setTokenAddress(responseBody.tokenAddress as string)
  }

  return (
    <Container>
      <Button onClick={() => createToken()}>Create your Token</Button>
      {walletAddress && <Text>Your WalletAddress : {walletAddress}</Text>}
      {signature && <Text>Your Signature : {signature}</Text>}
      {tokenAddress && <Text>Your TokenAddress : {tokenAddress}</Text>}
    </Container>
  )
}
