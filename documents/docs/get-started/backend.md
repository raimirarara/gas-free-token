# Code Sample

## Create a token

This API endpoint creates a new token. It expects a POST request with the wallet address and signature in the request body. Upon successful creation, it returns a JSON object with the token address.

```typescript
import { ethers } from "ethers"

// Create a new Wallet instance
const wallet = ethers.Wallet.createRandom()

// Get the address and private key
const walletAddress = wallet.address
const walletPrivateKey = wallet.privateKey

// Create a signature
const signature = await wallet.signMessage(walletAddress)

// Create a token
const options: AxiosRequestConfig = {
  baseURL: "https://us-central1-gas-free-token.cloudfunctions.net",
  url: "/create",
  method: "post",
  data: {
    walletAddress,
    signature,
  },
}
const res = await axios(options)
```

## Mint Token

You can mint gasfree token freely!

```typescript
// Create a token
const options: AxiosRequestConfig = {
  baseURL: "https://us-central1-gas-free-token.cloudfunctions.net",
  url: "/mint",
  method: "post",
  data: {
    tokenAddress,
    to,
    amount,
    walletAddress,
    signature,
  },
}
const res = await axios(options)
```
