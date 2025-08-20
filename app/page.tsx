"use client"

import { columns, Token } from "@/components/columns"
import { TokensTable } from "@/components/tokens-table"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const REFRESH_MS = 60_000

export default function HomePage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstLoad = useRef(true)
  const [nextRefreshAt, setNextRefreshAt] = useState<number | null>(null)
  const [secondsLeft, setSecondsLeft] = useState<number>(60)

  const fetchTokens = async (pageNumber: number) => {
    setLoading(true)
    try {
      const { data } = await axios.get<Token[]>("/api/tokens", { params: { page: pageNumber } })
      setTokens(data)
    } catch (err) {
      console.error("Error fetching tokens", err)
      setError("Failed to fetch tokens")
    } finally {
      setLoading(false)
      firstLoad.current = false
    }
  }

  useEffect(() => {
    const run = () => {
      setNextRefreshAt(Date.now() + REFRESH_MS)
      fetchTokens(page)
    }

    run() 
    const intervalId = setInterval(run, REFRESH_MS)
    return () => clearInterval(intervalId)
  }, [page])

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

  if(error) {
    return (
      <main className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">🔥 Trending Solana Pools</h1>
        <p className="text-red-500">{error}</p>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-6 space-y-4">
      <div className='flex items-center justify-between flex-col md:flex-row'>
        <h1 className="text-xl font-bold">🔥 Trending Solana Pools</h1>
          <p className="text-xs text-muted-foreground">
            Next refresh in <span className="font-mono">{formatSeconds(secondsLeft)}</span>
          </p>
        <span className="text-sm font-medium">Page {page}</span>
      </div>
      {loading && firstLoad.current ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
          <TokensTable columns={columns} data={tokens} />
      )}

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          ← Previous
        </Button>
        <span className="text-sm font-medium">Page {page}</span>
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </Button>
      </div>
    </main>
  )
}
