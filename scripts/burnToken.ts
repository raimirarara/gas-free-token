;(async () => {
  // トークンをmintする
  const tokenAddress = process.argv[2]
  const from = process.argv[3]
  const amount = process.argv[4]
  const walletAddress = process.argv[5]
  const signature = process.argv[6]

  const url = "http://127.0.0.1:5001/gas-free-token/us-central1/burn"
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tokenAddress: tokenAddress,
      from: from,
      amount: Number(amount),
      walletAddress: walletAddress,
      signature: signature,
    }),
  })

  const responseBody = await response.json()
  console.log({ responseBody })
})()
