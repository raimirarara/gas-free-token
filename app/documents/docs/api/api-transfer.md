---
sidebar_position: 3
---

# Transfer

## Endpoint

- URL: **https://us-central1-gas-free-token.cloudfunctions.net/transfer**
- Method: POST
- Content Type: application/json

## Description

This API endpoint is used to transfer a specified amount of tokens from the sender's address to a recipient's address. It checks if the token has been migrated, verifies the signature, checks the sender's balance, and updates both the sender's and recipient's balances.

## Request Body

The request body should be a JSON object containing the following fields:

```json
{
  "tokenAddress": "string (required)",
  "to": "string (required)",
  "amount": "number (required)",
  "walletAddress": "string (required)",
  "signature": "string (required)",
  "testMode": "boolean (optional, default: false)"
}
```

- tokenAddress (string, required): The unique UUID representing the token address.
- to (string, required): The recipient's address to which tokens will be transferred.
- amount (number, required): The number of tokens to be transferred.
- walletAddress (string, required): The wallet address of the sender.
- signature (string, required): The signature provided by the sender for verification purposes.
- testMode (boolean, optional, default: false): A flag indicating whether the function is running in test mode. When set to true, the signature verification step will be skipped.

## Response

The API returns a JSON object with the following structure:

```json
{
  "message": "string"
}
```

- message (string): A success message indicating that the transfer operation was successful.

## Errors

- If the token has been migrated, the API returns an error.

```json
{ "message": "This token is already migrated into [Web3ContractAddress]." }
```

- If the sender's balance is insufficient, the API returns an error.

```json
{ "message": "Insufficient balance. You do not have enough tokens to complete this transaction." }
```

## Example

### Request

POST https://us-central1-gas-free-token.cloudfunctions.net/transfer
Content-Type: application/json

```json
{
"tokenAddress": "3d3e5d5e4a4d11ecb2ff9a9a4a9b9c9b",
"to": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
"amount": 500,
"walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
"signature": "0x7b46e862deb24a7a65a87f
}
```

### Response

HTTP/1.1 200 OK
Content-Type: application/json

```json
{
  "message": "Transfer successful. 500 tokens transferred from 0x742d35Cc6634C0532925a3b844Bc454e4438f44e to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
}
```
