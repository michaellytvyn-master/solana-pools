export type CoinImage = { large?: string; small?: string; thumb?: string }
export type Coin = {
  last: number
  id: string
  name: string
  symbol: string
  image?: CoinImage
  categories?: string[]
  market_data?: {
    market_cap?: { usd?: number }
    current_price?: { usd?: number }
  }
}

export type RaydiumInfo = {
  priceUsd?: string | number
  marketCap?: string | number
  priceUSD?: number
  marketCapUSD?: number
}

export type ApiResponse = {
  coin: Coin | null
  supplyInfo: string | null
  raydiumInfo: RaydiumInfo | null
}