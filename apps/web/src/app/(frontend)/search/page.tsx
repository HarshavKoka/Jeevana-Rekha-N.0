import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { searchArticles } from '@/lib/payload-client';
import { buildArticleUrl, getImageUrl } from '@/lib/url';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `"${q}" కోసం వెతకడం — Jeevana Rekha` : 'వెతకండి — Jeevana Rekha',
        robots: { index: false },
    };
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const query = q?.trim() ?? '';

    const { docs: results, totalDocs } = query
        ? await searchArticles(query, 'te', 20)
        : { docs: [], totalDocs: 0 };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">

                {/* Header */}
                <div className="mb-12 space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
                        వెతుకు ఫలితాలు
                    </p>
                    {query ? (
                        <h1 className="text-3xl md:text-4xl font-black font-te text-zinc-900 dark:text-white">
                            &ldquo;{query}&rdquo;
                        </h1>
                    ) : (
                        <h1 className="text-3xl font-black font-te text-zinc-900 dark:text-white">
                            వెతకండి
                        </h1>
                    )}
                    {query && (
                        <p className="text-sm text-zinc-400 dark:text-zinc-600">
                            {totalDocs} ఫలితాలు కనుగొనబడ్డాయి
                        </p>
                    )}
                </div>

                {/* Results */}
                {results.length > 0 ? (
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {results.map((article, idx) => {
                            const href = buildArticleUrl('te', article, idx + 1, 'search');
                            const categorySlug =
                                typeof article.category === 'object'
                                    ? article.category.slug
                                    : 'general';
                            return (
                                <Link
                                    key={article.id}
                                    href={href}
                                    className="flex gap-5 items-start py-6 group hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-4 px-4 rounded-2xl transition-colors duration-200"
                                >
                                    <div className="relative w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                        <Image
                                            src={getImageUrl(article.heroImage, 'thumbnail')}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5 min-w-0">
                                        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary">
                                            {categorySlug}
                                        </span>
                                        <h2 className="text-base md:text-lg font-bold font-te text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                            {article.title}
                                        </h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-te line-clamp-2 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                        <span className="text-[11px] text-zinc-400 dark:text-zinc-600">
                                            {new Date(article.publishDate).toLocaleDateString('te-IN', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : query ? (
                    <div className="text-center py-24 space-y-4">
                        <p className="text-5xl">🔍</p>
                        <p className="text-xl font-bold font-te text-zinc-900 dark:text-white">
                            ఫలితాలు కనుగొనబడలేదు
                        </p>
                        <p className="text-zinc-400 font-te">
                            &ldquo;{query}&rdquo; కోసం ఏ వార్తలూ కనుగొనబడలేదు. వేరే పదాలతో ప్రయత్నించండి.
                        </p>
                        <Link
                            href="/"
                            className="inline-block mt-4 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
                        >
                            హోమ్‌కు వెళ్ళండి
                        </Link>
                    </div>
                ) : (
                    <div className="text-center py-24 space-y-4">
                        <p className="text-5xl">📰</p>
                        <p className="text-xl font-bold font-te text-zinc-900 dark:text-white">
                            వార్తలు వెతకండి
                        </p>
                        <p className="text-zinc-400 font-te">
                            పైన ఉన్న సెర్చ్ బాక్స్‌లో వెతకాల్సిన పదాలు టైప్ చేయండి
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
