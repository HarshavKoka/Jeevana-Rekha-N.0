import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { getArticleBySlug, getArticles } from '@/lib/payload-client';
import { generateSEO, generateNewsSchema } from '@/lib/seo';
import { buildArticleUrl, getImageUrl } from '@/lib/url';
import { Language, ContentBlock } from '@/types';
import ShareButtons from '@/components/ShareButtons';
import CategoryBadge from '@/components/CategoryBadge';

export const revalidate = 300;

interface PageParams {
    date: string;
    articleno: string;
    category: string;
    slug: string;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>;
}): Promise<Metadata> {
    const { slug, date, category } = await params;
    const article = await getArticleBySlug(slug, 'te');
    if (!article) return {};

    const imageUrl = getImageUrl(article.heroImage, 'hero');

    return generateSEO({
        title: article.seo?.title || article.title,
        description: article.seo?.description || article.excerpt,
        lang: 'te',
        path: `/${date}/1/${category}/${slug}`,
        image: imageUrl,
        type: 'article',
    });
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<PageParams>;
}) {
    const { slug, date, articleno, category } = await params;
    const [article, { docs: relatedArticles }] = await Promise.all([
        getArticleBySlug(slug, 'te'),
        getArticles('te', 4),
    ]);

    if (!article) notFound();

    const heroImageUrl = getImageUrl(article.heroImage, 'hero');
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://jeevanarekha.com';
    const canonicalUrl = `${baseUrl}/${date}/${articleno}/${category}/${slug}`;
    const publishDate = new Date(article.publishDate);
    const categorySlug = typeof article.category === 'object' ? article.category.slug : category;
    const authorName =
        typeof article.author === 'object'
            ? article.author.name || 'Jeevana Rekha Team'
            : 'Jeevana Rekha Team';

    const jsonLd = generateNewsSchema(article, 'te');

    const filtered = relatedArticles.filter((a) => a.id !== article.id).slice(0, 3);

    return (
        <>
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="min-h-screen bg-white dark:bg-zinc-950">
                {/* ── HERO IMAGE ── */}
                <div className="relative w-full aspect-[16/7] max-h-[640px] overflow-hidden">
                    <Image
                        src={heroImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 lg:px-8 pb-10 space-y-4">
                        <CategoryBadge category={categorySlug} />
                        <h1 className="text-white text-3xl md:text-5xl font-black font-te leading-[1.1] tracking-tight">
                            {article.title}
                        </h1>
                    </div>
                </div>

                {/* ── ARTICLE BODY ── */}
                <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12 space-y-10">

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-zinc-800">
                        <div className="space-y-1">
                            <time
                                dateTime={publishDate.toISOString()}
                                className="text-sm font-bold uppercase tracking-widest text-gray-400"
                            >
                                {publishDate.toLocaleDateString('te-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            <p className="text-xs text-gray-400 dark:text-zinc-600 uppercase tracking-wider">
                                {authorName}
                            </p>
                        </div>
                        <ShareButtons title={article.title} url={canonicalUrl} />
                    </div>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className="text-xl md:text-2xl font-te text-gray-600 dark:text-zinc-300 leading-relaxed border-l-4 border-primary pl-6">
                            {article.excerpt}
                        </p>
                    )}

                    {/* Content blocks */}
                    <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none font-te">
                        {article.content?.map((block, i) => (
                            <ContentBlockRenderer key={i} block={block} />
                        ))}
                    </div>

                    {/* Keywords */}
                    {article.keywords?.length > 0 && (
                        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                Keywords
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {article.keywords.map(({ keyword }) => (
                                    <span
                                        key={keyword}
                                        className="px-3 py-1 text-xs font-te bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 rounded-full border border-gray-200 dark:border-zinc-800"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Share row bottom */}
                    <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                        <Link
                            href="/"
                            className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                        >
                            ← హోమ్‌కు తిరిగి వెళ్ళు
                        </Link>
                        <ShareButtons title={article.title} url={canonicalUrl} />
                    </div>
                </div>

                {/* ── RELATED ARTICLES ── */}
                {filtered.length > 0 && (
                    <section className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 py-16">
                        <div className="max-w-4xl mx-auto px-4 lg:px-8 space-y-8">
                            <h2 className="text-2xl font-black font-te tracking-tighter text-zinc-900 dark:text-white uppercase">
                                మరిన్ని వార్తలు
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {filtered.map((related, idx) => (
                                    <Link
                                        key={related.id}
                                        href={buildArticleUrl('te', related, idx + 1)}
                                        className="group block bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all"
                                    >
                                        <div className="relative aspect-video overflow-hidden">
                                            <Image
                                                src={getImageUrl(related.heroImage, 'card')}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-4 space-y-2">
                                            <h3 className="text-sm font-bold font-te line-clamp-2 text-zinc-900 dark:text-white group-hover:text-primary transition-colors leading-snug">
                                                {related.title}
                                            </h3>
                                            <time className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                {new Date(related.publishDate).toLocaleDateString('te-IN', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </article>
        </>
    );
}

// ── Content block renderer ──────────────────────────────────────────────────

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
    switch (block.blockType) {
        case 'hero':
            return (
                <h2 className="text-2xl md:text-3xl font-black font-te text-zinc-900 dark:text-white leading-snug mt-10 mb-4">
                    {block.text}
                </h2>
            );

        case 'paragraph':
            return <LexicalRenderer content={block.text} />;

        case 'image': {
            const src =
                typeof block.image === 'object' ? block.image.url : block.image;
            return (
                <figure className="my-8 space-y-3">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                        <Image
                            src={src}
                            alt={block.caption || ''}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 896px"
                        />
                    </div>
                    {block.caption && (
                        <figcaption className="text-center text-sm text-gray-500 dark:text-zinc-500 font-te italic">
                            {block.caption}
                        </figcaption>
                    )}
                </figure>
            );
        }

        case 'quote':
            return (
                <blockquote className="my-8 pl-6 border-l-4 border-primary space-y-2">
                    <p className="text-xl font-te text-zinc-700 dark:text-zinc-200 italic leading-relaxed">
                        &ldquo;{block.text}&rdquo;
                    </p>
                    {block.attribution && (
                        <cite className="text-sm font-bold text-zinc-400 not-italic">
                            — {block.attribution}
                        </cite>
                    )}
                </blockquote>
            );

        default:
            return null;
    }
}

// ── Lexical rich-text renderer ──────────────────────────────────────────────

type LexicalNode = {
    type: string;
    text?: string;
    format?: number;
    children?: LexicalNode[];
    tag?: string;
    listType?: string;
    url?: string;
};

type LexicalRoot = {
    root?: { children?: LexicalNode[] };
    children?: LexicalNode[];
};

function LexicalRenderer({ content }: { content: Record<string, unknown> }) {
    const root = content as LexicalRoot;
    const children = root?.root?.children ?? root?.children ?? [];
    return <>{children.map((node, i) => <LexicalNode key={i} node={node} />)}</>;
}

function LexicalNode({ node }: { node: LexicalNode }) {
    switch (node.type) {
        case 'paragraph':
            return (
                <p className="my-4 text-lg font-te text-zinc-800 dark:text-zinc-200 leading-[1.9]">
                    {node.children?.map((child, i) => <LexicalLeaf key={i} node={child} />)}
                </p>
            );
        case 'heading': {
            const Tag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4';
            return (
                <Tag className="font-black font-te text-zinc-900 dark:text-white mt-10 mb-4 leading-snug">
                    {node.children?.map((child, i) => <LexicalLeaf key={i} node={child} />)}
                </Tag>
            );
        }
        case 'list':
            return node.listType === 'number' ? (
                <ol className="list-decimal list-inside space-y-2 my-4 font-te text-zinc-800 dark:text-zinc-200">
                    {node.children?.map((child, i) => <LexicalNode key={i} node={child} />)}
                </ol>
            ) : (
                <ul className="list-disc list-inside space-y-2 my-4 font-te text-zinc-800 dark:text-zinc-200">
                    {node.children?.map((child, i) => <LexicalNode key={i} node={child} />)}
                </ul>
            );
        case 'listitem':
            return (
                <li>
                    {node.children?.map((child, i) => <LexicalLeaf key={i} node={child} />)}
                </li>
            );
        case 'quote':
            return (
                <blockquote className="pl-5 border-l-4 border-primary my-6 text-zinc-600 dark:text-zinc-300 italic font-te">
                    {node.children?.map((child, i) => <LexicalLeaf key={i} node={child} />)}
                </blockquote>
            );
        default:
            return null;
    }
}

// format bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code
function LexicalLeaf({ node }: { node: LexicalNode }) {
    if (node.type === 'link') {
        return (
            <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
            >
                {node.children?.map((child, i) => <LexicalLeaf key={i} node={child} />)}
            </a>
        );
    }

    let text: React.ReactNode = node.text ?? '';
    const fmt = node.format ?? 0;
    if (fmt & 1) text = <strong>{text}</strong>;
    if (fmt & 2) text = <em>{text}</em>;
    if (fmt & 4) text = <s>{text}</s>;
    if (fmt & 8) text = <u>{text}</u>;
    if (fmt & 16) text = <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-sm font-mono">{text}</code>;
    return <>{text}</>;
}
