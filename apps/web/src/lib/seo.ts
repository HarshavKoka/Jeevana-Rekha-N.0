import { Metadata } from 'next';
import { Language } from '../types';
import { SITE_CONFIG } from './constants';

export function generateSEO({
    title,
    description,
    lang,
    path = '',
    image = '/assets/globe.jpeg',
    type = 'website'
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

    return {
        title: fullTitle,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_CONFIG.name,
            images: [
                {
                    url: image.startsWith('http') ? image : `${baseUrl}${image}`,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: lang === 'te' ? 'te_IN' : 'en_US',
            type,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
        },
    };
}

export function generateNewsSchema(article: any, lang: Language) {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || `https://${SITE_CONFIG.domain}`;

    const categorySlug = typeof article.category === 'object' ? article.category.slug : 'general';
    const articleUrl = `${baseUrl}/${lang}/${article.publishYear}-${article.publishMonth}-${article.publishDay}/${article.id}/${categorySlug}/${article.slug}`;
    const authorName = typeof article.author === 'object' ? (article.author.name || article.author.email || 'Jeevana Rekha Team') : 'Jeevana Rekha Team';

    return {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
        headline: article.title,
        description: article.excerpt || article.seo?.description || '',
        image: [
            typeof article.heroImage === 'object' ? article.heroImage.url : (article.heroImage || `${baseUrl}/assets/globe.jpeg`)
        ],
        datePublished: new Date(article.publishDate).toISOString(),
        dateModified: new Date(article.updatedAt || article.publishDate).toISOString(),
        author: [{
            '@type': 'Person',
            name: authorName,
        }],
        publisher: {
            '@type': 'Organization',
            name: SITE_CONFIG.name,
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/assets/globe.jpeg`,
            }
        },
        keywords: article.keywords?.map((k: any) => k.keyword).join(', ') || '',
    };
}
