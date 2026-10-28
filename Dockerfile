# ---------- 1. Install dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2. Build the app ----------
FROM node:22-alpine AS builder
WORKDIR /app

# The backend URL is baked into the proxy rules at build time.
# Inside a container, "localhost" means the container itself, so the default
# points at the host machine (works on Docker Desktop for Windows/Mac).
ARG BACKEND_URL=http://host.docker.internal:3002
ENV BACKEND_URL=$BACKEND_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public && npm run build

# ---------- 3. Small runtime image ----------
FROM node:22-alpine AS runner
WORKDIR /app

ARG BACKEND_URL=http://host.docker.internal:3002
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    BACKEND_URL=$BACKEND_URL

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
