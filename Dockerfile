# syntax=docker/dockerfile:1.7

# ---------- Build ----------
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Run (standalone) ----------
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get dist-upgrade -y && rm -rf /var/lib/apt/lists/*
RUN useradd -r -u 1001 -g users nextjs

COPY --chown=nextjs:users --from=build /app/.next/standalone ./
COPY --chown=nextjs:users --from=build /app/.next/static ./.next/static
COPY --chown=nextjs:users --from=build /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
