"use client"

import { columns, Token } from "@/components/columns"
import { TokensTable } from "@/components/tokens-table"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstLoad = useRef(true)

  const fetchTokens = async (pageNumber: number) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/tokens?page=${pageNumber}`)
      const data = await res.json()
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
    fetchTokens(page)
    const interval = setInterval(() => fetchTokens(page), 60000)
    return () => clearInterval(interval)
  }, [page])

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
      <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-bold">🔥 Trending Solana Pools</h1>
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
