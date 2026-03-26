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
    if (lang === 'te') return path;
    return `/${lang}${path === '/' ? '' : path}`;
}

/**
 * Build a canonical article URL.
 * Telugu (default): /{YYYY-MM-DD}/{index}/{category}/{slug}
 * English:          /en/{YYYY-MM-DD}/{index}/{category}/{slug}
 */
export function buildArticleUrl(
    lang: Language | string,
    article: Article,
    index = 1,
    originCategory = 'today',
): string {
    if (!article) return langPath(lang, '/');

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

    return langPath(lang, `/${dateStr}/${index}/${originCategory}/${slug}`);
}

/**
 * Parse an article URL back into its named parts.
 * Handles both /en/date/... (English) and /date/... (Telugu default).
 */
export function parseArticleUrl(url: string): {
    lang: string;
    date: string;
    index: string;
    category: string;
    slug: string;
} | null {
    // English: /en/date/index/category/slug
    const enMatch = url.match(/^\/en\/(\d{4}-\d{2}-\d{2})\/(\d+)\/([^/]+)\/([^/]+)/);
    if (enMatch) {
        return { lang: 'en', date: enMatch[1], index: enMatch[2], category: enMatch[3], slug: enMatch[4] };
    }
    // Legacy /te/... redirect — should not appear in canonical URLs but handle gracefully
    const teMatch = url.match(/^\/te\/(\d{4}-\d{2}-\d{2})\/(\d+)\/([^/]+)\/([^/]+)/);
    if (teMatch) {
        return { lang: 'te', date: teMatch[1], index: teMatch[2], category: teMatch[3], slug: teMatch[4] };
    }
    // Telugu default: /date/index/category/slug (no lang prefix)
    const defaultMatch = url.match(/^\/(\d{4}-\d{2}-\d{2})\/(\d+)\/([^/]+)\/([^/]+)/);
    if (defaultMatch) {
        return { lang: 'te', date: defaultMatch[1], index: defaultMatch[2], category: defaultMatch[3], slug: defaultMatch[4] };
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
    return '/assets/globe.jpeg';
}
