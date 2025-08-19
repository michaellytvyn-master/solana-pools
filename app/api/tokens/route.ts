import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=20&page=${page}&sparkline=false&x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`
    )

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from CoinGecko" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Server error", message: err }, { status: 500 })
  }
}
