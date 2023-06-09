import { Button, Container, Text, TextInput } from "@mantine/core"
import React, { useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"
import { Notifications, hideNotification, showNotification } from "@mantine/notifications"

export default function CreateToken() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)

  const [error, setError] = useState("")

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  async function createToken() {
    setError("")

    if (!isMetaMaskInstalled) return setError("Please install metamask")

    showNotification({
      id: "create",
      title: "Creating your Token",
      message: "Please wait a few seconds!",
      color: "indigo",
      loading: true,
      autoClose: false,
    })

    try {
      const address = await getAccount()

      setWalletAddress(address)

      const sign = await getSignature(address)

      // トークンを作成する

      const url = BaseUrl + "/create"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: walletAddress || address,
          signature: sign,
        }),
      })

      hideNotification("create")

      const responseBody = await response.json()
      if (response.ok) {
        setTokenAddress(responseBody.tokenAddress as string)
      } else {
        setError(responseBody.message)
      }
    } catch {
      setError("Not able to get accounts. Please login metamask!")
    }
  }

  return (
    <Container>
      <Button color="indigo" onClick={() => createToken()}>
        Create your Token
      </Button>
      {error && <Text color="red">{error}</Text>}
      <TextInput
        size={"lg"}
        my={"md"}
        label="Your WalletAddress"
        placeholder="0x000..."
        value={walletAddress}
        disabled={!walletAddress}
        required
      />
      <TextInput
        size={"lg"}
        my={"md"}
        label={"Your TokenAddress"}
        value={tokenAddress}
        disabled={!tokenAddress}
        readOnly
      />
      <Notifications />
    </Container>
  )
}
