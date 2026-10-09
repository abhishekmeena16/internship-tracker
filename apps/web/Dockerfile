# Production Dockerfile for Next.js Web App
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Install dependencies
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

RUN npm install --workspace=apps/web

# Copy web source
COPY apps/web ./apps/web

# Build Next.js
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://localhost:4000}

RUN npm run build --workspace=apps/web

EXPOSE 3000
ENV PORT=3000

USER node
CMD ["npm", "run", "start", "--workspace=apps/web"]
