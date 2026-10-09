# 🚀 Internship Tracker — Full Production Deployment Guide

This guide covers deploying the **Internship Tracker** web platform with **automated background ingestion running every 30 minutes** to keep all internship listings fresh, active, and verified.

---

## 🏗️ Architecture Overview

The platform consists of four interconnected parts:
1. **Frontend:** Next.js 14 App Router (`apps/web`) — UI, search filters, and company pages.
2. **Backend API:** Node.js Express REST API (`apps/api`) — authentication, internships API, company data, and built-in background scheduler.
3. **Database:** PostgreSQL with Prisma ORM (`packages/db`).
4. **Ingestion Pipeline:** Multi-ATS crawler (`packages/ingestion`) that fetches live openings from Greenhouse, Lever, Ashby, and company portals, verifies links, and normalizes them for CSE students.

---

## ⏰ How the 30-Minute Automatic Update Works

You have **two automated layers** ensuring roles are fetched every 30 minutes:

### Layer 1: Built-in API Scheduler (Automatic on Server Start)
Inside [`apps/api/services/scheduler.js`](file:///Users/abhishekmeena/.gemini/antigravity/scratch/internship-tracker/apps/api/services/scheduler.js), an automated timer is built right into the Express backend:
- Runs an initial crawl pass 15 seconds after server boot.
- Automatically recurs every **30 minutes** (`SYNC_INTERVAL_MINUTES=30`).
- No extra cron services or plugins needed! As long as the API server is running, the database refreshes automatically.
- Check live crawler status anytime: `GET /api/admin/sync-status`
- Manually trigger an instant crawl: `POST /api/admin/ingest`

### Layer 2: GitHub Actions Scheduled Cron (Decoupled Backup)
Inside [`.github/workflows/ingest.yml`](file:///Users/abhishekmeena/.gemini/antigravity/scratch/internship-tracker/.github/workflows/ingest.yml), a GitHub Action workflow runs every 30 minutes:
- Schedule: `*/30 * * * *`
- Runs directly on GitHub's free runners and executes `npm run ingest`.
- Keeps listings updated even if your backend server is restarting.

---

## 🌐 Recommended Deployment: Free / Low-Cost Cloud Stack

This is the most popular, zero-maintenance setup:
- **Database:** **Neon.tech** or **Supabase** (Free managed PostgreSQL)
- **Backend API:** **Render.com** (Free Web Service)
- **Frontend Web:** **Vercel** (Free Next.js hosting)
- **Background Cron:** Built-in Express Scheduler + GitHub Actions (Both free)

---

### Step 1: Set Up Free Cloud PostgreSQL (Neon or Supabase)

1. Go to [https://neon.tech](https://neon.tech) (or [https://supabase.com](https://supabase.com)) and create a free account.
2. Create a new project (e.g. `internship-tracker`).
3. Select the AWS region closest to your users (e.g., `AWS Asia Pacific (Mumbai)` or `Singapore`).
4. Copy your database connection string:
   ```text
   postgresql://username:password@ep-xyz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
5. On your local machine, test and initialize the schema in your new cloud database:
   ```bash
   # In project root:
   DATABASE_URL="your-cloud-database-url" npm run db:push
   DATABASE_URL="your-cloud-database-url" npm run db:seed
   ```
   *This creates all tables and populates the 350 companies and verified CSE internships.*

---

### Step 2: Push Your Code to GitHub

```bash
git add .
git commit -m "feat: configure 30-minute automated ingestion and deployment setup"
git branch -M main
git remote add origin https://github.com/<your-username>/internship-tracker.git
git push -u origin main
```

---

### Step 3: Deploy the Backend API to Render.com

1. Sign in to [Render.com](https://render.com) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`internship-tracker`).
3. Configure the settings:
   - **Name:** `internship-tracker-api`
   - **Language:** `Node`
   - **Branch:** `main`
   - **Root Directory:** *(leave blank / repository root)*
   - **Build Command:**
     ```bash
     npm install && npm run db:generate
     ```
   - **Start Command:**
     ```bash
     npm run start:api
     ```
4. In the **Environment Variables** section, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `postgresql://...` | Connection string from Step 1 |
   | `JWT_SECRET` | `generate-random-secret` | Run `openssl rand -hex 32` |
   | `API_PORT` | `4000` | Port for Express |
   | `SYNC_INTERVAL_MINUTES` | `30` | Automatically runs crawler every 30 mins |
   | `NODE_ENV` | `production` | Production mode |
5. Click **Create Web Service**.
6. Once deployed, copy your API URL:
   `https://internship-tracker-api.onrender.com`

---

### Step 4: Deploy the Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click Edit and select `apps/web`.
   - **Build Command:** *(default: `next build`)*
   - **Output Directory:** *(default: `.next`)*
4. In **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://internship-tracker-api.onrender.com` |
5. Click **Deploy**.
6. Your website is now live worldwide with instant edge caching!

---

### Step 5: Enable the 30-Minute GitHub Actions Backup

1. In your GitHub repository, navigate to **Settings** -> **Secrets and variables** -> **Actions**.
2. Click **New repository secret**.
3. Add:
   - **Name:** `DATABASE_URL`
   - **Secret:** `postgresql://...` *(your cloud database connection string)*
4. In GitHub, go to the **Actions** tab:
   - You will see the **Ingest Internships** workflow.
   - It will trigger automatically every 30 minutes via `cron: '*/30 * * * *'`.
   - You can also test it immediately by clicking **Run workflow**.

---

## 🖥️ Alternative Option: Single VPS / Docker Deployment

If you prefer hosting everything (Postgres + API + Web + Cron) on a single VPS (DigitalOcean / Hetzner / AWS EC2):

1. **Clone repository on your VPS:**
   ```bash
   git clone https://github.com/<your-username>/internship-tracker.git
   cd internship-tracker
   ```
2. **Configure `.env`:**
   ```bash
   cp .env.example .env
   nano .env
   # Set JWT_SECRET, SYNC_INTERVAL_MINUTES=30
   ```
3. **Start all containers:**
   ```bash
   docker compose up -d --build
   ```
4. **Set system crontab (optional backup):**
   ```bash
   crontab -e
   # Add this line to run ingestion every 30 minutes:
   */30 * * * * cd /path/to/internship-tracker && docker compose exec -T api npm run ingest >> /var/log/ingest.log 2>&1
   ```

---

## 🔍 Verification & Health Monitoring

Once deployed, you can verify that everything is running properly:

1. **Verify Backend Health:**
   ```bash
   curl https://internship-tracker-api.onrender.com/health
   # Response: {"status":"ok","uptime":123.45}
   ```
2. **Verify 30-Minute Scheduler Status:**
   ```bash
   curl https://internship-tracker-api.onrender.com/api/admin/sync-status
   # Response:
   # {
   #   "success": true,
   #   "isRunning": false,
   #   "intervalMinutes": 30,
   #   "lastRunAt": "...",
   #   "nextRunAt": "..."
   # }
   ```
3. **Manually Force a Crawl Anytime:**
   ```bash
   curl -X POST https://internship-tracker-api.onrender.com/api/admin/ingest
   ```
