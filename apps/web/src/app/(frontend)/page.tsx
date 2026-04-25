import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Language } from '@/types';
import { getArticles, getTrendingArticles, getFeaturedArticle, getCategories } from '@/lib/payload-client';
import { generateSEO } from '@/lib/seo';
import { buildArticleUrl, getImageUrl } from '@/lib/url';
import { SOCIAL_LINKS } from '@/lib/constants';
import CategoryBadge from '@/components/CategoryBadge';
import VideoCard from '@/components/VideoCard';

// Rebuild the homepage at most every 60 seconds (ISR)
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const seo = generateSEO({
        title: 'Jeevana Rekha',
        description: 'తెలుగు వార్తా వేదిక - తాజా వార్తలు, విశ్లేషణలు',
        lang: 'te',
    });
    return { ...seo, title: 'Jeevana Rekha' };
}

export default async function HomePage() {
    const locale: Language = 'te';

    const [
        { docs: latestArticles },
        { docs: trendingArticles },
        featuredArticle,
    ] = await Promise.all([
        getArticles(locale, 9),
        getTrendingArticles(locale, 6),
        getFeaturedArticle(locale),
    ]);

    const hero = featuredArticle || (latestArticles && latestArticles[0]);
    const topArticles = latestArticles ? latestArticles.slice(0, 4) : [];
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="page-enter bg-white dark:bg-zinc-950">
            {/* ─── TOP SECTION: TODAY (70%) & TRENDING (30%) ─── */}
            <section className="max-w-[1700px] mx-auto px-4 lg:px-10 xl:px-20 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[7.5fr_2.5fr] 2xl:grid-cols-[7.8fr_2.2fr] gap-12 xl:gap-20">
                    {/* TODAY SECTION (70%) */}
                    <div className="space-y-8">
                        <Link href={`/${todayStr}/today`} className="group flex items-center gap-4 border-b-4 border-primary pb-2 w-fit">
                            <span className="text-4xl md:text-5xl font-head tracking-tighter text-zinc-900 dark:text-white group-hover:text-primary transition-all duration-300 uppercase">
                                నేడు
                            </span>
                            <span className="text-primary text-4xl group-hover:translate-x-2 transition-transform">→</span>
                        </Link>

                        {hero && (
                            <Link
                                href={buildArticleUrl('te', hero, 1, 'today')}
                                className="article-card group block relative overflow-hidden rounded-[2.5rem] shadow-2xl hover:shadow-primary/20 transition-all duration-500 border border-zinc-100 dark:border-zinc-800"
                            >
                                <div className="relative aspect-[16/9] w-full">
                                    <Image
                                        src={getImageUrl(hero.heroImage, 'hero')}
                                        alt={hero.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 70vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 space-y-4">
                                        {typeof hero.category === 'object' && (
                                            <CategoryBadge category={hero.category.slug} />
                                        )}
                                        <h1 className="hero-headline text-white max-w-5xl">
                                            {hero.title}
                                        </h1>
                                        <p className="hero-summary text-zinc-200 line-clamp-2 max-w-4xl opacity-90">
                                            {hero.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {topArticles && topArticles.slice(1, 3).map((article, idx) => (
                                <Link
                                    key={article.id}
                                    href={buildArticleUrl('te', article, idx + 2, 'today')}
                                    className="article-card group space-y-3"
                                >
                                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-lg">
                                        <Image
                                            src={getImageUrl(article.heroImage, 'card')}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <h3 className="top-story-title group-hover:text-primary transition-colors text-zinc-900 dark:text-white">
                                        {article.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* TRENDING SECTION (30%) */}
                    <div className="space-y-8 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-inner">
                        <div className="border-l-4 border-primary pl-4">
                            <h2 className="text-3xl font-black font-te tracking-tighter text-zinc-900 dark:text-white uppercase">
                                ట్రెండింగ్
                            </h2>
                        </div>
                        <div className="flex flex-col gap-8">
                            {trendingArticles && trendingArticles.slice(0, 5).map((article, idx) => (
                                <Link
                                    key={article.id}
                                    href={buildArticleUrl('te', article, idx + 1, 'trending')}
                                    className="article-card group flex gap-5 items-start"
                                >
                                    <span className="text-5xl font-head text-primary/10 group-hover:text-primary transition-colors leading-none italic">
                                        {idx + 1}
                                    </span>
                                    <div className="space-y-1">
                                        <h3 className="card-title-reg text-zinc-800 dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <span className="metadata-text">
                                            {new Date(article.publishDate).toLocaleDateString('te-IN', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── MIDDLE SECTION: PREVIOUS DAY (60%) & WEEKLY ROUNDUP (40%) ─── */}
            <section className="bg-zinc-100 dark:bg-zinc-900/40 py-20 md:py-32 border-y border-zinc-200 dark:border-zinc-800">
                <div className="max-w-[1700px] mx-auto px-4 lg:px-10 xl:px-20">
                    <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] 2xl:grid-cols-[6.5fr_3.5fr] gap-16 xl:gap-24">
                        {/* PREVIOUS DAY (60%) */}
                        <div className="space-y-10">
                            <Link href={`/${todayStr}/previous-days`} className="group flex items-center gap-4">
                                <h2 className="text-3xl md:text-4xl font-head tracking-tighter text-zinc-900 dark:text-white group-hover:text-primary transition-all duration-300 uppercase">
                                    గత <span className="text-primary">రోజులు</span>
                                </h2>
                                <span className="text-primary text-3xl group-hover:translate-x-2 transition-transform">→</span>
                            </Link>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {latestArticles && latestArticles.slice(4, 8).map((article, idx) => (
                                    <Link key={article.id} href={buildArticleUrl('te', article, idx + 1, 'previous-days')} className="article-card group block bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all">
                                        <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                                            <Image src={getImageUrl(article.heroImage, 'card')} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <h3 className="grid-card-title text-zinc-900 dark:text-white group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* WEEKLY ROUNDUP (40%) */}
                        <div className="space-y-10">
                            <Link href="/weekly-roundup" className="group flex items-center justify-between bg-zinc-900 dark:bg-zinc-800 text-white p-8 rounded-[3rem] shadow-2xl hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all border-b-8 border-primary">
                                <div>
                                    <h2 className="text-3xl font-head tracking-tighter uppercase leading-none">
                                        వారపు<br /><span className="text-primary italic">సమీక్ష</span>
                                    </h2>
                                    <p className="text-zinc-400 text-xs mt-3 uppercase tracking-widest font-bold">
                                        వారపు వార్తల సంక్షిప్తం
                                    </p>
                                </div>
                                <span className="text-5xl font-black">🗞️</span>
                            </Link>

                            <div className="space-y-6">
                                {latestArticles && latestArticles.slice(0, 3).map((article, idx) => (
                                    <Link key={article.id} href={buildArticleUrl('te', article, idx + 1, 'weekly-roundup')} className="article-card flex gap-4 items-center group">
                                        <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl shrink-0 overflow-hidden relative">
                                            <Image src={getImageUrl(article.heroImage, 'thumbnail')} alt={article.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold font-te text-zinc-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                                {article.title}
                                            </h4>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Feature Story</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── VIDEO SECTION ─── */}
            <section className="max-w-[1700px] mx-auto px-4 lg:px-10 xl:px-20 py-24 md:py-32 space-y-12">
                <div className="flex items-center justify-between border-b-2 border-zinc-100 dark:border-zinc-800 pb-8">
                    <h2 className="section-banner-head text-zinc-900 dark:text-white uppercase transition-all duration-500">
                        రేఖా <span className="text-red-600">వాచ్</span>
                    </h2>
                    <a 
                        href={SOCIAL_LINKS.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-primary transition-colors font-body"
                    >
                        YouTube ఛానల్ చూడండి
                    </a>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8 relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-2xl">
                        <div className="aspect-video relative">
                            <Image 
                                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=2000" 
                                alt="Jeevana Rekha YouTube" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <a 
                                    href={SOCIAL_LINKS.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 group-hover:bg-red-700"
                                >
                                    <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-head leading-tight text-zinc-900 dark:text-white">
                                నిజాన్ని నిర్భయంగా చూపిస్తూ.. మీ జీవన రేఖ!
                            </h3>
                            <p className="hero-summary text-zinc-500 dark:text-zinc-400">
                                తాజా వార్తలు, లోతైన విశ్లేషణలు మరియు ప్రత్యేక ఇంటర్వ్యూల కోసం మా YouTube ఛానల్‌ని సబ్‌స్క్రైబ్ చేయండి.
                            </p>
                        </div>
                        <a 
                            href={SOCIAL_LINKS.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-all shadow-xl hover:shadow-red-600/20"
                        >
                            SUBSCRIBE NOW <span className="text-xl">🔔</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
