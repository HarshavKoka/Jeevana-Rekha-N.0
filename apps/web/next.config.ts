import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const isDev = process.env.NODE_ENV !== 'production';

// The admin subdomain (admin.jeevanarekha.com) needs to load assets and make
// API calls to the main domain (jeevanarekha.com). We derive it from the env var
// so this works in both staging and production without hardcoding the domain.
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? '';

// Content Security Policy — adjusted for Payload admin UI + Google Analytics
const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    // Include main domain so admin subdomain can load uploaded media
    `img-src 'self' data: blob: https://images.unsplash.com https://img.youtube.com${serverUrl ? ` ${serverUrl}` : ''}`,
    "font-src 'self'",
    // Include main domain so admin subdomain can make API calls
    `connect-src 'self' https://www.google-analytics.com https://analytics.google.com${serverUrl ? ` ${serverUrl}` : ''}`,
    "frame-src 'self' https://www.youtube.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // upgrade-insecure-requests is intentionally omitted — HTTPS is enforced at
    // the ALB layer. Including it causes confusing redirect loops when Node.js
    // sees internal HTTP requests from the proxy.
].join('; ');

const securityHeaders = [
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Content-Security-Policy', value: cspDirectives },
    ...(isDev
        ? []
        : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    ),
];

const nextConfig: NextConfig = {
    // Standalone output bundles only what's needed — smaller Docker image
    output: 'standalone',
    // Don't leak the server technology in response headers
    poweredByHeader: false,
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'img.youtube.com' },
            { protocol: 'http', hostname: 'localhost' },
        ],
    },
    // Payload v3 requires full Node.js runtime
    experimental: {
        reactCompiler: false,
    },
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
};

export default withPayload(nextConfig);
