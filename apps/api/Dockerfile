# Dockerfile for Zakaria Auto Group REST API (Render / Production)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifests for npm workspaces
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm install

# Copy API source and Prisma schema
COPY apps/api ./apps/api

# Generate Prisma Client & compile TypeScript
RUN npm run db:generate -w @zakaria/api
RUN npm run build -w @zakaria/api

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

# Copy node_modules and built assets
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 4000

# Run prisma migration deploy, seed, and launch API
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./apps/api/prisma/schema.prisma && npx tsx ./apps/api/prisma/seed.ts && node apps/api/dist/server.js"]
