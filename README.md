# Solana Pools — Next.js + shadcn/ui

![Demo](demo/img1.jpeg)
![Demo](demo/img2.jpeg)

A tiny app built with **Next.js (App Router)** and **shadcn/ui** that shows trending **Solana** pools and a dynamic **Token Pool** page.

---

## Features

- **Trending Solana pools** from CoinGecko (≥ 20 rows)
- **Pagination** on the home page
- **Token Pool page** with:
  - name, symbol, image, **total supply** (via Solana RPC)
  - **price & market cap** (via Raydium API — see https://api-v3.raydium.io/docs/)
- **Auto-refresh every 60s** (home & token pages)
- **Visible 60s countdown timer** on the home page
- Accessible UI with **shadcn/ui Data Table**
- Type-safe with **TypeScript**

---

## Data Fetching & Architecture

- **Home page (trending list):** classic **SSR** with metadata (title, description, openGraph, canonical, twitter) and **client-side fetch** using `axios` in a client component with pagination with a `refreshInterval` of 60s to keep data fresh.
- **Token page (details):** uses **SWR** (stale-while-revalidate) with a `refreshInterval` of 60s to keep data fresh.
- **API proxying:** all frontend calls go through **internal Next.js API routes** (`/api/*`).  
  External requests (CoinGecko, Raydium, Solana RPC) are made **server-side** to keep API keys in environment variables and **avoid exposing `NEXT_PUBLIC_*` keys** in the browser.

---

## Environment Variables

Add `.env.local` file, use `.env.local.example` as a template

## Quick Start

```bash
# 1) Install deps
npm i
# or: yarn / pnpm / bun

# 2) Run dev server
npm run dev

# 3) Open the app
http://localhost:3000
```

## Quick Start with Docker

Add `.env.local` file before

```bash
docker build --no-cache -t solana-pool-next .
docker run --rm -p 3000:3000 --env-file .env.local solana-pool-next
```