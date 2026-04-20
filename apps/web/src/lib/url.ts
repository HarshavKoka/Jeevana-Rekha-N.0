import { Article, Language } from '../types';

/**
 * Returns the URL prefix for a given language.
 * Telugu is the default language — no prefix in the URL.
 * English uses /en prefix.
 *
 * Examples:
 *   langPath('te', '/trending')  → '/trending'
 *   langPath('en', '/trending')  → '/en/trending'
 *   langPath('te', '/')          → '/'
 *   langPath('en', '/')          → '/en'
 */
export function langPath(lang: Language | string, path: string): string {
    // Language selection is removed, everything defaults to Telugu at the root level.
    return path;
}

/**
 * Build a canonical article URL.
 * Format: /{YYYY-MM-DD}/{articleNumber}/{category}/{slug}
 */
export function buildArticleUrl(
    lang: Language | string,
    article: Article,
    index = 1,
    originCategory = 'today',
): string {
    if (!article) return '/';

    const dateStr = article.publishDate
        ? new Date(article.publishDate).toISOString().split('T')[0]
        : '2026-01-01';

    const category =
        typeof article.category === 'object' && article.category?.slug
            ? article.category.slug
            : originCategory;

    // article.slug is a plain string.
    const rawSlug: unknown = article.slug;
    let slug = 'article';
    if (typeof rawSlug === 'string' && rawSlug && rawSlug !== 'undefined') {
        slug = rawSlug;
    } else if (rawSlug && typeof rawSlug === 'object') {
        const localized = rawSlug as Record<string, string>;
        slug = localized[lang as string] ?? localized['te'] ?? Object.values(localized)[0] ?? 'article';
    }

    return `/${dateStr}/${index}/${category}/${slug}`;
}

/**
 * Parse an article URL back into its named parts.
 * Canonical format: /{YYYY-MM-DD}/{index}/{category}/{slug}
 */
export function parseArticleUrl(url: string): {
    lang: string;
    date: string;
    index: string;
    category: string;
    slug: string;
} | null {
    // Canonical: /date/index/category/slug
    const match = url.match(/^\/(\d{4}-\d{2}-\d{2})\/(\d+)\/([^/]+)\/([^/]+)/);
    if (match) {
        return { lang: 'te', date: match[1], index: match[2], category: match[3], slug: match[4] };
    }
    return null;
}

/**
 * Resolve the best available image URL from a Payload media object or raw string.
 * Falls back through size variants before returning the site placeholder.
 */
export function getImageUrl(
    image: Article['heroImage'],
    size: 'thumbnail' | 'card' | 'hero' | 'tablet' = 'card',
): string {
    if (typeof image === 'string') return image;
    if (image?.sizes?.[size]?.url) return image.sizes[size]!.url;
    if (image?.url) return image.url;
    return '/assets/logo.png';
}
