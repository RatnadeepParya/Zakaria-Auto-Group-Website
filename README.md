# Zakaria Auto Group LLC — Enterprise Dealership Platform

Web platform and operations management system for **Zakaria Auto Group LLC**, engineered specifically for 24/7 high availability, zero-crash fault tolerance, and pixel-perfect fidelity to the approved luxury dark-mode design specification.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │             Public Visitors            │
                      │   (Desktop, Tablet, Mobile Browsers)   │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │     Next.js 15 (App Router Frontend)   │
                      │     Port 3000 • SSR + Client Hydration  │
                      │  Internal Reverse-Proxy: /api/* -> 4000│
                      └───────────────────┬────────────────────┘
                                          │
                     JSON Requests / Secure httpOnly Cookies
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    Express 4.21 Backend REST Engine    │
                      │  Port 4000 • Helmet • CORS • RateLimit │
                      │  Slowloris Timeouts • Graceful Drain   │
                      └───────────────────┬────────────────────┘
                                          │
                                   Prisma ORM 6.2
                               (Connection Retry Pool)
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │       PostgreSQL 16 Database Cluster   │
                      │  Vehicles • Leads • Credit Apps • Auth │
                      └────────────────────────────────────────┘
```

---

## Design Mockup Implementation (100% Alignment)

| Mockup Panel                | Feature Implemented                                                                                                                                                    | Route / Component                           |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| **Panel 1 (Hero)**          | Showroom visual, "Quality Cars, Transparent Deals", 3 trust cards (_Quality Vehicles, Flexible Financing, Trusted Dealer_), metrics (`9+ Stock, 100% Transparent, 5★`) | `/` (`src/app/page.tsx`)                    |
| **Panel 2 (Inventory)**     | Left filter sidebar (Make, Model, Year, Body Type, Price dual-slider $5k-$50k, Drivetrain, Reset), result counter, Sort by, Grid/List view                             | `/inventory` (`src/app/inventory/page.tsx`) |
| **Panel 3 (Credit App)**    | 4-step wizard (_1. Personal Info, 2. Address, 3. Employment, 4. Review_), SSN formatting, AES-256-GCM encryption                                                       | `/apply` (`src/app/apply/page.tsx`)         |
| **Panel 4 (Find Your Car)** | Category selector (_Sedan, SUV_), Make chips with inventory counts (_BMW, Ford, Chevrolet..._), Financing promo banner                                                 | `/` (`src/app/page.tsx`)                    |
| **Panel 5 (Contact Us)**    | Showroom address (Marietta, GA), Phone `(678) 401-3044`, Hours, interactive location map, "Send Us a Message" lead form                                                | `/contact` (`src/app/contact/page.tsx`)     |
| **Panel 6 (Footer)**        | Centered car silhouette logo, social icons, 3-column directory, dealership legal disclosures, copyright                                                                | `src/components/Footer.tsx`                 |
| **Admin Portal**            | Operations dashboard, KPI cards, Vehicle CRUD, Customer message manager, Credit pre-approval reviewer                                                                  | `/admin` (`src/app/admin/page.tsx`)         |

---

## 24/7 Always-On Reliability Features

1. **Fatal Disconnect Immunity**:
   - The PostgreSQL connection pool listens for idle error events, automatically reconnecting with exponential backoff rather than crashing the process.
2. **Unhandled Rejection Survival**:
   - `process.on('unhandledRejection')` captures and logs unawaited background promises without terminating the API server.
3. **Slowloris & Timeout Defense**:
   - `keepAliveTimeout` set to 65s (exceeding AWS ALB / Cloudflare 60s idle timeouts).
   - `headersTimeout` set to 66s.
   - `requestTimeout` set to 30s to prevent connection exhaustion.
4. **Graceful Connection Draining**:
   - On `SIGTERM` / `SIGINT`, in-flight requests finish cleanly within a 15-second hardkill window before database pools disconnect.
5. **PII Security & Encryption**:
   - Sensitive credit application fields (SSN, license number) are encrypted at rest with AES-256-GCM (`FIELD_ENCRYPTION_KEY`). Unmasked SSNs are never sent over public API responses.
6. **Rate Limiting & Anti-Abuse**:
   - `express-rate-limit` prevents credential brute forcing and form spam.

---

## Quick Start (Local Development)

### Prerequisites:

- **Node.js 20+ LTS** (or Node 22)
- **npm 10+**
- **Docker Desktop** (or a local / cloud PostgreSQL instance)

### One-Command Setup:

```bash
# On macOS / Linux:
./setup.sh

# On Windows (PowerShell):
.\setup.ps1
```

### Manual Setup:

```bash
# 1. Configure environment
cp .env.example .env
cp .env apps/api/.env
cp .env apps/web/.env.local

# 2. Install monorepo dependencies
npm install

# 3. Start PostgreSQL container
docker compose up -d postgres

# 4. Initialize Database Schema & Seed Data
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Launch both API and Web concurrently
npm run dev
```

- **Website**: `http://localhost:3000`
- **Dealer Admin Portal**: `http://localhost:3000/admin`
- **API Health Check**: `http://localhost:4000/health`
- **API Readiness Check**: `http://localhost:4000/ready`

### Seed Administrator Credentials:

- **Email**: `admin@zakariaautogroup.com`
- **Password**: `AdminZakaria2026!`

---

## Production Deployment Guide

### Option 1: PM2 on a VPS / Dedicated Server

```bash
# Build both applications
npm run build

# Start with PM2 Process Supervisor (auto-restart on crash / memory limit)
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Option 2: Cloud Deployment (Vercel + Railway / Render)

1. **Frontend**: Deploy `apps/web` to Vercel. Set `API_URL=https://api.yourdomain.com` in Vercel environment variables.
2. **Backend**: Deploy `apps/api` to Railway or Render. Set `DATABASE_URL`, `JWT_SECRET`, and `WEB_ORIGIN=https://yourdomain.com`.
3. **Database**: Use managed PostgreSQL with automated daily backups (Neon, Supabase, AWS RDS, or Railway).

---

## Dealership Information

- **Company Name**: Zakaria Auto Group LLC
- **Physical Showroom**: 706 Roswell St SE, Marietta, GA 30060
- **Phone**: (678) 401-3044
- **Email**: zakariaautogroup@gmail.com
- **Hours**:
  - Monday – Friday: 10:00 AM – 6:00 PM
  - Saturday: 10:00 AM – 5:00 PM
  - Sunday: Closed
