import { Anchor, Button, Container, Flex, TextInput } from "@mantine/core"
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
      <TextInput size={"md"} label="Your WalletAddress" value={walletAddress} disabled={true} readOnly />

      <TextInput
        size={"lg"}
        mt={"md"}
        mb={"xs"}
        label="Token Name"
        placeholder="ethereum"
        value={tokenName}
        onChange={(e) => setTokenName(e.target.value)}
        required
      />
      <TextInput
        size={"lg"}
        my={"xs"}
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
        label="ContractAddress of your token on web3"
        value={web3ContractAddress}
        onChange={(e) => setTokenSymbol(e.target.value)}
        disabled={!web3ContractAddress}
      />
    </Container>
  )
}
