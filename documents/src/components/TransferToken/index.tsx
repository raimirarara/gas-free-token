import { Button, Container, Input, NumberInput, Text, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import { ethers, isAddress } from "ethers"
import { ToAddressAtom } from "@site/src/atoms/ToAddressAtom"
import BalanceOfTokenListButton from "../BalanceOfTokenList"
import { FromAddressAtom } from "@site/src/atoms/FromAddressAtom"

export default function TransferToken() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [to, setTo] = useAtom(ToAddressAtom)
  const [from, setFrom] = useAtom(FromAddressAtom)
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

  function setYourWallet() {
    if (walletAddress) {
      setError("")
      setFrom(walletAddress)
    } else {
      setError("Please go back and start over from the Create Token page.")
    }
  }

  function onChangeSenderWalletAddress(walletAddress: string) {
    setError("")
    setFrom(walletAddress)
  }

  function onChangeRecipientWalletAddress(walletAddress: string) {
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
    try {
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

      if (!response.ok) {
        console.log(response)
      }

      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container>
      <TextInput
        size={"md"}
        my={"md"}
        label="Sender WalletAddress"
        placeholder="0x000..."
        value={from}
        onChange={(e) => onChangeSenderWalletAddress(e.target.value)}
        onBlur={() => onBlur(to)}
        error={error}
        required
      />
      <Button size="sm" onClick={() => setYourWallet()}>
        Set your WalletAddress
      </Button>
      <TextInput
        size={"md"}
        my={"md"}
        label="Your Token Address (created earlier)"
        value={tokenAddress}
        disabled={true}
        readOnly
      />
      <TextInput
        size="lg"
        label="Recipient walletAddress"
        placeholder="0x000..."
        value={to}
        onChange={(e) => onChangeRecipientWalletAddress(e.target.value)}
        onBlur={() => onBlur(to)}
        error={error}
        required
      />
      <Button size="sm" my={"md"} onClick={() => setRandomWallet()}>
        Set random WalletAddress
      </Button>
      <NumberInput
        required
        size="lg"
        mt={"md"}
        min={0}
        label="amount"
        value={amount}
        onChange={(e: number) => onChangeAmount(e)}
        step={100}
      />
      <Button my={"md"} onClick={() => transferToken()}>
        Send your Token
      </Button>

      <BalanceOfTokenListButton />
    </Container>
  )
}
