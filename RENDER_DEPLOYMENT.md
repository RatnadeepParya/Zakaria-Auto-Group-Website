# Hosting Zakaria Auto Group on Render (Complete Guide)

This guide provides step-by-step instructions to deploy the **Zakaria Auto Group LLC** web platform and REST API on [Render](https://render.com).

---

## Method 1: 1-Click Blueprint Deployment (Recommended)

The repository includes a root [`render.yaml`](./render.yaml) blueprint specification. Render reads this file and automatically provisions:
1. **Managed PostgreSQL Database** (`zakaria-db`)
2. **REST API Service** (`zakaria-api`)
3. **Next.js Web Client** (`zakaria-web`)
4. Automatic environment variable linking and database seeding.

### Step-by-Step:

1. **Sign In to Render**:
   - Go to [https://dashboard.render.com](https://dashboard.render.com) and sign in (or sign up with your GitHub account).

2. **Create New Blueprint Instance**:
   - Click the **New +** button in the top navigation bar.
   - Select **Blueprint**.
   - Connect your GitHub repository: `<your-github-account>/Zakaria-Auto-Group-Website`.
   - Click **Connect**.

3. **Deploy Blueprint**:
   - Render will display the resources defined in `render.yaml`:
     - `zakaria-db` (PostgreSQL Database)
     - `zakaria-api` (Web Service, Port 4000)
     - `zakaria-web` (Web Service, Next.js)
   - Click **Apply**.

4. **Automated Provisioning & Seeding**:
   - Render provisions the PostgreSQL database.
   - Automatically runs `npm install`, TypeScript compilation, Prisma migrations (`prisma migrate deploy`), and database seeding (`seed.ts`).
   - Seeds the 9 showcase vehicles and the initial admin user.
   - Deploys the Next.js frontend and connects it to the live API.

5. **Your Live URLs**:
   - Web App: `https://zakaria-web.onrender.com`
   - API: `https://zakaria-api.onrender.com/health`
   - Admin Portal: `https://zakaria-web.onrender.com/admin`
     - **Email**: `admin@zakariaautogroup.com`
     - **Password**: `AdminZakaria2026!`

---

## Method 2: Manual Service Setup (If Not Using Blueprints)

If you prefer setting up services individually in Render:

### 1. Create PostgreSQL Database:
- Click **New +** ➔ **PostgreSQL**.
- **Name**: `zakaria-db`
- **Database**: `zakaria_auto_group`
- **User**: `zakaria_admin`
- **Plan**: Free (or Starter)
- Copy the **Internal Database URL** once created.

### 2. Create the Backend API Service:
- Click **New +** ➔ **Web Service**.
- Connect `<your-github-account>/Zakaria-Auto-Group-Website`.
- **Name**: `zakaria-api`
- **Environment**: `Node`
- **Branch**: `master`
- **Build Command**: `npm install && npm run render:api`
- **Start Command**: `npm run start:api`
- **Health Check Path**: `/health`
- **Environment Variables**:
  | Key | Value |
  | :--- | :--- |
  | `NODE_ENV` | `production` |
  | `DATABASE_URL` | *Paste your Internal Database URL from step 1* |
  | `JWT_SECRET` | *Click "Generate" or enter a 32+ char secret* |
  | `COOKIE_SECRET` | *Click "Generate" or enter a 32+ char secret* |
  | `COOKIE_SECURE` | `true` |
  | `FIELD_ENCRYPTION_KEY` | `0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef` |
  | `WEB_ORIGIN` | `https://zakaria-web.onrender.com` *(or your custom domain)* |

### 3. Create the Frontend Web Service:
- Click **New +** ➔ **Web Service**.
- Connect `<your-github-account>/Zakaria-Auto-Group-Website`.
- **Name**: `zakaria-web`
- **Environment**: `Node`
- **Branch**: `master`
- **Build Command**: `npm install && npm run build:web`
- **Start Command**: `npm run start:web`
- **Health Check Path**: `/`
- **Environment Variables**:
  | Key | Value |
  | :--- | :--- |
  | `NODE_ENV` | `production` |
  | `API_URL` | `https://zakaria-api.onrender.com` *(paste your API URL from step 2)* |

---

## Adding a Custom Domain (e.g., `zakariaautogroup.com`)

1. In Render, open your `zakaria-web` service.
2. Go to **Settings** ➔ **Custom Domains**.
3. Add `zakariaautogroup.com` and `www.zakariaautogroup.com`.
4. Update your domain DNS records at your registrar (GoDaddy, Namecheap, Cloudflare) with the CNAME and A records provided by Render.
5. Render will automatically issue and renew a free Let's Encrypt SSL certificate.
