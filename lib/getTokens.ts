import { Token } from "@/types/types"
import axios from "axios"
const CG_URL = "https://api.coingecko.com/api/v3/coins/markets"

type GetTokensOpts = {
  vsCurrency?: string
  category?: string
  perPage?: number
  timeoutMs?: number
}

export async function getTokens(
  page: number,
  {
    vsCurrency = "usd",
    category = "solana-ecosystem",
    perPage = 20,
    timeoutMs = 10_000,
  }: GetTokensOpts = {}
): Promise<Token[]> {
  const { data } = await axios.get<Token[]>(CG_URL, {
    params: {
      vs_currency: vsCurrency,
      category,
      order: "market_cap_desc",
      per_page: perPage,
      page,
      sparkline: false,
      x_cg_demo_api_key: process.env.COIN_GECKO_API_KEY,
    },
    timeout: timeoutMs,
  })

  return data
}
