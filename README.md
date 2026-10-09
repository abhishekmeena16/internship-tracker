# Internship Tracker

A responsive, always up-to-date website listing current internship openings at the top 500 companies in India for CSE-related roles (SDE, Data Analyst, AI Engineer, and similar).

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted via Supabase/Neon)

### Setup

```bash
# 1. Clone and install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your database URL

# 3. Generate Prisma client and push schema
npm run db:generate
npm run db:push

# 4. Seed the database with companies
npm run db:seed

# 5. Run the ingestion pipeline (fetches internships)
npm run ingest

# 6. Start development servers
npm run dev
```

This starts:
- **API server** at http://localhost:4000
- **Web app** at http://localhost:3000

## Project Structure

```
internship-tracker/
  apps/
    web/                    # Next.js frontend (JS)
      app/  components/  lib/
    api/                    # Express backend (JS)
      routes/  controllers/  services/
  packages/
    ingestion/              # Connectors, normalizer, dedup, scheduler
      connectors/  normalize/  jobs/
    db/                     # Prisma schema, migrations, seed
  data/companies.json       # Top 500 list: name, careerUrl, atsType, atsIdentifier
  .github/workflows/        # Cron for ingestion
  README.md
```

## Architecture

Data flows in one direction:

```
[Company list: 500 companies, career URL, ATS type]
    |
[Scheduler: cron every 6-12h]
    |
[Connectors: greenhouse | lever | ashby | smartrecruiters | playwright | aggregator]
    |
[Normalizer: clean fields, classify role, extract stipend/duration/skills]
    |
[Dedup + upsert (Prisma) -> PostgreSQL]    [Expiry: mark closed if missing at source]
    |
[Express API]  ---->  [Next.js frontend: list, filters, detail, bookmarks, alerts]
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS |
| Data fetching | TanStack Query |
| Backend API | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| ATS connectors | Native fetch |
| Scheduling | GitHub Actions cron |

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | /api/internships | List with filters, search, pagination |
| GET | /api/internships/:id | Full internship detail |
| GET | /api/companies | Company list with open counts |
| GET | /api/filters | Available filter values |
| POST | /api/bookmarks | Create bookmark |
| DELETE | /api/bookmarks/:id | Remove bookmark |
| POST | /api/admin/scrape/:companyId | Trigger manual scrape |

## Features (MVP)

- Listing page with search and filters: role category, location/remote, stipend range, duration, deadline, company, skills
- Internship detail page: title, company, location, stipend, duration, skills, eligibility, deadline, posted date, description summary, apply link, source, last verified time
- Automatic expiry: listings that disappear from the source are marked closed
- Responsive layout that works well on phones

## License

MIT
