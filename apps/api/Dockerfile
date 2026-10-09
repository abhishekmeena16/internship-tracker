# Production Dockerfile for Express API
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Install root dependencies and workspaces
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/db/package*.json ./packages/db/

RUN npm install --workspace=apps/api --workspace=packages/db

# Copy source code and Prisma schema
COPY packages/db ./packages/db
COPY apps/api ./apps/api
COPY data ./data

# Generate Prisma Client
RUN npm run generate --workspace=packages/db

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

USER node
CMD ["node", "apps/api/server.js"]
