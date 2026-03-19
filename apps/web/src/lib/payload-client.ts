import type { Payload } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';
import { Article, Category, Language } from '../types';

/**
 * Payload CMS Local API client for the Jeevana Rekha frontend.
 * Uses direct database queries (no HTTP overhead) for maximum performance.
 * All functions accept a locale for te/en content.
 */

// Singleton: reuse the same Payload instance across requests
let cachedPayload: Payload | null = null;

async function getPayloadClient(): Promise<Payload> {
    if (!cachedPayload) {
        cachedPayload = await getPayload({ config });
    }
    return cachedPayload;
}

// Shared result shape returned by Payload's find()
type FindResult<T> = {
    docs: T[];
    totalDocs: number;
    totalPages: number;
    page: number;
};

// ─── ARTICLES ──────────────────────────────────────────────────────────────

/** Latest published articles, sorted by date. Use for list/card views. */
export async function getArticles(locale: Language = 'te', limit = 10, page = 1): Promise<FindResult<Article>> {
    const payload = await getPayloadClient();
    return payload.find({
        collection: 'articles',
        locale,
        limit,
        page,
        sort: '-publishDate',
        depth: 1, // category title + heroImage url — enough for cards
        where: { status: { equals: 'published' } },
    }) as Promise<FindResult<Article>>;
}

/** Full article with all relations populated. Use for the article detail page. */
export async function getArticleById(id: string, locale: Language = 'te'): Promise<Article | null> {
    const payload = await getPayloadClient();
    try {
        const doc = await payload.findByID({
            collection: 'articles',
            id,
            locale,
            depth: 2,
        });
        return doc as Article;
    } catch {
        return null;
    }
}

/** Full article by slug. Use for the article detail page. */
export async function getArticleBySlug(slug: string, locale: Language = 'te'): Promise<Article | null> {
    const payload = await getPayloadClient();
    const result = await payload.find({
        collection: 'articles',
        locale,
        limit: 1,
        depth: 2,
        where: {
            slug: { equals: slug },
            status: { equals: 'published' },
        },
    });
    return (result.docs[0] as Article) ?? null;
}

/** Articles for a given category slug. Resolves category in one join at depth 1. */
export async function getArticlesByCategory(
    categorySlug: string,
    locale: Language = 'te',
    limit = 12,
    page = 1,
): Promise<FindResult<Article>> {
    const payload = await getPayloadClient();

    const categories = await payload.find({
        collection: 'categories',
        locale,
        limit: 1,
        depth: 0,
        where: { slug: { equals: categorySlug } },
    });

    if (categories.docs.length === 0) {
        return { docs: [], totalDocs: 0, totalPages: 0, page: 1 };
    }

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
    }) as Promise<FindResult<Article>>;
}

/** Top trending articles for the homepage sidebar and ticker. */
export async function getTrendingArticles(locale: Language = 'te', limit = 10): Promise<FindResult<Article>> {
    const payload = await getPayloadClient();
    return payload.find({
        collection: 'articles',
        locale,
        limit,
        sort: '-publishDate',
        depth: 1,
        where: {
            isTrending: { equals: true },
            status: { equals: 'published' },
        },
    }) as Promise<FindResult<Article>>;
}

/** The single featured (hero) article for the homepage. */
export async function getFeaturedArticle(locale: Language = 'te'): Promise<Article | null> {
    const payload = await getPayloadClient();
    const result = await payload.find({
        collection: 'articles',
        locale,
        limit: 1,
        sort: '-publishDate',
        depth: 1,
        where: {
            isFeatured: { equals: true },
            status: { equals: 'published' },
        },
    });
    return (result.docs[0] as Article) ?? null;
}

/** Articles published on a specific calendar date (year/month/day strings). */
export async function getArticlesByDate(
    year: string,
    month: string,
    day: string,
    locale: Language = 'te',
): Promise<FindResult<Article>> {
    const payload = await getPayloadClient();
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
    }) as Promise<FindResult<Article>>;
}

/** Convenience wrapper: accepts a "YYYY-MM-DD" string. */
export async function getArticlesByDateString(date: string, locale: Language = 'te'): Promise<FindResult<Article>> {
    const [year, month, day] = date.split('-');
    return getArticlesByDate(year, month, day, locale);
}

// ─── CATEGORIES ────────────────────────────────────────────────────────────

/** All categories, sorted by the `order` field set in the CMS. */
export async function getCategories(locale: Language = 'te'): Promise<FindResult<Category>> {
    const payload = await getPayloadClient();
    return payload.find({
        collection: 'categories',
        locale,
        limit: 50,
        depth: 0,
        sort: 'order',
    }) as Promise<FindResult<Category>>;
}

/** Single category by slug. */
export async function getCategoryBySlug(slug: string, locale: Language = 'te'): Promise<Category | null> {
    const payload = await getPayloadClient();
    const result = await payload.find({
        collection: 'categories',
        locale,
        limit: 1,
        depth: 0,
        where: { slug: { equals: slug } },
    });
    return (result.docs[0] as Category) ?? null;
}
