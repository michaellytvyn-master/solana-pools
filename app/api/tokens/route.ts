import { getTokens } from '@/lib/getTokens'
import axios from "axios"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get("page") ?? "1") || 1

  try {
    const data = await getTokens(page)
    return NextResponse.json(data)
  } catch (err) {
    const isAxios = axios.isAxiosError(err)
    const status = isAxios ? err.response?.status ?? 500 : 500
    const message = isAxios
      ? (typeof err.response?.data === "string" ? err.response.data : err.message)
      : (err as Error).message

    return NextResponse.json(
      { error: "Failed to fetch from CoinGecko", message },
      { status }
    )
  }
}
