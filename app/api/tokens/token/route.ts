import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { NextResponse } from "next/server"

const WSOL_MINT = new PublicKey("So11111111111111111111111111111111111111112")

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from CoinGecko" },
        { status: res.status }
      )
    }

    const coin = await res.json()

    const isNativeSOL =
      coin?.id === "solana" &&
      (!coin.platforms || !coin.platforms.solana || !String(coin.platforms.solana).trim())

    const splMintStr = String(coin?.platforms?.solana || "").trim()
    const isSplOnSolana = !!splMintStr

    if (!isNativeSOL && !isSplOnSolana) {
      return NextResponse.json(
        { error: "Asset is not on Solana (no mint and not native SOL)" },
        { status: 400 }
      )
    }

    const connection = new Connection(process.env.SOLANA_RPC!, "confirmed")

    let supplyInfo: string | null = null
    try {
      if (isNativeSOL) {
        const { value } = await connection.getSupply()
        const circulatingSOL = value.circulating / LAMPORTS_PER_SOL
        supplyInfo = circulatingSOL.toLocaleString(undefined, {
          maximumFractionDigits: 0
        })
      } else {
        const supply = await connection.getTokenSupply(new PublicKey(splMintStr))
        const uiAmount =
          Number(supply.value.amount) / Math.pow(10, supply.value.decimals)
        supplyInfo = uiAmount.toLocaleString()
      }
    } catch (err) {
      console.error("Supply fetch error:", err)
    }

    let raydiumInfo = null
    try {
      const mint = isNativeSOL ? WSOL_MINT.toBase58() : splMintStr;
      const radiumRes = await fetch(`https://api-v3.raydium.io/mint/price?mints=${mint}`)
      if (radiumRes.ok) {
        const {data} = await radiumRes.json()
        console.log('data',data)
        if (data && data !== false) {
          raydiumInfo = data[mint] || null
        }
      }
    } catch (err) {
      console.error("Raydium fetch error:", err)
    }

    return NextResponse.json(
      {
        coin,
        supplyInfo,
        raydiumInfo
      },
      { status: 200 }
    )
  } catch (err) {
    console.error("Server error", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
