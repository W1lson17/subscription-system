# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# Copiamos TODO el monorepo
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter backend build

# ---------- Stage 2: Production ----------
FROM node:20-alpine AS runner

WORKDIR /app
RUN corepack enable

# Copiamos solo lo necesario
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json ./backend/package.json

RUN pnpm install --prod --frozen-lockfile --filter backend

COPY --from=builder /app/backend/dist ./backend/dist

WORKDIR /app/backend

EXPOSE 3000
CMD ["node", "dist/main.js"]