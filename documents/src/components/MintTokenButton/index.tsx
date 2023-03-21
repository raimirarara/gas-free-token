import { Button, Container, NumberInput, Text } from "@mantine/core"
import React, { useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import BalanceOfTokenButton from "../BalanceOfTokenButton"

export default function MintTokenButton() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [amount, setAmount] = useState(0)

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  function onChangeAmount(amount: number) {
    setAmount(amount)
  }

  async function mintToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address || "Not able to get accounts")

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
        to: walletAddress,
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
      <Button onClick={() => mintToken()}>Mint your Token</Button>
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
