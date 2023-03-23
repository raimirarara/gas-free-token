import { Anchor, Button, Container, NumberInput, Text, TextInput } from "@mantine/core"
import React, { useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import { FromAddressAtom } from "@site/src/atoms/FromAddressAtom"
import { isAddress } from "ethers"
import BalanceOfTokenList from "../BalanceOfTokenList"

export default function BurnToken() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [from, setFrom] = useAtom(FromAddressAtom)
  const [error, setError] = useState("")
  const [amount, setAmount] = useState(0)
  const [isResOk, setIsResOk] = useState(false)

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  function onChangeWalletAddress(walletAddress: string) {
    setError("")
    setFrom(walletAddress)
  }

  function onBlur(to: string) {
    if (!isAddress(to)) {
      setError("Invalid wallet address'")
    }
  }

  function setYourWallet() {
    if (walletAddress) {
      setError("")
      setFrom(walletAddress)
    } else {
      setError("Please go back and start over from the Create Token page.")
    }
  }

  function onChangeAmount(amount: number) {
    setAmount(amount)
  }

  async function burnToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address)

    const sign = await getSignature(address)

    if (!walletAddress || !tokenAddress) return alert("Please create your Token")

    const url = BaseUrl + "/burn"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenAddress: tokenAddress,
        from: walletAddress,
        amount: Number(amount),
        walletAddress: walletAddress,
        signature: sign,
      }),
    })

    if (response.ok) {
      setIsResOk(true)
    }

    const responseBody = await response.json()
  }

  return (
    <Container>
      <TextInput
        size={"md"}
        label="WalletAddress to burn your token"
        placeholder="0x000..."
        value={from}
        onChange={(e) => onChangeWalletAddress(e.target.value)}
        onBlur={() => onBlur(from)}
        error={error}
        required
      />

      <Anchor component="button" onClick={() => setYourWallet()}>
        Set your WalletAddress
      </Anchor>
      <TextInput
        size={"md"}
        my={"md"}
        label="Your Token Address (created earlier)"
        value={tokenAddress}
        disabled={true}
        readOnly
      />
      <NumberInput
        required
        size="lg"
        mb={"xs"}
        min={0}
        label="amount"
        value={amount}
        onChange={(e: number) => onChangeAmount(e)}
        step={100}
      />
      <Button onClick={() => burnToken()}>Burn your Token</Button>
      <BalanceOfTokenList isResOk={isResOk} />
    </Container>
  )
}
