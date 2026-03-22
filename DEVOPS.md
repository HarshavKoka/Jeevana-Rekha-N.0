# Jeevana Rekha — DevOps Runbook

**Prepared for:** DevOps Engineer
**Project:** Jeevana Rekha News Platform
**Stack:** Next.js 15 + Payload CMS 3 + MongoDB Atlas
**Domain:** jeevanarekha.com
**Repo:** https://github.com/Vijayi-Group/JeevanaRekha

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Environment Variables](#3-environment-variables)
4. [Local Docker Testing](#4-local-docker-testing)
5. [AWS Architecture](#5-aws-architecture)
6. [Step-by-Step AWS Deployment](#6-step-by-step-aws-deployment)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Health Check & Monitoring](#8-health-check--monitoring)
9. [S3 Media Uploads](#9-s3-media-uploads)
10. [Database — MongoDB Atlas](#10-database--mongodb-atlas)
11. [SSL / HTTPS](#11-ssl--https)
12. [Scaling & Performance Notes](#12-scaling--performance-notes)
13. [Rollback Procedure](#13-rollback-procedure)
14. [Troubleshooting Reference](#14-troubleshooting-reference)

---

## 1. Project Overview

Jeevana Rekha is a bilingual (Telugu/English) news platform. It is a **single Next.js application** that serves both:

- **The public news website** — `jeevanarekha.com`
- **The CMS admin panel** — `jeevanarekha.com/admin`

Both run from the **same Node.js process** on port `3000`. There is no separate backend server. Payload CMS is embedded directly inside the Next.js app.

### How requests flow in production

```
User Browser
    │
    ▼
Route 53 (DNS)
    │  jeevanarekha.com       → ALB
    │  admin.jeevanarekha.com → ALB  (same ALB, same EC2, same port)
    ▼
ALB (HTTPS :443 / HTTP :80 → redirect to HTTPS)
    │  forwards to Target Group
    ▼
EC2 (Node.js process on :3000)
    │
    │  Next.js middleware detects hostname:
    │
    ├── admin.jeevanarekha.com/*  ─► rewrites internally to /admin/*
    │                                  (Payload CMS Admin UI)
    ├── jeevanarekha.com/api/*    ─► Payload CMS REST API
    └── jeevanarekha.com/*        ─► Next.js frontend pages
    │
    ▼
MongoDB Atlas (cloud, external)
```

**Key point:** There is only ONE running process, ONE EC2 instance, ONE ALB target group. The `admin.jeevanarekha.com` subdomain is handled entirely by the Next.js middleware — no second server is needed.

### Key facts the DevOps engineer must know

| Fact | Detail |
|------|--------|
| Single port | App runs on port `3000` only |
| No separate API server | Payload CMS is built into Next.js |
| Database | MongoDB Atlas — cloud-hosted, no self-managed DB needed |
| Media storage | Local disk by default → switch to AWS S3 (see §9) |
| Image processing | Sharp (native binary) — requires Linux x86_64 on EC2 |
| Build time | `npm run build` takes ~3–5 minutes (Payload compiles admin panel) |
| Node version | **Node 20 LTS** (enforced in Dockerfile) |

---

## 2. Repository Structure

```
JeevanaRekha/                  ← git root
├── Dockerfile                 ← Multi-stage Docker build (3 stages)
├── .dockerignore              ← Excludes node_modules, .next, .env
├── docker-compose.yml         ← Local testing only (NOT for production)
├── .env.example               ← Template — copy to .env and fill values
├── .env                       ← NEVER commit this file
└── apps/
    └── web/                   ← The Next.js application
        ├── src/
        │   ├── app/
        │   │   ├── (frontend)/     ← Public news pages
        │   │   │   └── [lang]/     ← /te/* and /en/* routes
        │   │   └── (payload)/      ← CMS admin + API routes
        │   │       ├── admin/      ← /admin UI
        │   │       └── api/        ← /api/* REST endpoints
        │   ├── cms/                ← Payload collections & schema
        │   ├── components/         ← React UI components
        │   ├── lib/                ← Data fetching, SEO, URL helpers
        │   └── types/              ← TypeScript interfaces
        ├── package.json
        ├── next.config.ts          ← output: 'standalone' is set here
        └── src/payload.config.ts   ← CMS configuration
```

### What `output: 'standalone'` means for you

The Next.js config has `output: 'standalone'`. This tells Next.js to produce a self-contained `server.js` + minimal `node_modules` inside `.next/standalone/`. The Dockerfile copies only this — **not** the full `node_modules` folder — resulting in a much smaller Docker image (~400MB vs ~1.5GB).

---

## 3. Environment Variables

### How to set them

**Development / local:** Copy `.env.example` to `.env` in the repo root and fill values.
**Production (EC2):** Set as environment variables in the EC2 instance's `/etc/environment` or via an AWS Parameter Store integration. Do **not** store secrets in the Docker image.

### All required variables

```bash
# ── Payload CMS ──────────────────────────────────────────────────────────
# MongoDB Atlas full connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Random secret for signing CMS sessions — minimum 32 characters
# Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
PAYLOAD_SECRET=<long-random-hex-string>

# ── URLs ─────────────────────────────────────────────────────────────────
# Must match the domain the app is served from (used for CORS, canonical URLs)
SERVER_URL=https://jeevanarekha.com
NEXT_PUBLIC_SERVER_URL=https://jeevanarekha.com
NEXT_PUBLIC_CMS_URL=https://jeevanarekha.com

# ── Google Analytics ──────────────────────────────────────────────────────
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ── AWS S3 (media uploads) ────────────────────────────────────────────────
S3_BUCKET=jeevanarekha-media
S3_REGION=ap-south-1
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_S3_BASE_URL=https://jeevanarekha-media.s3.ap-south-1.amazonaws.com
```

### Variables by category

| Variable | Required now? | Notes |
|----------|-------------|-------|
| `MONGODB_URI` | YES | App won't start without it |
| `PAYLOAD_SECRET` | YES | Never reuse across environments |
| `SERVER_URL` | YES | Must match actual domain |
| `NEXT_PUBLIC_SERVER_URL` | YES | Baked into client JS at build time |
| `NEXT_PUBLIC_GA_ID` | NO | Analytics won't load but app works |
| `S3_*` variables | NO (Phase 2) | Media uploads fall back to local disk |

> **Important:** Any variable prefixed with `NEXT_PUBLIC_` is embedded into the JavaScript bundle at **build time**. If you change `NEXT_PUBLIC_SERVER_URL`, you must **rebuild** the Docker image.

---

## 4. Local Docker Testing

Run this on the developer's machine or a staging server before deploying to production.

### Prerequisites

- Docker Desktop installed
- `.env` file filled with real `MONGODB_URI` and `PAYLOAD_SECRET`

### Commands

```bash
# 1. Clone the repo
git clone https://github.com/Vijayi-Group/JeevanaRekha.git
cd JeevanaRekha

# 2. Create .env from template and fill values
cp .env.example .env
# Edit .env with actual MongoDB URI and PAYLOAD_SECRET

# 3. Build and start
docker-compose up --build

# 4. Verify
curl http://localhost:3000/api/health
# Expected: {"status":"ok","service":"jeevanarekha","timestamp":"..."}
```

### What docker-compose does

- Builds the Docker image using the `Dockerfile` in the repo root
- Injects all env vars from your `.env` file
- Mounts a Docker volume (`media_uploads`) so uploaded images persist across restarts
- Maps container port `3000` → host port `3000`

### Check these URLs after startup

| URL | Expected |
|-----|----------|
| `http://localhost:3000` | Homepage (redirects to /te) |
| `http://localhost:3000/admin` | Payload CMS login screen |
| `http://localhost:3000/api/health` | `{"status":"ok"}` |
| `http://localhost:3000/api/articles` | JSON list of articles |

---

## 5. AWS Architecture

### Target production architecture

```
                        ┌──────────────┐
                        │   Route 53   │
                        │ jeevanarekha │
                        │    .com → A  │
                        └──────┬───────┘
                               │ Alias record → ALB
                               ▼
                    ┌──────────────────────┐
                    │  Application Load    │
                    │  Balancer (ALB)      │
                    │                      │
                    │  Listener :80  ──────┼──► Redirect → HTTPS
                    │  Listener :443 ──────┼──► Forward to Target Group
                    │  (ACM cert attached) │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Target Group       │
                    │   Port: 3000         │
                    │   Health: /api/health│
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  EC2 Instance        │
                    │  Ubuntu 22.04 LTS    │
                    │  t3.medium (min)     │
                    │                      │
                    │  Docker container    │
                    │  port 3000           │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
    ┌──────────────────┐             ┌──────────────────┐
    │  MongoDB Atlas   │             │    AWS S3        │
    │  (cloud DB)      │             │  (media uploads) │
    └──────────────────┘             └──────────────────┘
```

### AWS Services required

| Service | Purpose | Notes |
|---------|---------|-------|
| EC2 | Run the Docker container | t3.medium minimum (2 vCPU, 4GB RAM) |
| ALB | Load balancer + HTTPS termination | Single EC2 target is fine |
| ACM | Free SSL certificate | Request in `us-east-1` if using CloudFront, or same region as ALB |
| Route 53 | DNS management | Point domain to ALB |
| S3 | Media/image storage | Create bucket `jeevanarekha-media` |
| ECR | Docker image registry | Optional but recommended |

---

## 6. Step-by-Step AWS Deployment

### Step 1 — EC2 Instance

**Launch settings:**
- AMI: Ubuntu Server 22.04 LTS
- Instance type: `t3.medium` (minimum) — the Next.js build requires memory
- Storage: 20GB gp3
- Key pair: Create or select existing
- Security group — open these ports:

| Port | Protocol | Source | Purpose |
|------|----------|--------|---------|
| 22 | TCP | Your IP only | SSH access |
| 80 | TCP | ALB Security Group | HTTP from ALB |
| 443 | TCP | ALB Security Group | HTTPS from ALB |
| 3000 | TCP | ALB Security Group | App port from ALB |

> Do NOT open port 3000 to `0.0.0.0/0`. Only the ALB should reach it.

**After launch, SSH in and install dependencies:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
# Log out and back in for the group to take effect

# Verify
docker --version
```

### Step 2 — Build and push Docker image

**Option A: Build directly on EC2 (simple)**

```bash
# On EC2 — clone the repo
git clone https://github.com/Vijayi-Group/JeevanaRekha.git
cd JeevanaRekha

# Create .env with production values
nano .env
# Fill in: MONGODB_URI, PAYLOAD_SECRET, SERVER_URL (https://jeevanarekha.com), etc.

# Build the Docker image
docker build -t jeevanarekha:latest .

# Run it
docker run -d \
  --name jeevanarekha_app \
  --restart unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  -v /home/ubuntu/media:/app/public/media \
  jeevanarekha:latest

# Verify
curl http://localhost:3000/api/health
```

**Option B: Build locally, push to ECR, pull on EC2 (recommended for CI/CD)**

```bash
# On your machine — authenticate to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com

# Build
docker build -t jeevanarekha:latest .

# Tag
docker tag jeevanarekha:latest \
  <account-id>.dkr.ecr.ap-south-1.amazonaws.com/jeevanarekha:latest

# Push
docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/jeevanarekha:latest

# On EC2 — pull and run
docker pull <account-id>.dkr.ecr.ap-south-1.amazonaws.com/jeevanarekha:latest
docker run -d \
  --name jeevanarekha_app \
  --restart unless-stopped \
  --env-file /home/ubuntu/.env \
  -p 3000:3000 \
  -v /home/ubuntu/media:/app/public/media \
  <account-id>.dkr.ecr.ap-south-1.amazonaws.com/jeevanarekha:latest
```

### Step 3 — ALB (Application Load Balancer)

1. Go to **EC2 → Load Balancers → Create Load Balancer**
2. Choose **Application Load Balancer**
3. Settings:
   - Name: `jeevanarekha-alb`
   - Scheme: **Internet-facing**
   - IP type: IPv4
   - VPC: same as your EC2
   - Subnets: select at least 2 availability zones
4. Security Group: create one that allows `0.0.0.0/0` on ports 80 and 443
5. Listeners:
   - Add listener: `HTTP :80`
   - Add listener: `HTTPS :443` (attach ACM certificate — see Step 4)

### Step 4 — ACM SSL Certificate

1. Go to **Certificate Manager → Request certificate**
2. Request a **public certificate**
3. Domain names: `jeevanarekha.com` and `*.jeevanarekha.com`
4. Validation: DNS validation (recommended)
5. Add the CNAME records it gives you to Route 53 — validation is automatic
6. Wait ~5 minutes until status is **Issued**
7. Go back to ALB → HTTPS listener → attach this certificate

### Step 5 — Target Group

1. Go to **EC2 → Target Groups → Create Target Group**
2. Settings:
   - Target type: **Instances**
   - Name: `jeevanarekha-tg`
   - Protocol: HTTP
   - Port: **3000**
   - Health check:
     - Protocol: HTTP
     - Path: `/api/health`
     - Healthy threshold: 2
     - Unhealthy threshold: 3
     - Interval: 30 seconds
     - Timeout: 10 seconds
3. Register your EC2 instance as a target

### Step 6 — Connect ALB to Target Group

1. Go to your ALB → Listeners
2. HTTP :80 → Edit → Action: **Redirect to HTTPS** (301)
3. HTTPS :443 → Edit → Action: **Forward to `jeevanarekha-tg`**

### Step 7 — Route 53 DNS

1. Go to **Route 53 → Hosted Zones → jeevanarekha.com**
2. Create records:

| Record name | Type | Value |
|-------------|------|-------|
| `jeevanarekha.com` | A (Alias) | Alias → ALB |
| `www.jeevanarekha.com` | A (Alias) | Alias → ALB |
| `admin.jeevanarekha.com` | A (Alias) | Alias → **same ALB** |

> All three point to the same ALB. Subdomain separation is handled by the app's middleware — no separate server required.

3. ACM certificate must cover `*.jeevanarekha.com` (wildcard) so it is valid for both `jeevanarekha.com` and `admin.jeevanarekha.com`.
4. DNS propagation takes 1–60 minutes

### Step 8 — Verify production

```bash
# Health check via public domain
curl https://jeevanarekha.com/api/health
# Expected: {"status":"ok","service":"jeevanarekha","timestamp":"..."}

# Check HTTPS redirect
curl -I http://jeevanarekha.com
# Expected: HTTP/1.1 301 Moved Permanently, Location: https://...

# Check admin panel
curl -I https://jeevanarekha.com/admin
# Expected: HTTP/1.1 200 OK
```

---

## 7. CI/CD Pipeline

### Recommended: GitHub Actions

Create `.github/workflows/deploy.yml` in the repo:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ secrets.ECR_REGISTRY }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/jeevanarekha:$IMAGE_TAG \
            --build-arg NEXT_PUBLIC_SERVER_URL=https://jeevanarekha.com \
            --build-arg NEXT_PUBLIC_GA_ID=${{ secrets.NEXT_PUBLIC_GA_ID }} \
            .
          docker push $ECR_REGISTRY/jeevanarekha:$IMAGE_TAG
          docker tag $ECR_REGISTRY/jeevanarekha:$IMAGE_TAG $ECR_REGISTRY/jeevanarekha:latest
          docker push $ECR_REGISTRY/jeevanarekha:latest

      - name: Deploy to EC2 via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            aws ecr get-login-password --region ap-south-1 | \
              docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
            docker pull ${{ secrets.ECR_REGISTRY }}/jeevanarekha:latest
            docker stop jeevanarekha_app || true
            docker rm jeevanarekha_app || true
            docker run -d \
              --name jeevanarekha_app \
              --restart unless-stopped \
              --env-file /home/ubuntu/.env \
              -p 3000:3000 \
              -v /home/ubuntu/media:/app/public/media \
              ${{ secrets.ECR_REGISTRY }}/jeevanarekha:latest
```

### GitHub Secrets to configure

| Secret name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | IAM user key with ECR + EC2 permissions |
| `AWS_SECRET_ACCESS_KEY` | Corresponding secret |
| `ECR_REGISTRY` | `<account-id>.dkr.ecr.ap-south-1.amazonaws.com` |
| `EC2_HOST` | EC2 public IP or hostname |
| `EC2_SSH_KEY` | Private key (contents of .pem file) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID |

### Deploy trigger

Every push to `main` branch triggers a full build and deploy. Build takes ~5–8 minutes.

---

## 8. Health Check & Monitoring

### Health endpoint

```
GET /api/health
Response: { "status": "ok", "service": "jeevanarekha", "timestamp": "..." }
HTTP 200
```

This is used by:
- ALB Target Group health check (every 30 seconds)
- Docker HEALTHCHECK (every 30 seconds, starts after 60s)

### Recommended CloudWatch alarms

| Alarm | Metric | Threshold | Action |
|-------|--------|-----------|--------|
| ALB unhealthy hosts | `UnHealthyHostCount` | > 0 for 2 minutes | SNS → email |
| EC2 CPU high | `CPUUtilization` | > 80% for 5 minutes | SNS → email |
| EC2 disk usage | Custom agent metric | > 85% | SNS → email |
| 5xx error rate | `HTTPCode_ELB_5XX_Count` | > 10 per minute | SNS → email |

### Quick status check commands (run on EC2)

```bash
# Is the container running?
docker ps

# View live logs
docker logs -f jeevanarekha_app

# View last 100 log lines
docker logs --tail=100 jeevanarekha_app

# Container resource usage
docker stats jeevanarekha_app

# Test health endpoint locally
curl http://localhost:3000/api/health
```

---

## 9. S3 Media Uploads

### Current state

By default, Payload CMS stores uploaded images on local disk inside the container at `/app/public/media`. The Docker volume `-v /home/ubuntu/media:/app/public/media` persists these on the EC2 disk.

**Problem:** If you replace the container (e.g., deploy a new version), the volume mapping keeps files safe. But if you terminate the EC2 instance, files are lost. For production, configure S3.

### S3 bucket setup

```bash
# Create the bucket (AWS CLI)
aws s3api create-bucket \
  --bucket jeevanarekha-media \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# Enable public read access for media files
aws s3api put-bucket-policy \
  --bucket jeevanarekha-media \
  --policy '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::jeevanarekha-media/*"
    }]
  }'

# Enable CORS (required for browser uploads)
aws s3api put-bucket-cors \
  --bucket jeevanarekha-media \
  --cors-configuration '{
    "CORSRules": [{
      "AllowedOrigins": ["https://jeevanarekha.com"],
      "AllowedMethods": ["GET", "PUT"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }]
  }'
```

### IAM user for S3 access

Create a dedicated IAM user with this policy only — do NOT use root credentials:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::jeevanarekha-media",
        "arn:aws:s3:::jeevanarekha-media/*"
      ]
    }
  ]
}
```

Set the generated keys as `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` in `.env`.

### Pre-signed URL flow (how uploads work)

```
CMS Editor selects image
        │
        ▼
POST /api/upload-url  (ask backend for signed URL)
        │
        ▼
Backend generates pre-signed S3 PUT URL (60s expiry)
        │
        ▼
Browser uploads file directly to S3 using the signed URL
        │
        ▼
Final S3 URL saved in MongoDB as image reference
```

**Why this way:** AWS credentials never leave the server. The browser uploads directly to S3 — no proxying through your Node.js server.

---

## 10. Database — MongoDB Atlas

### Connection

The app connects via `MONGODB_URI`. MongoDB Atlas is fully managed — no database server to maintain on EC2.

### Atlas setup checklist

- [ ] Cluster tier: **M10** minimum for production (M0 free tier has connection limits)
- [ ] Network access: Add EC2's **Elastic IP** to Atlas IP allowlist
- [ ] Database user: `jr_backend` — use a strong password
- [ ] Backup: Enable **continuous backup** in Atlas (paid tiers)
- [ ] Alerts: Set up Atlas alerts for high connection count and disk usage

### Check database connection from EC2

```bash
# From inside the running container
docker exec -it jeevanarekha_app sh -c \
  "node -e \"require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('DB OK')).catch(console.error)\""
```

### Backup procedure

MongoDB Atlas handles automated backups on M10+. For manual backup:

```bash
# Dump database (run on a machine with mongodump installed)
mongodump --uri="$MONGODB_URI" --out=./backup-$(date +%Y%m%d)

# Restore
mongorestore --uri="$MONGODB_URI" ./backup-20260319/
```

---

## 11. SSL / HTTPS

All HTTPS is terminated at the **ALB** using the ACM certificate. The Node.js app itself runs plain HTTP on port 3000 inside the private network — this is correct and standard.

### Certificate renewal

ACM certificates auto-renew. No manual action needed. You will get an email warning 45 days before expiry if there is an issue.

### Force HTTPS

The ALB HTTP :80 listener is configured to redirect to HTTPS :443 with a 301 redirect. The Next.js app also needs to trust the proxy (already handled in production by the ALB passing `X-Forwarded-Proto: https` headers).

---

## 12. Scaling & Performance Notes

### Current single-EC2 setup

This setup handles moderate traffic well. The app uses:
- **ISR (Incremental Static Regeneration):** News pages cache and rebuild every 60 seconds. Static pages (about, privacy) rebuild every 60 minutes. This means most requests are served from cache — very low DB load.
- **In-process Payload singleton:** The Payload CMS instance is cached in memory — no per-request DB connection overhead.

### When to scale

| Signal | Action |
|--------|--------|
| CPU > 80% sustained | Scale up EC2 instance type (t3.large or t3.xlarge) |
| Memory > 90% | Same — Node.js + Next.js needs ~512MB minimum |
| Response time > 1s | Profile with `docker stats`, check DB slow query logs |
| High traffic event | Add a second EC2 behind the same ALB (Target Group) |

### If adding a second EC2

- Both EC2s must share the same environment variables
- If using local disk for media, switch to S3 **before** scaling — local disk is not shared between instances
- Session data in Payload CMS is in MongoDB, so multi-instance works correctly

---

## 13. Rollback Procedure

### Method 1: Revert to previous Docker image (fastest)

```bash
# On EC2 — list recently pulled images
docker images | grep jeevanarekha

# Stop current container
docker stop jeevanarekha_app
docker rm jeevanarekha_app

# Run the previous image tag (use git SHA from ECR)
docker run -d \
  --name jeevanarekha_app \
  --restart unless-stopped \
  --env-file /home/ubuntu/.env \
  -p 3000:3000 \
  -v /home/ubuntu/media:/app/public/media \
  <ECR_REGISTRY>/jeevanarekha:<previous-git-sha>
```

### Method 2: Git revert + redeploy

```bash
# On developer machine
git revert HEAD           # creates a new commit reverting last change
git push origin main      # triggers CI/CD to build and deploy the reverted version
```

### Database rollback

If a deployment changed the MongoDB schema (added/removed fields):
1. Payload CMS 3 is schema-less (MongoDB) — no migrations to undo
2. Old documents simply won't have new fields — default values apply
3. If data was corrupted, restore from Atlas backup snapshot

---

## 14. Troubleshooting Reference

### Container won't start

```bash
docker logs jeevanarekha_app
```

| Error message | Cause | Fix |
|---------------|-------|-----|
| `MongoServerError: Authentication failed` | Wrong MongoDB URI or password | Fix `MONGODB_URI` in `.env` |
| `Error: PAYLOAD_SECRET is required` | Missing env var | Add `PAYLOAD_SECRET` to `.env` |
| `EADDRINUSE: port 3000` | Another process on port 3000 | `sudo lsof -i :3000` then kill it |
| `Cannot find module` | Build artifact missing | Rebuild the Docker image |
| `sharp: module not found` | Native binary mismatch | Ensure Docker image is built for Linux x86_64 |

### ALB shows unhealthy targets

1. Check the container is running: `docker ps`
2. Check health endpoint: `curl http://localhost:3000/api/health`
3. Check security group — ALB security group must be allowed to reach EC2 on port 3000
4. Check health check path is exactly `/api/health` in Target Group settings
5. Increase health check timeout if build just started (container takes ~60s to initialize)

### Site loads but admin panel shows blank page

- Payload CMS admin is a React SPA built at compile time
- Clear browser cache and try again
- Check browser console for JS errors
- Verify `NEXT_PUBLIC_SERVER_URL` matches the actual domain exactly (no trailing slash)

### Images not loading after deploy

- If using local disk: verify the volume mount `-v /home/ubuntu/media:/app/public/media` is in the docker run command
- If using S3: verify `NEXT_PUBLIC_S3_BASE_URL` is set correctly and the S3 bucket has public read access

### High memory usage

```bash
# Check memory inside container
docker stats jeevanarekha_app --no-stream

# If Node.js heap is growing, restart the container (safe — auto-restarts)
docker restart jeevanarekha_app
```

### SSL certificate not working

- ACM certificate must be in the **same AWS region as the ALB**
- Ensure the certificate covers both `jeevanarekha.com` and `www.jeevanarekha.com`
- Check certificate status in ACM console — must say **Issued**

---

## Quick Reference — Most Used Commands

```bash
# ── On EC2 ───────────────────────────────────────────────────────────────

# View running containers
docker ps

# Live application logs
docker logs -f jeevanarekha_app

# Restart app (zero-downtime within the container)
docker restart jeevanarekha_app

# Stop and remove (for redeployment)
docker stop jeevanarekha_app && docker rm jeevanarekha_app

# Check health
curl http://localhost:3000/api/health

# Check disk space (media files grow over time)
df -h

# ── Git / Deploy ─────────────────────────────────────────────────────────

# Deploy latest main branch (triggers CI/CD)
git push origin main

# Pull latest on EC2 manually (if CI/CD not set up yet)
cd ~/JeevanaRekha && git pull && docker build -t jeevanarekha:latest . && \
  docker stop jeevanarekha_app && docker rm jeevanarekha_app && \
  docker run -d --name jeevanarekha_app --restart unless-stopped \
    --env-file .env -p 3000:3000 \
    -v /home/ubuntu/media:/app/public/media jeevanarekha:latest
```

---

*Document version: 1.0 — March 2026*
*Prepared by: Vijayi Software*
*For queries, contact the development team.*
