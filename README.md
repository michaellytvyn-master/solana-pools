# Solana Pools — Next.js + shadcn/ui

![Demo](demo/img1.jpeg)

A tiny app built with **Next.js (App Router)** and **shadcn/ui** that shows trending **Solana** pools and a dynamic **Token Pool** page.

---

## Features

- **Trending Solana pools** from CoinGecko (≥ 20 rows)
- **Token Pool page** with:
  - name, symbol, image, **total supply** (via Solana RPC)
  - **price & market cap** (via Raydium API)
- **Auto-refresh every 60s**
- Accessible UI with **shadcn/ui Data Table**
- Type-safe with **TypeScript**

---

## Quick Start

```bash
# 1) Install deps
npm i
# or: yarn / pnpm / bun

# 2) Run dev server
npm run dev

# 3) Open the app
http://localhost:3000
