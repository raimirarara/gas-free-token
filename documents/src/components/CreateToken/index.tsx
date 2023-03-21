import { Button, Container, Text, TextInput } from "@mantine/core"
import React from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"

export default function CreateTokenButton() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  async function createToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address || "Not able to get accounts")

    const sign = await getSignature(address)

    // トークンを作成する

    const url = BaseUrl + "/create"
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
      <TextInput
        size={"lg"}
        my={"md"}
        label={"Your WalletAddress"}
        value={walletAddress}
        disabled={!walletAddress}
        readOnly
      />
      <TextInput
        size={"lg"}
        my={"md"}
        label={"Your TokenAddress"}
        value={tokenAddress}
        disabled={!tokenAddress}
        readOnly
      />
    </Container>
  )
}
