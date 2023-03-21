import { Button, Container, Input, NumberInput, Text, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import BalanceOfTokenButton from "../BalanceOfTokenButton"
import { ethers, isAddress } from "ethers"
import { ToAddressAtom } from "@site/src/atoms/ToAddressAtom"

export default function TransferTokenButton() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [to, setTo] = useAtom(ToAddressAtom)
  const [error, setError] = useState("")
  const [amount, setAmount] = useState(0)

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  function setRandomWallet() {
    setError("")
    setTo(ethers.Wallet.createRandom().address)
  }

  function onChangeWalletAddress(walletAddress: string) {
    setError("")
    setTo(walletAddress)
  }

  function onBlur(to: string) {
    if (!isAddress(to)) {
      setError("Invalid wallet address'")
    }
  }

  function onChangeAmount(amount: number) {
    setAmount(amount)
  }

  async function transferToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address || "Not able to get accounts")

    const sign = await getSignature(address)

    if (!walletAddress || !tokenAddress) return alert("Please create your Token")

    const url = BaseUrl + "/transfer"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenAddress: tokenAddress,
        to: to,
        amount: Number(amount),
        walletAddress: walletAddress,
        signature: sign,
      }),
    })

    const responseBody = await response.json()
    console.log(responseBody)
  }

  return (
    <Container>
      <TextInput
        label="Recipient walletAddress"
        placeholder="Enter recipient walletAddress"
        value={to}
        onChange={(e) => onChangeWalletAddress(e.target.value)}
        onBlur={() => onBlur(to)}
        error={error}
        required
      />
      <Button size="sm" my={6} onClick={() => setRandomWallet()}>
        Set Random walletAddress
      </Button>
      <NumberInput
        required
        size="md"
        my={6}
        min={0}
        label="amount"
        value={amount}
        onChange={(e: number) => onChangeAmount(e)}
        step={100}
      />
      <Button onClick={() => transferToken()}>Send your Token</Button>
      {walletAddress && <Text>Your WalletAddress : {walletAddress}</Text>}
      {tokenAddress ? (
        <Text>Your TokenAddress : {tokenAddress}</Text>
      ) : (
        <Text color="red">Please create your Token</Text>
      )}
      <BalanceOfTokenButton />
    </Container>
  )
}
