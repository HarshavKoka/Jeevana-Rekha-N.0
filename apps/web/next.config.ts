import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const isDev = process.env.NODE_ENV !== 'production';

// Content Security Policy — adjusted for Payload admin UI + Google Analytics
const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://images.unsplash.com https://img.youtube.com",
    "font-src 'self'",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
    "frame-src 'self' https://www.youtube.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
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
