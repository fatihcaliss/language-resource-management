import crypto from "crypto"

const IYZI_API_URL = "https://sandbox-api.iyzipay.com/cardstorage/card"
const IYZI_URI_PATH = "/cardstorage/card"

function computeHmacSha256(message: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", Buffer.from(secret, "utf8"))
  hmac.update(Buffer.from(message, "utf8"))
  return hmac.digest("hex").toLowerCase()
}

function generateIyzicoAuthHeaders(
  apiKey: string,
  secretKey: string,
  uriPath: string,
  requestBody: string
) {
  const randomKey = `${Date.now().toString()}123456789`
  const payload = `${randomKey}${uriPath}${requestBody}`
  const encryptedData = computeHmacSha256(payload, secretKey)
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${encryptedData}`
  const base64EncodedAuthorization = Buffer.from(
    authorizationString,
    "utf8"
  ).toString("base64")
  const authorization = `IYZWSv2 ${base64EncodedAuthorization}`
  return { authorization, randomKey }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    // Use provided payload or fallback to sample test payload
    const payload =
      Object.keys(body || {}).length > 0
        ? body
        : {
            locale: "tr",
            conversationId: "123456",
            email: "example@example.com",
            externalId: "ext-7890",
            card: {
              cardAlias: "My Visa",
              cardNumber: "5526080000000006",
              expireYear: "2028",
              expireMonth: "12",
              cardHolderName: "Emirhan Kalem",
            },
          }

    const requestBody = JSON.stringify(payload)

    const apiKey =
      process.env.IYZI_API_KEY || "sandbox-VMr1V6P2pONA9kC5esqUUera7k88qw7K"
    const secretKey =
      process.env.IYZI_SECRET_KEY || "sandbox-mtFNtbTB9SnJoBFjTj8dNNTL3Xlq0IUh"

    const { authorization, randomKey } = generateIyzicoAuthHeaders(
      apiKey,
      secretKey,
      IYZI_URI_PATH,
      requestBody
    )

    const iyziResponse = await fetch(IYZI_API_URL, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "x-iyzi-rnd": randomKey,
        "Content-Type": "application/json",
      },
      body: requestBody,
      // iyzico sandbox is public HTTPS
      cache: "no-store",
    })

    const result = await iyziResponse.json()

    return new Response(JSON.stringify(result), {
      status: iyziResponse.ok ? 200 : iyziResponse.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: "failure",
        error: error?.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
