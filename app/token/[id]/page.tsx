"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { fetcher } from '@/lib/fetcher'
import { ApiResponse } from "@/types/types"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import useSWR from "swr"

export default function TokenPage() {
  const { id } = useParams<{ id: string }>()
  const apiUrl = id ? `/api/tokens/token?id=${id}` : null

  const { data, error, isLoading } = useSWR<ApiResponse>(apiUrl, fetcher, {
    refreshInterval: 60_000, 
    revalidateOnFocus: true,
    revalidateIfStale: true,
    dedupingInterval: 2000,
  })

  if (!id) return <p className="p-6">No token id</p>

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    )
  }

  const { coin, supplyInfo, raydiumInfo } = data
  
  if (!coin) return <p className="p-6">No data available</p>

  return (
    <main className="container mx-auto p-6">
      <div className="flex justify-center w-full">
        <Card className="p-2 md:p-6 w-full max-w-xl">
          <CardHeader className="flex items-center space-x-4">
            {coin.image?.large && (
              <Image
                src={coin.image.large}
                alt={coin.name}
                width={64}
                height={64}
                className="w-16 h-16"
              />
            )}
            <CardTitle className="text-sm md:text-2xl font-bold">
              {coin.name} ({coin.symbol?.toUpperCase?.()})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Symbol</TableCell>
                  <TableCell>{coin.symbol?.toUpperCase?.() || "—"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Total Supply</TableCell>
                  <TableCell>{supplyInfo || "N/A"}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Market Cap</TableCell>
                  <TableCell>
                    {coin.market_data?.market_cap?.usd != null
                      ? `$${coin.market_data.market_cap.usd.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Price (Raydium)</TableCell>
                  <TableCell>
                    {raydiumInfo != null ? `$${Number(raydiumInfo).toFixed(10)}`
                      : 'Not available for Raydium yet'}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Price (Market Cap)</TableCell>
                  <TableCell>
                    {coin.market_data?.current_price?.usd != null
                      ? `$${Number(coin.market_data.current_price.usd).toFixed(10)}`
                      : "N/A"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">Categories</TableCell>
                  <TableCell>
                    {coin.categories?.length
                      ? coin.categories.map((c) => <div key={c}>{c}</div>)
                      : "—"}
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
