import { Button, Container, NumberInput, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"

export default function BalanceOfTokenButton() {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [token, setToken] = useState(null)

  async function balanceOfToken() {
    const url = BaseUrl + "/balanceOf"
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenAddress: tokenAddress,
        walletAddress: walletAddress,
      }),
    })

    const responseBody = await response.json()
    setToken(responseBody.token)
  }

  return (
    <div>
      <Button onClick={() => balanceOfToken()}>Get your Balance Info</Button>
      {token && <Text>Your Balance : {token}</Text>}
    </div>
  )
}
