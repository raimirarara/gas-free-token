---
sidebar_position: 6
---

# BalanceOf

## Endpoint

- URL: **https://us-central1-gas-free-token.cloudfunctions.net/balanceOf**
- Method: POST
- Content Type: application/json

## Description

This API endpoint is used to retrieve the balance of a specific token for a given wallet address.

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
  "tokenAddress": "string",
  "token": "number"
}
```

- tokenAddress (string): The Ethereum token contract address.
- token (number): The token balance for the given wallet address and token address.

## Errors

- If the token has been migrated, the API returns an error.

```json
{
  "message": "This token is already migrated into [Web3ContractAddress]."
}
```

- If the requested wallet address could not be found in the database, the API returns an error.

```json
{
  "message": "NotFound error: The requested wallet address could not be found in the database."
}
```

## Example

### Request

POST https://us-central1-gas-free-token.cloudfunctions.net/balanceOf
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
  "tokenAddress": "0x123456789abcdef",
  "token": 100.5
}
```

```

```
