import { Anchor, Button, Container, Input, NumberInput, Text, TextInput } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import { ethers, isAddress } from "ethers"
import BalanceOfTokenList from "../BalanceOfTokenList"

export default function TransferToken() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [to, setTo] = useState("")
  const [from, setFrom] = useState("")
  const [senderError, setSenderError] = useState("")
  const [recipientError, setRecipientError] = useState("")
  const [amount, setAmount] = useState(0)
  const [isResOk, setIsResOk] = useState(false)

  let response: Response

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  function setYourWallet() {
    if (walletAddress) {
      setSenderError("")
      setFrom(walletAddress)
    } else {
      setSenderError("Please go back and start over from the Create Token page.")
    }
  }

  function onChangeSenderWalletAddress(walletAddress: string) {
    setSenderError("")
    setFrom(walletAddress)
  }

  function setRandomWallet() {
    setRecipientError("")
    setTo(ethers.Wallet.createRandom().address)
  }

  function onChangeRecipientWalletAddress(walletAddress: string) {
    setRecipientError("")
    setTo(walletAddress)
  }

  function onBlur(walletAddress: string, isSender: boolean) {
    if (!isAddress(walletAddress)) {
      if (isSender) {
        setSenderError("Invalid wallet address'")
      } else {
        setRecipientError("Invalid wallet address'")
      }
    }
  }

  function onChangeAmount(amount: number) {
    setAmount(amount)
  }

  async function transferToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address)

    const sign = await getSignature(address)

    if (!walletAddress || !tokenAddress) return alert("Please create your Token")

    const url = BaseUrl + "/transfer"
    response = await fetch(url, {
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

    if (response.ok) {
      setIsResOk(true)
    }

    // const data = await response.json()
    // console.log(data)
  }

  return (
    <Container>
      <TextInput
        size={"md"}
        label="Sender WalletAddress"
        placeholder="0x000..."
        value={from}
        onChange={(e) => onChangeSenderWalletAddress(e.target.value)}
        onBlur={() => onBlur(from, true)}
        error={senderError}
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
      <TextInput
        size="lg"
        mb={"xs"}
        label="Recipient walletAddress"
        placeholder="0x000..."
        value={to}
        onChange={(e) => onChangeRecipientWalletAddress(e.target.value)}
        onBlur={() => onBlur(to, false)}
        error={recipientError}
        required
      />
      <Button size="sm" onClick={() => setRandomWallet()}>
        Set random WalletAddress
      </Button>
      <NumberInput
        required
        size="lg"
        mt={"md"}
        mb={"xs"}
        min={0}
        label="amount"
        value={amount}
        onChange={(e: number) => onChangeAmount(e)}
        step={100}
      />
      <Button onClick={() => transferToken()}>Send your Token</Button>

      <BalanceOfTokenList isResOk={isResOk} setIsResOk={setIsResOk} />
    </Container>
  )
}
