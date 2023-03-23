import { Anchor, Button, Container, NavLink, NumberInput, Text, TextInput } from "@mantine/core"
import React, { useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import { ToAddressAtom } from "@site/src/atoms/ToAddressAtom"
import { isAddress } from "ethers"
import BalanceOfTokenList from "../BalanceOfTokenList"

export default function MintToken() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [to, setTo] = useAtom(ToAddressAtom)
  const [error, setError] = useState("")
  const [amount, setAmount] = useState(0)
  const [isResOk, setIsResOk] = useState(false)

  let response: Response

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
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

  function setYourWallet() {
    if (walletAddress) {
      setError("")
      setTo(walletAddress)
    } else {
      setError("Please go back and start over from the Create Token page.")
    }
  }

  function onChangeAmount(amount: number) {
    setAmount(amount)
  }

  async function mintToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address)

    const sign = await getSignature(address)

    if (!walletAddress || !tokenAddress) return alert("Please create your Token")

    const url = BaseUrl + "/mint"
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

    if (response.ok) {
      setIsResOk(true)
    }

    // const responseBody = await response.json()
    // console.log("responseBody: ", responseBody)
  }

  return (
    <Container>
      <TextInput
        size={"md"}
        label="WalletAddress to mint your token"
        placeholder="0x000..."
        value={to}
        onChange={(e) => onChangeWalletAddress(e.target.value)}
        onBlur={() => onBlur(to)}
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
      <Button onClick={() => mintToken()}>Mint your Token</Button>
      <BalanceOfTokenList isResOk={isResOk} />
    </Container>
  )
}
