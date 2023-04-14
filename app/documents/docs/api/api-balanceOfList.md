---
sidebar_position: 7
---

# BalanceOfList

## Endpoint

- URL: **https://us-central1-gas-free-token.cloudfunctions.net/balanceOfList**
- Method: POST
- Content Type: application/json

## Description

This API endpoint is used to retrieve a list of wallet addresses and their corresponding token amounts for a given token address.

## Request Body

The request body should be a JSON object containing the following fields:

```json
{
  "tokenAddress": "string (required)",
  "walletAddress": "string (required)",
  "testMode": "boolean (optional, default: false)"
}
```

- tokenAddress (string, required): The Ethereum token contract address.
- walletAddress (string, required): The Ethereum wallet address of the user.
- testMode (boolean, optional, default: false): A flag indicating whether the function is running in test mode.

## Response

The API returns a JSON object with the following structure:

```json
{
  "walletAddressList": ["string"],
  "amountList": ["number"]
}
```

- walletAddressList (array of strings): An array of Ethereum wallet addresses for the given token address.
- amountList (array of numbers): An array of token amounts corresponding to the wallet addresses.

## Errors

- If the token has been migrated, the API returns an error.

```json
{
  "message": "This token is already migrated into [Web3ContractAddress]."
}
```

- If the requested token address could not be found in the database, the API returns an error.

```json
{
  "message": "NotFound error: The requested token address could not be found in the database."
}
```

- If the wallet address does not match the ownership of the token, the API returns an error.

```json
{
  "message": "Authentication error: You are not allowed to execute this method."
}
```

## Example

### Request

POST https://us-central1-gas-free-token.cloudfunctions.net/balanceOfList
Content-Type: application/json

```json
{
  "tokenAddress": "0x123456789abcdef",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "testMode": false
}
```

### Response

HTTP/1.1 200 OK
Content-Type: application/json

```json
{
  "walletAddressList": ["0x123456789abcdef", "0x23456789abcdef1"],
  "amountList": [100.5, 50.2]
}
```

```

```
