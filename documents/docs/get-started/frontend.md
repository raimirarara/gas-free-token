# Code Sample

## Create a token

To use MetaMask to sign a message, you can use the web3.js library. Here's an updated version of the code that uses MetaMask:

```typescript
import Web3 from "web3"

// Initialize web3
const web3 = new Web3(window.ethereum)

// Request user's permission to access their MetaMask account
await window.ethereum.enable()

// Get the selected account address
const selectedAddress = web3.eth.defaultAccount

// Sign a message using MetaMask
const signature = await web3.eth.personal.sign(selectedAddress, selectedAddress)

// Create a token
const options: AxiosRequestConfig = {
  baseURL: "https://us-central1-gas-free-token.cloudfunctions.net",
  url: "/create",
  method: "post",
  data: {
    walletAddress: selectedAddress,
    signature,
  },
}
const res = await axios(options)
```

## Mint Token

You can mint gasfree token freely!

```typescript
import Web3 from "web3"

// Initialize web3
const web3 = new Web3(window.ethereum)

// Request user's permission to access their MetaMask account
await window.ethereum.enable()

// Get the selected account address
const selectedAddress = web3.eth.defaultAccount

// Sign a message using MetaMask
const signature = await web3.eth.personal.sign(selectedAddress, selectedAddress)

// Mint a token
const contract = new web3.eth.Contract(tokenAbi, tokenAddress)
const data = contract.methods.mint(to, amount).encodeABI()
const nonce = await web3.eth.getTransactionCount(selectedAddress)
const tx = {
  from: selectedAddress,
  to: tokenAddress,
  nonce,
  data,
}
const signedTx = await web3.eth.accounts.signTransaction(tx, signature)
const txHash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
```
