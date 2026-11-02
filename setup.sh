#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Zakaria Auto Group LLC — Enterprise Setup Bootstrapper"
echo "=========================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# 1. Environment file setup
if [ ! -f .env ]; then
  echo "==> Creating .env from .env.example..."
  cp .env.example .env
  # Copy to workspaces
  cp .env apps/api/.env
  cp .env apps/web/.env.local
  echo "    [ok] .env files configured"
else
  echo "    [!] .env already exists, preserving current configuration."
fi

# 2. Dependency installation
echo "==> Installing workspace dependencies..."
npm install

# 3. Prisma client generation
echo "==> Generating Prisma ORM Client..."
npm run db:generate

echo ""
echo "=========================================================="
echo "  Setup Completed Successfully!"
echo "=========================================================="
echo ""
echo "Next Steps:"
echo "1. Start PostgreSQL (e.g. docker compose up -d postgres, or your cloud DB)"
echo "2. Run database migration: npm run db:migrate"
echo "3. Seed demo inventory & admin: npm run db:seed"
echo "4. Start local development: npm run dev"
echo ""
echo "Public Website:  http://localhost:3000"
echo "Dealer Admin:    http://localhost:3000/admin"
echo "API Server:      http://localhost:4000/health"
echo "=========================================================="
