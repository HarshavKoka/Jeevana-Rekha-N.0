import { Article, Language } from '../types';

/**
 * Build a canonical article URL following the pattern:
 * /{lang}/{YYYY-MM-DD}/{index}/{category}/{slug}
 *
 * Example: /te/2026-02-23/1/today/welcome
 */
export function buildArticleUrl(lang: Language | string, article: Article, index: number = 1, originCategory: string = 'today'): string {
    const a = article as any;
    if (!a) return `/${lang}`;

    const dateStr = a.publishDate ? new Date(a.publishDate).toISOString().split('T')[0] : '2026-01-01';
    const [year, month, day] = dateStr.split('-');

    // 1. Defensively extract Article Slug
    let slug = 'article';
    if (typeof a.slug === 'string' && a.slug) {
        slug = a.slug;
    } else if (typeof a.slug === 'object' && a.slug !== null) {
        slug = a.slug[lang] || a.slug['te'] || Object.values(a.slug)[0] || 'article';
    }
    if (typeof slug !== 'string' || slug === 'undefined') slug = 'article';

    // 2. Origin Category (e.g., today, previous-days)
    const category = originCategory;

    // 3. Final Path Construction
    return `/${lang}/${year}-${month}-${day}/${index}/${category}/${slug}`;
}

/**
 * Parse an article URL back into its parts.
 */
export function parseArticleUrl(url: string): { lang: string; date: string; index: string; category: string; slug: string } | null {
    // New pattern: /[lang]/[date]/[index]/[category]/[slug]
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
 * Build a simple hero image URL from a media object or string.
 */
export function getImageUrl(image: any, size: 'thumbnail' | 'card' | 'hero' | 'tablet' = 'card'): string {
    if (typeof image === 'string') return image;
    if (image?.sizes?.[size]?.url) return image.sizes[size].url;
    if (image?.url) return image.url;
    return '/assets/globe.jpeg'; // fallback
}
