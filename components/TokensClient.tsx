"use client"
import { columns } from "@/components/columns"
import { TokensTable } from "@/components/tokens-table"
import { Button } from "@/components/ui/button"
import { Token } from "@/types/types"
import axios from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"

const REFRESH_MS = 60_000

const fetcher = (url: string) =>
  axios.get<Token[]>(url).then((r) => r.data)

export default function TokensClient({
  initialTokens,
  page,
}: {
  initialTokens: Token[]
  page: number
}) {
  const [nextRefreshAt, setNextRefreshAt] = useState<number | null>(Date.now() + REFRESH_MS)
  const [secondsLeft, setSecondsLeft] = useState<number>(60)
  const firstLoad = useRef(true)

  const {
    data: tokens,
    error,
    isLoading,
    isValidating,
  } = useSWR<Token[]>(`/api/tokens?page=${page}`, fetcher, {
    refreshInterval: REFRESH_MS,
    fallbackData: initialTokens,
    revalidateOnFocus: false,
    onSuccess: () => {
      firstLoad.current = false
      setNextRefreshAt(Date.now() + REFRESH_MS)
    },
  })

  useEffect(() => {
    if (!nextRefreshAt) return
    const id = setInterval(() => {
      const diffMs = nextRefreshAt - Date.now()
      const secs = Math.max(0, Math.ceil(diffMs / 1000))
      setSecondsLeft(secs)
    }, 1000)
    return () => clearInterval(id)
  }, [nextRefreshAt])

  const formatSeconds = (s: number) => {
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
  }

  if (error) {
    return (
      <main className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">🔥 Trending Solana Pools</h1>
        <p className="text-red-500">Failed to fetch tokens</p>
      </main>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between flex-col md:flex-row gap-2">
        <h1 className="text-xl font-bold">🔥 Trending Solana Pools</h1>
        <p className="text-xs text-muted-foreground">
          Next refresh in <span className="font-mono">{formatSeconds(secondsLeft)}</span>
          {isValidating && " · updating..."}
        </p>
        <span className="text-sm font-medium">Page {page}</span>
      </div>

      {isLoading && firstLoad.current ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <TokensTable columns={columns} data={tokens ?? []} />
      )}

      <div className="flex items-center justify-between pt-4">
        <Button asChild variant="outline" disabled={page === 1}>
          <Link href={page === 1 ? `/?page=1` : `/?page=${page - 1}`}>← Previous</Link>
        </Button>

        <span className="text-sm font-medium">Page {page}</span>

        <Button asChild variant="outline">
          <Link href={`/?page=${page + 1}`}>Next →</Link>
        </Button>
      </div>
    </>
  )
}
