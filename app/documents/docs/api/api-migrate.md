---
sidebar_position: 5
---

# Migrate

## Endpoint

- URL: **https://us-central1-gas-free-token.cloudfunctions.net/migrate**
- Method: POST
- Content Type: application/json

## Description

This API endpoint is used to migrate a token from the current database to a Web3 contract. It verifies the provided signature, validates the ownership, retrieves wallet addresses and amounts, deploys the contract, and updates the Web3 contract address.

## Request Body

The request body should be a JSON object containing the following fields:

```json
{
  "tokenAddress": "string (required)",
  "tokenName": "string (required)",
  "tokenSymbol": "string (required)",
  "walletAddress": "string (required)",
  "signature": "string (required)",
  "testMode": "boolean (optional, default: false)"
}
```

- tokenAddress (string, required): The unique UUID representing the token address.
- tokenName (string, required): The name of the token.
- tokenSymbol (string, required): The symbol of the token.
- walletAddress (string, required): The wallet address of the user.
- signature (string, required): The signature provided by the user for verification purposes.
- testMode (boolean, optional, default: false): A flag indicating whether the function is running in test mode. When set to true, the signature verification step will be skipped.

## Response

The API returns a JSON object with the following structure:

```json
{
  "web3ContractAddress": "string"
}
```

- web3ContractAddress (string): The contract address for the migrated token on the Web3 network.

## Example

### Request

POST https://us-central1-gas-free-token.cloudfunctions.net/migrate
Content-Type: application/json

```json
{
  "tokenAddress": "3d3e5d5e4a4d11ecb2ff9a9a4a9b9c9b",
  "tokenName": "GasFreeToken",
  "tokenSymbol": "GFT",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "signature": "0x7b46e862deb24a7a65a87f0197d9b8745c5ef5ecf1b90a8d51f4175a15f1a2e5"
}
```

### Response

HTTP/1.1 200 OK
Content-Type: application/json

```json
{
  "web3ContractAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```
