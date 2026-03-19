import { Metadata } from 'next';
import { Article, Language } from '../types';
import { SITE_CONFIG } from './constants';

export function generateSEO({
    title,
    description,
    lang,
    path = '',
    image = '/assets/globe.jpeg',
    type = 'website',
}: {
    title: string;
    description: string;
    lang: Language;
    path?: string;
    image?: string;
    type?: 'website' | 'article';
}): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || `https://${SITE_CONFIG.domain}`;
    const url = `${baseUrl}/${lang}${path}`;
    const fullTitle = `${title} | ${SITE_CONFIG.name}`;
    const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

    return {
        title: fullTitle,
        description,
        alternates: { canonical: url },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_CONFIG.name,
            images: [{ url: absoluteImage, width: 1200, height: 630 }],
            locale: lang === 'te' ? 'te_IN' : 'en_US',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [absoluteImage],
        },
    };
}

/**
 * Generates a Schema.org NewsArticle JSON-LD object for structured data.
 * Accepts a fully populated Article (depth >= 1 so category/author are objects).
 */
export function generateNewsSchema(article: Article, lang: Language): Record<string, unknown> {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || `https://${SITE_CONFIG.domain}`;

    const categorySlug =
        typeof article.category === 'object' ? article.category.slug : 'general';
    const articleUrl = `${baseUrl}/${lang}/${article.publishYear}-${article.publishMonth}-${article.publishDay}/${article.id}/${categorySlug}/${article.slug}`;

    const authorName =
        typeof article.author === 'object'
            ? article.author.name || article.author.email || 'Jeevana Rekha Team'
            : 'Jeevana Rekha Team';

    const heroImageUrl =
        typeof article.heroImage === 'object'
            ? article.heroImage.url
            : article.heroImage || `${baseUrl}/assets/globe.jpeg`;

    return {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
        headline: article.title,
        description: article.excerpt || article.seo?.description || '',
        image: [heroImageUrl],
        datePublished: new Date(article.publishDate).toISOString(),
        dateModified: new Date(article.updatedAt ?? article.publishDate).toISOString(),
        author: [{ '@type': 'Person', name: authorName }],
        publisher: {
            '@type': 'Organization',
            name: SITE_CONFIG.name,
            logo: { '@type': 'ImageObject', url: `${baseUrl}/assets/logo.png` },
        },
        keywords: article.keywords?.map((k) => k.keyword).join(', ') ?? '',
    };
}
