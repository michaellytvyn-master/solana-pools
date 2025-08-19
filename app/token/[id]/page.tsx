"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import Image from 'next/image'
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type CoinImage = { large?: string; small?: string; thumb?: string }
type Coin = {
  id: string
  name: string
  symbol: string
  image?: CoinImage
  market_data?: { market_cap?: { usd?: number } }
}
type RaydiumInfo = {
  priceUsd?: string | number
  marketCap?: string | number
}

type ApiResponse = {
  coin: Coin | null
  supplyInfo: string | null
  raydiumInfo: RaydiumInfo | null
}

export default function TokenPage() {
  const { id } = useParams<{ id: string }>()
  const [tokenData, setTokenData] = useState<ApiResponse>({
    coin: null,
    supplyInfo: null,
    raydiumInfo: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const firstLoad = useRef(true)

  const fetchTokenData = async () => {
    if (!id) return
    setLoading(true)
    setError(null)

    try{
    const res = await fetch(`/api/tokens/token?id=${id}`,{
      cache: "no-store"
    })
    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`)
    }
      const {coin, supplyInfo, raydiumInfo} = await res.json()
      setTokenData({ coin, supplyInfo, raydiumInfo })
    } catch (err) {
      console.error("Error fetching token data", err)
      setError("Failed to fetch token data")
      setTokenData({ coin: null, supplyInfo: null, raydiumInfo: null })
    } finally {
      setLoading(false)
      firstLoad.current = false
    }
  }

  useEffect(() => {
    fetchTokenData()
    const interval = setInterval(fetchTokenData, 60000)
    return () => clearInterval(interval)
  }, [id])

  // Loader
  if (loading && firstLoad.current) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <p className="p-6 text-red-500">Error: {error}</p>
  }

  if (!tokenData || !tokenData.coin ) return <p className="p-6">No data available</p>

  const { coin, supplyInfo, raydiumInfo } = tokenData

  return (
    <main className="container mx-auto p-6">
      <div className='flex justify-center w-full'>
        <Card className="p-6 w-full max-w-xl">
        <CardHeader className="flex items-center space-x-4">
          {coin && coin.image && coin.image.large && <Image src={coin.image.large} alt={coin.name} width={64} height={64} className="w-16 h-16" />}
          <CardTitle className="text-sm md:text-2xl font-bold">
            {coin.name} ({coin.symbol.toUpperCase()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Symbol</TableCell>
                <TableCell>{coin.symbol.toUpperCase()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Supply</TableCell>
                <TableCell>{supplyInfo || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Price (Raydium)</TableCell>
                <TableCell>
                  {raydiumInfo?.priceUsd
                    ? `$${Number(raydiumInfo.priceUsd).toLocaleString()}`
                    : "N/A"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Market Cap</TableCell>
                <TableCell>
                  {raydiumInfo?.marketCap
                    ? `$${Number(raydiumInfo.marketCap).toLocaleString()}`
                    : coin.market_data?.market_cap?.usd
                    ? `$${coin.market_data.market_cap.usd.toLocaleString()}`
                    : "N/A"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </main>
  )
}
