import { Anchor, Button, Container, Flex, Input, MantineProvider, NumberInput, Text, TextInput } from "@mantine/core"
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

  const [reqError, setReqError] = useState("")

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
    if (!walletAddress) return
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
    setReqError("")

    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address)

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

    if (response.ok) {
      setIsResOk(true)
    } else {
      const errMag = await response.json()
      setReqError(errMag.message)
    }
  }

  return (
    <Container>
      {tokenAddress ? (
        <TextInput
          size={"md"}
          my={"md"}
          label="Your Token Address (created earlier)"
          value={tokenAddress}
          disabled={true}
          readOnly
        />
      ) : (
        <Flex my={"md"}>
          <Anchor size={"lg"} color="red" href={"/docs/tutorial-basics/create-token"}>
            {"Please go back and start over from the Create Token page."}
          </Anchor>
        </Flex>
      )}
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
      <Anchor color="indigo" component="button" onClick={() => setYourWallet()}>
        Set your WalletAddress
      </Anchor>
      <TextInput
        size="md"
        mt={"xs"}
        label="Recipient walletAddress"
        placeholder="0x000..."
        value={to}
        onChange={(e) => onChangeRecipientWalletAddress(e.target.value)}
        onBlur={() => onBlur(to, false)}
        error={recipientError}
        required
      />
      <Anchor color="indigo" component="button" onClick={() => setRandomWallet()}>
        Set random WalletAddress
      </Anchor>
      <NumberInput
        required
        size="lg"
        my={"xs"}
        min={0}
        label="amount"
        value={amount}
        onChange={(e: number) => onChangeAmount(e)}
        step={100}
      />
      <Button color="indigo" onClick={() => transferToken()}>
        Send your Token
      </Button>
      {reqError && (
        <Text size={"md"} color="red">
          {reqError}
        </Text>
      )}
      <BalanceOfTokenList isResOk={isResOk} setIsResOk={setIsResOk} />
    </Container>
  )
}
