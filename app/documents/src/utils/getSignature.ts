import { Buffer } from "buffer"

export async function getSignature(address: string) {
  const { ethereum } = window as any
  let sign: string
  // get signature
  const exampleMessage = address
  try {
    const from = address
    const msg = `0x${Buffer.from(exampleMessage, "utf8").toString("hex")}`
    sign = await ethereum.request({
      method: "personal_sign",
      params: [msg, from],
    })
  } catch (err) {
    console.error(err)
  }
  return sign
}
