import type { Payload } from 'payload';
import { getPayload } from 'payload';
import { unstable_cache } from 'next/cache';
import config from '@payload-config';
import { Article, Category, Language } from '../types';

/**
 * Payload CMS Local API client for the Jeevana Rekha frontend.
 * Uses direct database queries (no HTTP overhead) for maximum performance.
 * All functions accept a locale for te/en content.
 * Results are cached with Next.js unstable_cache for ISR performance.
 */

// Singleton: reuse the same Payload instance across requests
let cachedPayload: Payload | null = null;

// Shared result shape returned by Payload's find()
type FindResult<T> = {
    docs: T[];
    totalDocs: number;
    totalPages: number;
    page: number;
};

function emptyResult<T>(): FindResult<T> {
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1 };
}

/**
 * Returns null during `next build` (no MongoDB needed at build time).
 * Pages render as lightweight empty shells → ISR fills real data on first request.
 * This lets Docker / GitHub Actions build succeed without whitelisting CI IPs in MongoDB Atlas.
 */
async function getPayloadClient(): Promise<Payload | null> {
    if (process.env.NEXT_PHASE === 'phase-production-build') return null;
    if (!cachedPayload) {
        cachedPayload = await getPayload({ config });
    }
    return cachedPayload;
}

// ─── ARTICLES ──────────────────────────────────────────────────────────────

/** Latest published articles, sorted by date. Use for list/card views. */
export const getArticles = unstable_cache(
    async (locale: Language = 'te', limit = 10, page = 1): Promise<FindResult<Article>> => {
        const payload = await getPayloadClient();
        if (!payload) return emptyResult<Article>();
        return payload.find({
            collection: 'articles',
            locale,
            limit,
            page,
            sort: '-publishDate',
            depth: 1,
            where: { status: { equals: 'published' } },
        }) as unknown as Promise<FindResult<Article>>;
    },
    ['articles-list'],
    { revalidate: 60, tags: ['articles'] },
);

/** Full article with all relations populated. Use for the article detail page. */
export const getArticleById = unstable_cache(
    async (id: string, locale: Language = 'te'): Promise<Article | null> => {
        const payload = await getPayloadClient();
        if (!payload) return null;
        try {
            const doc = await payload.findByID({ collection: 'articles', id, locale, depth: 2 });
            return doc as Article;
        } catch {
            return null;
        }
    },
    ['article-by-id'],
    { revalidate: 300, tags: ['articles'] },
);

/** Full article by slug. Use for the article detail page. */
export const getArticleBySlug = unstable_cache(
    async (slug: string, locale: Language = 'te'): Promise<Article | null> => {
        const payload = await getPayloadClient();
        if (!payload) return null;
        const result = await payload.find({
            collection: 'articles',
            locale,
            limit: 1,
            depth: 2,
            where: { slug: { equals: slug }, status: { equals: 'published' } },
        });
        return (result.docs[0] as Article) ?? null;
    },
    ['article-by-slug'],
    { revalidate: 300, tags: ['articles'] },
);

/** Articles for a given category slug. */
export const getArticlesByCategory = unstable_cache(
    async (
        categorySlug: string,
        locale: Language = 'te',
        limit = 12,
        page = 1,
    ): Promise<FindResult<Article>> => {
        const payload = await getPayloadClient();
        if (!payload) return emptyResult<Article>();

        const categories = await payload.find({
            collection: 'categories',
            locale,
            limit: 1,
            depth: 0,
            where: { slug: { equals: categorySlug } },
        });
        if (categories.docs.length === 0) return emptyResult<Article>();

        return payload.find({
            collection: 'articles',
            locale,
            limit,
            page,
            sort: '-publishDate',
            depth: 1,
            where: {
                category: { equals: categories.docs[0].id },
                status: { equals: 'published' },
            },
        }) as unknown as Promise<FindResult<Article>>;
    },
    ['articles-by-category'],
    { revalidate: 120, tags: ['articles'] },
);

/** Top trending articles for the homepage sidebar and ticker. */
export const getTrendingArticles = unstable_cache(
    async (locale: Language = 'te', limit = 10): Promise<FindResult<Article>> => {
        const payload = await getPayloadClient();
        if (!payload) return emptyResult<Article>();
        return payload.find({
            collection: 'articles',
            locale,
            limit,
            sort: '-publishDate',
            depth: 1,
            where: { isTrending: { equals: true }, status: { equals: 'published' } },
        }) as unknown as Promise<FindResult<Article>>;
    },
    ['trending-articles'],
    { revalidate: 60, tags: ['articles'] },
);

/** The single featured (hero) article for the homepage. */
export const getFeaturedArticle = unstable_cache(
    async (locale: Language = 'te'): Promise<Article | null> => {
        const payload = await getPayloadClient();
        if (!payload) return null;
        const result = await payload.find({
            collection: 'articles',
            locale,
            limit: 1,
            sort: '-publishDate',
            depth: 1,
            where: { isFeatured: { equals: true }, status: { equals: 'published' } },
        });
        return (result.docs[0] as Article) ?? null;
    },
    ['featured-article'],
    { revalidate: 60, tags: ['articles'] },
);

/** Articles published on a specific date (year/month/day strings). */
export const getArticlesByDate = unstable_cache(
    async (year: string, month: string, day: string, locale: Language = 'te'): Promise<FindResult<Article>> => {
        const payload = await getPayloadClient();
        if (!payload) return emptyResult<Article>();
        return payload.find({
            collection: 'articles',
            locale,
            sort: '-publishDate',
            depth: 1,
            where: {
                publishYear: { equals: year },
                publishMonth: { equals: month },
                publishDay: { equals: day },
                status: { equals: 'published' },
            },
        }) as unknown as Promise<FindResult<Article>>;
    },
    ['articles-by-date'],
    { revalidate: 300, tags: ['articles'] },
);

/** Convenience wrapper: accepts a "YYYY-MM-DD" string. */
export async function getArticlesByDateString(date: string, locale: Language = 'te'): Promise<FindResult<Article>> {
    const [year, month, day] = date.split('-');
    return getArticlesByDate(year, month, day, locale);
}

/** Full-text search across article titles and excerpts. Not cached — unique per query. */
export async function searchArticles(query: string, locale: Language = 'te', limit = 12): Promise<FindResult<Article>> {
    if (!query.trim()) return emptyResult<Article>();
    const payload = await getPayloadClient();
    if (!payload) return emptyResult<Article>();
    return payload.find({
        collection: 'articles',
        locale,
        limit,
        depth: 1,
        sort: '-publishDate',
        where: {
            and: [
                { status: { equals: 'published' } },
                { or: [{ title: { contains: query } }, { excerpt: { contains: query } }] },
            ],
        },
    }) as unknown as Promise<FindResult<Article>>;
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────

/** All categories, sorted by the `order` field set in the CMS. */
export const getCategories = unstable_cache(
    async (locale: Language = 'te'): Promise<FindResult<Category>> => {
        const payload = await getPayloadClient();
        if (!payload) return emptyResult<Category>();
        return payload.find({
            collection: 'categories',
            locale,
            limit: 50,
            depth: 0,
            sort: 'order',
        }) as unknown as Promise<FindResult<Category>>;
    },
    ['categories'],
    { revalidate: 3600, tags: ['categories'] },
);

/** Single category by slug. */
export const getCategoryBySlug = unstable_cache(
    async (slug: string, locale: Language = 'te'): Promise<Category | null> => {
        const payload = await getPayloadClient();
        if (!payload) return null;
        const result = await payload.find({
            collection: 'categories',
            locale,
            limit: 1,
            depth: 0,
            where: { slug: { equals: slug } },
        });
        return (result.docs[0] as Category) ?? null;
    },
    ['category-by-slug'],
    { revalidate: 3600, tags: ['categories'] },
);
