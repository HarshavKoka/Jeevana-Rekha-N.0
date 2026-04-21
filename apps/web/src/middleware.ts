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
    const { pathname } = req.nextUrl;
    const { method } = req;
    const ip = getClientIp(req);
    // CloudFront replaces the Host header with the ALB origin domain.
    // The original viewer hostname is preserved in X-Forwarded-Host.
    // We must read that first, otherwise subdomain detection always fails.
    const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';

    // ── Subdomain routing (Production & Vercel) ──────────────────────────────
    //
    //  admin.jeevanarekha.com/*  →  internally rewrites to /admin/*
    //  jeevanarekha.com/admin/*  →  Returns 404 (Blocked)
    //
    // ─────────────────────────────────────────────────────────────────────────
    const isAdminSubdomain = host.startsWith('admin.');

    if (isAdminSubdomain) {
        // 1. If someone hits admin.jeevanarekha.com/admin/..., strip the /admin
        //    to keep the URL perfectly clean (e.g. admin.jeevanarekha.com/login)
        if (pathname.startsWith('/admin')) {
            const cleanPath = pathname.replace(/^\/admin/, '') || '/';
            const url = req.nextUrl.clone();
            url.pathname = cleanPath;
            return NextResponse.redirect(url, 301);
        }

        // 2. Transparant rewrite: browser stays at admin.jeevanarekha.com/path
        //    while Next.js internally serves /admin/path.
        if (!pathname.startsWith('/api/')) {
            const url = req.nextUrl.clone();
            url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
            return NextResponse.rewrite(url);
        }
        return NextResponse.next();
    }

    // 3. Block /admin access on the main domain (jeevanarekha.com/admin → 404)
    if (pathname.startsWith('/admin')) {
        return new NextResponse(null, { status: 404 });
    }

    // ── Default-language redirect ─────────────────────────────────────────────
    // Removed because it was causing a 308 redirect loop.
    // Telugu is the default language at the root.
    // ─────────────────────────────────────────────────────────────────────────

    // ── Rate limiting ─────────────────────────────────────────────────────────
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
    // Run on all routes except Next.js internals and static files
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
