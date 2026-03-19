import { Article, Language } from '../types';

/**
 * Build a canonical article URL following the pattern:
 *   /{lang}/{YYYY-MM-DD}/{index}/{category}/{slug}
 *
 * Example: /te/2026-02-23/1/today/welcome-to-jeevana-rekha
 */
export function buildArticleUrl(
    lang: Language | string,
    article: Article,
    index = 1,
    originCategory = 'today',
): string {
    if (!article) return `/${lang}`;

    const dateStr = article.publishDate
        ? new Date(article.publishDate).toISOString().split('T')[0]
        : '2026-01-01';

    // article.slug is a plain string (not localized in the CMS schema).
    // Guard against Payload returning a localized object in edge cases.
    const rawSlug: unknown = article.slug;
    let slug = 'article';
    if (typeof rawSlug === 'string' && rawSlug && rawSlug !== 'undefined') {
        slug = rawSlug;
    } else if (rawSlug && typeof rawSlug === 'object') {
        const localized = rawSlug as Record<string, string>;
        slug = localized[lang as string] ?? localized['te'] ?? Object.values(localized)[0] ?? 'article';
    }

    return `/${lang}/${dateStr}/${index}/${originCategory}/${slug}`;
}

/**
 * Parse an article URL back into its named parts.
 * Returns null if the URL does not match the expected pattern.
 */
export function parseArticleUrl(url: string): {
    lang: string;
    date: string;
    index: string;
    category: string;
    slug: string;
} | null {
    const match = url.match(/^\/(\w{2})\/(\d{4}-\d{2}-\d{2})\/(\d+)\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    return {
        lang: match[1],
        date: match[2],
        index: match[3],
        category: match[4],
        slug: match[5],
    };
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
    return '/assets/globe.jpeg';
}
