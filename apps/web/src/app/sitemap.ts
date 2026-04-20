import type { MetadataRoute } from 'next';
import { getPayload } from 'payload';
import config from '@payload-config';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // rebuild hourly


const CATEGORY_PAGES = [
    'politics', 'sports', 'cinema', 'business',
    'jobs', 'trending', 'fire', 'rekha-flash', 'videos', 'weekly-roundup',
];

const STATIC_PAGES = ['about', 'contact', 'privacy', 'terms', 'editorial-policy'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://jeevanarekha.com';

    // ── Static routes ─────────────────────────────────────────────────────────
    const staticUrls: MetadataRoute.Sitemap = [
        // Homepage
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        // Category listing pages
        ...CATEGORY_PAGES.map((cat) => ({
            url: `${baseUrl}/${cat}`,
            lastModified: new Date(),
            changeFrequency: 'hourly' as const,
            priority: 0.9,
        })),
        // Static info pages
        ...STATIC_PAGES.map((page) => ({
            url: `${baseUrl}/${page}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.4,
        })),
    ];

    // ── Article routes ────────────────────────────────────────────────────────
    let articleUrls: MetadataRoute.Sitemap = [];
    try {
        const payload = await getPayload({ config });
        const { docs } = await payload.find({
            collection: 'articles',
            where: { status: { equals: 'published' } },
            limit: 1000,
            sort: '-publishDate',
            depth: 1,
            locale: 'te',
        });

        articleUrls = docs.map((article) => {
            const dateStr = article.publishDate
                ? new Date(article.publishDate).toISOString().split('T')[0]
                : '2026-01-01';

            const categorySlug =
                typeof article.category === 'object' && article.category !== null
                    ? (article.category as { slug?: string }).slug ?? 'today'
                    : 'today';

            const slug = typeof article.slug === 'string' ? article.slug : 'article';
            const lastMod = article.updatedAt ? new Date(article.updatedAt) : new Date();

            return {
                url: `${baseUrl}/${dateStr}/1/${categorySlug}/${slug}`,
                lastModified: lastMod,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            };
        });
    } catch {
        // DB unavailable — return static sitemap only
    }

    return [...staticUrls, ...articleUrls];
}
