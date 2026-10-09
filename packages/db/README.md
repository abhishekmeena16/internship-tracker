# @internship-tracker/db

This package contains the Prisma database schema and client for the Internship Tracker project.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate Prisma client:
   ```bash
   npm run generate
   ```

## Database Migration

To push the schema to the database without creating a migration file (good for rapid prototyping):
```bash
npm run push
```

To create a new migration and apply it:
```bash
npm run migrate
```

## Seeding

To seed the database with initial company data:
```bash
npm run seed
```

This reads data from `../../data/companies.json` and upserts it into the `Company` table.
