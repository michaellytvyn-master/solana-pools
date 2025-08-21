import type { Metadata } from "next"

export function getTokensMetadata({
  page,
  siteUrl,
}: {
  page: number
  siteUrl: string
}): Metadata {
  const title = page > 1
    ? `🔥 Trending Solana Pools — Page ${page}`
    : `🔥 Trending Solana Pools`

  const description =
    "Discover trending Solana pools with real-time data, auto-refresh, and live market insights."

  const image = `${siteUrl}/og-image.webp`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/?page=${page}`,
      siteName: "Solana Pools",
      images: [{ url: image, width: 1200, height: 630, alt: "Trending Solana Pools" }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${siteUrl}/?page=${page}`,
    },
  }
}
