"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from 'next/image'
import Link from "next/link"

export type Token = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
}

export const columns: ColumnDef<Token>[] = [
  {
    accessorKey: "image",
    header: "Icon",
    cell: ({ row }) => (
      <Image src={row.original.image} alt={row.original.name} className="w-6 h-6" width={24} height={24}/>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/token/${row.original.id}`}
        className="text-blue-500 hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => row.original.symbol.toUpperCase(),
  },
  {
    accessorKey: "current_price",
    header: "Price (USD)",
    cell: ({ row }) => `$${row.original.current_price.toLocaleString()}`,
  },
  {
    accessorKey: "market_cap",
    header: "Market Cap",
    cell: ({ row }) => `$${row.original.market_cap.toLocaleString()}`,
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: "24h Change (%)",
    cell: ({ row }) => (
      <span
        className={
          row.original.price_change_percentage_24h > 0
            ? "text-green-500"
            : "text-red-500"
        }
      >
        {row.original.price_change_percentage_24h.toFixed(2)}%
      </span>
    ),
  },
]
