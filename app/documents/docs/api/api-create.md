---
sidebar_position: 1
---

# Create

## Endpoint

- URL: **https://us-central1-gas-free-token.cloudfunctions.net/create**
- Method: POST
- Content Type: application/json

## Description

This API endpoint is used to create a new token with a unique UUID as its token address. It verifies the provided signature, generates a UUID for the token address, saves the owner address to Firestore, and returns the token address.

## Request Body

The request body should be a JSON object containing the following fields:

```json
{
  "walletAddress": "string (required)",
  "signature": "string (required)",
  "testMode": "boolean (optional, default: false)"
}
```

- walletAddress (string, required): The wallet address of the user.
- signature (string, required): The signature provided by the user for verification purposes.
- testMode (boolean, optional, default: false): A flag indicating whether the function is running in test mode. When set to true, the signature verification step will be skipped.

## Response

The API returns a JSON object with the following structure:

```json
{
  "tokenAddress": "string"
}
```

- tokenAddress (string): The unique UUID (without hyphens) representing the token address, stored in lowercase.

## Errors

- If the walletAddress is not provided, the API returns an error.

```json
{ "message": "Authentication error: walletAddress is not supplied." }
```

- If the signature is not provided, the API returns an error.

```json
{ "message": "Authentication error: signature is not supplied." }
```

## Example

### Request

POST https://us-central1-gas-free-token.cloudfunctions.net/create
Content-Type: application/json

```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "signature": "0x7b46e862deb24a7a65a87f0197d9b8745c5ef5ecf1b90a8d51f4175a15f1a2e5"
}
```

### Response

HTTP/1.1 200 OK
Content-Type: application/json

```json
{
  "tokenAddress": "3d3e5d5e4a4d11ecb2ff9a9a4a9b9c9b"
}
```
