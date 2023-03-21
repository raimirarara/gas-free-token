import { Button, Container, NumberInput, Text, TextInput } from "@mantine/core"
import React, { useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import BalanceOfTokenButton from "../BalanceOfTokenButton"

export default function BurnTokenButton() {
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

  async function burnToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address || "Not able to get accounts")

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

    const responseBody = await response.json()
    console.log(responseBody)
  }

  return (
    <Container>
      <TextInput
        size={"md"}
        my={"md"}
        label={"Your WalletAddress"}
        value={walletAddress}
        disabled={!walletAddress}
        readOnly
      />
      <TextInput
        size={"md"}
        my={"md"}
        label={"Your TokenAddress"}
        value={tokenAddress}
        disabled={!tokenAddress}
        readOnly
      />
      <NumberInput
        required
        size="lg"
        my={"md"}
        min={0}
        label="amount"
        value={amount}
        onChange={(e: number) => onChangeAmount(e)}
        step={100}
      />
      <Button my={8} onClick={() => burnToken()}>
        Burn your Token
      </Button>

      <BalanceOfTokenButton />
    </Container>
  )
}
