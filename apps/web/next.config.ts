import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
    // Standalone output bundles only what's needed — smaller Docker image
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
    // Payload v3 requires full Node.js runtime
    experimental: {
        reactCompiler: false,
    },
};

export default withPayload(nextConfig);
