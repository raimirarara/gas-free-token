import { Anchor, Button, Container, NumberInput, Table, Text } from "@mantine/core"
import React, { useCallback, useEffect, useState } from "react"
import { useAtom } from "jotai"
import { TokenAddressAtom } from "@site/src/atoms/TokenAddressAtom"
import { WalletAddressAtom } from "@site/src/atoms/WalletAddressAtom"
import { getAccount } from "@site/src/utils/getAccount"
import { getSignature } from "@site/src/utils/getSignature"
import { BaseUrl } from "@site/src/constants/BaseUrl"

type Props = {
  isResOk: boolean
  setIsResOk: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BalanceOfTokenList(props: Props) {
  const [tokenAddress, setTokenAddress] = useAtom(TokenAddressAtom)
  const [walletAddress, setWalletAddress] = useAtom(WalletAddressAtom)
  const [token, setToken] = useState(null)
  const [balancesList, setBalancesList] = useState([])

  useEffect(() => {
    console.log("res: ", props.isResOk)
    if (props.isResOk) {
      balanceOfTokenList()
      props.setIsResOk(false)
    }
  }, [props.isResOk])

  async function balanceOfTokenList() {
    const url = BaseUrl + "/balanceOfList"
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

    let balancesList: {
      walletAddress: string
      amount: number
    }[] = []

    for (let i = 0; i < responseBody.walletAddressList.length; i++) {
      balancesList.push({
        walletAddress: responseBody.walletAddressList[i],
        amount: responseBody.amountList[i],
      })
    }

    setBalancesList(balancesList)
  }

  const rows = balancesList.map((element) => (
    <tr key={element.walletAddress}>
      <td>{element.walletAddress}</td>
      <td>{element.amount}</td>
    </tr>
  ))

  return (
    <div>
      {balancesList && (
        <Table withColumnBorders my={"md"}>
          <thead>
            <tr>
              <th>WalletAddress</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
      <Anchor color="indigo" component="button" onClick={() => balanceOfTokenList()}>
        Get balances List
      </Anchor>
    </div>
  )
}
