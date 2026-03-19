import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per-IP, resets on cold start / redeploy)
// For multi-instance deployments, replace this with Redis-backed rate limiting.
// ---------------------------------------------------------------------------
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_RULES: Record<string, { limit: number; windowMs: number }> = {
    '/api/fire-reports': { limit: 5, windowMs: 60_000 },   // 5 submissions / minute
    '/api/payload':      { limit: 60, windowMs: 60_000 },  // 60 API calls / minute
};

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'unknown'
    );
}

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }

    if (entry.count >= limit) return true;
    entry.count++;
    return false;
}

export function middleware(req: NextRequest) {
    const { pathname, method } = req.nextUrl;
    const ip = getClientIp(req);

    // Only rate-limit mutating methods
    if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
        for (const [prefix, rule] of Object.entries(RATE_RULES)) {
            if (pathname.startsWith(prefix)) {
                const key = `${ip}:${prefix}`;
                if (isRateLimited(key, rule.limit, rule.windowMs)) {
                    return NextResponse.json(
                        { error: 'Too many requests. Please try again later.' },
                        {
                            status: 429,
                            headers: { 'Retry-After': String(Math.ceil(rule.windowMs / 1000)) },
                        },
                    );
                }
                break;
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/fire-reports/:path*', '/api/payload/:path*'],
};
