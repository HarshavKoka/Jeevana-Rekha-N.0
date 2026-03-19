import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article, Language } from '@/types';
import { getArticlesByCategory } from '@/lib/payload-client';
import { buildArticleUrl, getImageUrl } from '@/lib/url';
import { generateSEO } from '@/lib/seo';
import SectionTitle from '@/components/SectionTitle';
import CategoryBadge from '@/components/CategoryBadge';
import { Metadata } from 'next';

interface CategoryListPageProps {
    categorySlug: string;
    title: { te: string; en: string };
    description: { te: string; en: string };
    lang: Language;
}

export async function generateCategoryMetadata({ categorySlug, title, description, lang }: CategoryListPageProps): Promise<Metadata> {
    return generateSEO({
        title: title[lang],
        description: description[lang],
        lang,
        path: `/${categorySlug}`,
    });
}

export default async function CategoryListPage({ categorySlug, title, description, lang }: CategoryListPageProps) {
    const { docs: articles, totalDocs } = await getArticlesByCategory(categorySlug, lang, 12);

    return (
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-12 page-enter">
            {/* Page Header */}
            <div className="mb-12 space-y-4">
                <SectionTitle title={title[lang]} />
                <p className="text-lg font-te text-gray-500 dark:text-zinc-400 max-w-2xl">
                    {description[lang]}
                </p>
                <p className="text-sm text-gray-400 dark:text-zinc-600">
                    {lang === 'te' ? `${totalDocs} వ్యాసాలు` : `${totalDocs} articles`}
                </p>
            </div>

            {/* Articles Grid */}
            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, idx) => (
                        <ArticleGridCard key={article.id} article={article} lang={lang} index={idx + 1} category={categorySlug} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
                        <span className="text-3xl">📰</span>
                    </div>
                    <h3 className="text-xl font-bold font-te text-gray-600 dark:text-zinc-400">
                        {lang === 'te' ? 'ఇంకా వ్యాసాలు రాలేదు' : 'No articles yet'}
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-zinc-600 font-te">
                        {lang === 'te' ? 'త్వరలో వ్యాసాలు ప్రచురించబడతాయి.' : 'Articles will be published soon.'}
                    </p>
                </div>
            )}
        </div>
    );
}

function ArticleGridCard({ article, lang, index = 1, category = 'today' }: { article: Article; lang: Language; index?: number; category?: string }) {
    const imageUrl = getImageUrl(article.heroImage, 'card');
    const href = buildArticleUrl(lang, article, index, category);
    const categorySlug = typeof article.category === 'object' ? (article.category.slug as any)?.[lang] || (article.category.slug as any)?.['te'] || '' : '';
    const publishDate = new Date(article.publishDate);

    return (
        <Link href={href} className="group block hover-lift">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-card">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {categorySlug && (
                        <div className="absolute top-3 left-3">
                            <CategoryBadge category={categorySlug} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    <time className="text-xs text-gray-400 dark:text-zinc-600 font-label uppercase tracking-wider">
                        {publishDate.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric',
                        })}
                    </time>
                    <h3 className="text-lg font-bold font-te text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-sm font-te text-gray-500 dark:text-zinc-400 line-clamp-2">
                        {article.excerpt}
                    </p>
                </div>
            </div>
        </Link>
    );
}
