---
sidebar_position: 2
---

# Mint

## Endpoint

- URL: **https://us-central1-gas-free-token.cloudfunctions.net/mint**
- Method: POST
- Content Type: application/json

## Description

This API endpoint is used to mint a specified amount of tokens to a recipient address. It checks if the token has been migrated, verifies the signature, checks if the owner address matches the signer address, validates the amount, and updates the recipient's balance.

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
- to (string, required): The recipient's address to which tokens will be minted.
- amount (number, required): The number of tokens to be minted.
- walletAddress (string, required): The wallet address of the user.
- signature (string, required): The signature provided by the user for verification purposes.
- testMode (boolean, optional, default: false): A flag indicating whether the function is running in test mode. When set to true, the signature verification step will be skipped.

## Response

The API returns a JSON object with the following structure:

```json
{
  "message": "string"
}
```

- message (string): A success message indicating that the mint operation was successful.

## Errors

- If the token has been migrated, the API returns an error.

```json
{ "message": "This token is already migrated into [Web3ContractAddress]." }
```

- If the walletAddress does not match the owner address, the API returns an error.

```json
{ "message": "Authentication error: You are not allowed to execute this method." }
```

- If the amount is less than 0, the API returns an error.

```json
{ "message": "Error: Invalid amount. Value must be greater than or equal to 0." }
```

## Example

### Request

POST https://us-central1-gas-free-token.cloudfunctions.net/mint
Content-Type: application/json

```json
{
  "tokenAddress": "3d3e5d5e4a4d11ecb2ff9a9a4a9b9c9b",
  "to": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "amount": 1000,
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "signature": "0x7b46e862deb24a7a65a87f0197d9b8745c5ef5ecf1b90a8d51f4175a15f1a2e5"
}
```

### Response

HTTP/1.1 200 OK
Content-Type: application/json

```json
{
  "message": "Mint operation successful"
}
```
