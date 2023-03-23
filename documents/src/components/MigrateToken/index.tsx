import { Button, Container, TextInput } from "@mantine/core"
import React, { useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"

export default function MigrateToken() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [web3ContractAddress, setWeb3ContractAddress] = useState("")

  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  async function migrateToken() {
    if (!isMetaMaskInstalled) return alert("Please install metamask")

    const address = await getAccount()

    setWalletAddress(address)

    const sign = await getSignature(address)

    if (!walletAddress || !tokenAddress) return alert("Please create your Token")
    if (!tokenName || !tokenSymbol) return alert("Please enter Token Name and Token Symbol")

    const url = BaseUrl + "/migrate"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenAddress: tokenAddress,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        walletAddress: walletAddress,
        signature: sign,
      }),
    })

    const responseBody = await response.json()

    setWeb3ContractAddress(responseBody.web3ContractAddress)
  }

  return (
    <Container>
      <TextInput size={"md"} label="Your WalletAddress" value={walletAddress} disabled={true} readOnly />
      <TextInput
        size={"md"}
        my={"md"}
        label="Your TokenAddress (created earlier)"
        value={tokenAddress}
        disabled={true}
        readOnly
      />
      <TextInput
        size={"lg"}
        mb={"xs"}
        label="Token Name"
        placeholder="ethereum"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        required
      />
      <TextInput
        size={"lg"}
        mb={"xs"}
        label="Token Symbol"
        placeholder="ETH"
        value={tokenSymbol}
        onChange={(e) => setTokenSymbol(e.target.value)}
        required
      />
      <Button onClick={() => migrateToken()}>Migrate your Token</Button>

      <TextInput
        size={"lg"}
        mt={"md"}
        label="web3ContractAddress"
        value={web3ContractAddress}
        onChange={(e) => setTokenSymbol(e.target.value)}
      />
    </Container>
  )
}
