export const BaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:5001/gas-free-token/us-central1"
    : "https://us-central1-gas-free-token.cloudfunctions.net"
