import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://jeevanarekha.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Block CMS admin, raw API, and internal Next.js routes
                disallow: ['/admin/', '/api/', '/_next/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
