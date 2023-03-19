;(async () => {
  const tokenAddress = process.argv[2]
  const walletAddress = process.argv[3]
  // トークンを作成する
  const url = "http://127.0.0.1:5001/gas-free-token/us-central1/balanceOf"
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tokenAddress: tokenAddress,
      walletAddress: walletAddress,
    }),
  })

  const responseBody = await response.json()
  console.log({ responseBody })
})()
