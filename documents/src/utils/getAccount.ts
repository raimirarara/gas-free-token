import { ethers } from "ethers"

export async function getAccount() {
  const { ethereum } = window as any
  let accounts: string
  // get account
  try {
    accounts = await ethereum.request({
      method: "eth_accounts",
    })
  } catch (err) {
    console.error(err)
    console.log(`Error: ${err.message}`)
  }
  const address = ethers.getAddress(accounts[0])

  return address
}
