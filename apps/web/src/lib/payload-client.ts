import { getPayload } from 'payload';
import config from '@payload-config';
import { Article, Category, Language } from '../types';

/**
 * Payload CMS Local API client for the Jeevana Rekha frontend.
 * Uses direct database queries (no HTTP overhead) for maximum performance.
 * All functions accept a locale for te/en content.
 */

let cachedPayload: any = null;

async function getPayloadClient() {
    if (!cachedPayload) {
        cachedPayload = await getPayload({ config });
    }
    return cachedPayload;
}

// ─── ARTICLES ─────────────────────────────────────────

export async function getArticles(locale: Language = 'te', limit = 10, page = 1) {
    const payload = await getPayloadClient();
    return payload.find({
        collection: 'articles',
        locale,
        limit,
        page,
        sort: '-publishDate',
        depth: 2,
        where: {
            status: { equals: 'published' },
        },
    }) as Promise<{ docs: Article[]; totalDocs: number; totalPages: number; page: number }>;
}

export async function getArticleById(id: string, locale: Language = 'te') {
    const payload = await getPayloadClient();
    try {
        const doc = await payload.findByID({
            collection: 'articles',
            id,
            locale,
            depth: 2,
        });
        return doc as Article | null;
    } catch {
        return null;
    }
}

export async function getArticleBySlug(slug: string, locale: Language = 'te') {
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
    return (result.docs[0] as Article) || null;
}

export async function getArticlesByCategory(categorySlug: string, locale: Language = 'te', limit = 12, page = 1) {
    const payload = await getPayloadClient();

    // First get category ID by slug
    const categories = await payload.find({
        collection: 'categories',
        locale,
        limit: 1,
        where: { slug: { equals: categorySlug } },
    });

    if (categories.docs.length === 0) {
        return { docs: [] as Article[], totalDocs: 0, totalPages: 0, page: 1 };
    }

    return payload.find({
        collection: 'articles',
        locale,
        limit,
        page,
        sort: '-publishDate',
        depth: 2,
        where: {
            category: { equals: categories.docs[0].id },
            status: { equals: 'published' },
        },
    }) as Promise<{ docs: Article[]; totalDocs: number; totalPages: number; page: number }>;
}

export async function getTrendingArticles(locale: Language = 'te', limit = 10) {
    const payload = await getPayloadClient();
    return payload.find({
        collection: 'articles',
        locale,
        limit,
        sort: '-publishDate',
        depth: 2,
        where: {
            isTrending: { equals: true },
            status: { equals: 'published' },
        },
    }) as Promise<{ docs: Article[]; totalDocs: number; totalPages: number; page: number }>;
}

export async function getFeaturedArticle(locale: Language = 'te') {
    const payload = await getPayloadClient();
    const result = await payload.find({
        collection: 'articles',
        locale,
        limit: 1,
        sort: '-publishDate',
        depth: 2,
        where: {
            isFeatured: { equals: true },
            status: { equals: 'published' },
        },
    });
    return (result.docs[0] as Article) || null;
}

export async function getArticlesByDate(year: string, month: string, day: string, locale: Language = 'te') {
    const payload = await getPayloadClient();
    return payload.find({
        collection: 'articles',
        locale,
        sort: '-publishDate',
        depth: 2,
        where: {
            publishYear: { equals: year },
            publishMonth: { equals: month },
            publishDay: { equals: day },
            status: { equals: 'published' },
        },
    }) as Promise<{ docs: Article[]; totalDocs: number; totalPages: number; page: number }>;
}

export async function getArticlesByDateString(date: string, locale: Language = 'te') {
    const [year, month, day] = date.split('-');
    return getArticlesByDate(year, month, day, locale);
}

// ─── CATEGORIES ─────────────────────────────────────────

export async function getCategories(locale: Language = 'te') {
    const payload = await getPayloadClient();
    return payload.find({
        collection: 'categories',
        locale,
        limit: 50,
        sort: 'order',
    }) as Promise<{ docs: Category[]; totalDocs: number; totalPages: number; page: number }>;
}

export async function getCategoryBySlug(slug: string, locale: Language = 'te') {
    const payload = await getPayloadClient();
    const result = await payload.find({
        collection: 'categories',
        locale,
        limit: 1,
        where: { slug: { equals: slug } },
    });
    return (result.docs[0] as Category) || null;
}
