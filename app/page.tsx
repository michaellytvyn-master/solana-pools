import TokensClient from "@/components/TokensClient"
import { getTokens } from "@/lib/getTokens"
import { getTokensMetadata } from "@/lib/metadata"
import type { Metadata } from "next"

export const revalidate = 0

type SearchParamsPromise = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata(
  { searchParams }: { searchParams: SearchParamsPromise }
): Promise<Metadata> {
  const params = await searchParams
  const page = Number(params?.page ?? 1)
  return getTokensMetadata({ page, siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000" })
}

export default async function Page(
  { searchParams }: { searchParams: SearchParamsPromise }
) {
  const params = await searchParams
  const page = Number(params?.page ?? 1)

  let initialTokens = []
  try {
    initialTokens = await getTokens(page)
  } catch {
    return (
      <main className="container mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">🔥 Trending Solana Pools</h1>
        <p className="text-red-500">Failed to fetch tokens</p>
      </main>
    )
  }

  return <TokensClient initialTokens={initialTokens} page={page} />
}
