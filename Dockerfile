# ============================================================
# Jeevana Rekha — Multi-stage Dockerfile
# Next.js 15 + Payload CMS 3 + Node 20 Alpine
# ============================================================

# ── Stage 1: Install ALL dependencies (needed for build) ────
FROM node:20-alpine AS deps

# libc6-compat is required for sharp (native image processing)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files from apps/web (our actual app)
COPY apps/web/package.json apps/web/package-lock.json* ./

# Install all deps (including devDeps needed for next build)
RUN npm ci --legacy-peer-deps

# ── Stage 2: Build the application ──────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Bring in the installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files from apps/web
COPY apps/web/ .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build-time env vars — two categories:
#
#  1. NEXT_PUBLIC_* vars are embedded into the JS bundle by the Next.js compiler.
#     They MUST be passed here as build args, not at runtime.
#
#  2. MONGODB_URI + PAYLOAD_SECRET are needed because Payload CMS connects to
#     MongoDB during `next build` to pre-render ISR pages.
#
ARG MONGODB_URI
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_GA_ID

ENV MONGODB_URI=$MONGODB_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

# Build Next.js + Payload CMS
# This generates .next/standalone/ because output: 'standalone' is set
RUN npm run build

# ── Stage 3: Production runner (minimal image) ──────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone server output (includes only necessary deps)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets (CSS, JS chunks, images)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder (logo, favicon, etc.)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check — ALB uses this to verify the container is alive
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start the standalone Next.js server (no npm overhead)
CMD ["node", "server.js"]
