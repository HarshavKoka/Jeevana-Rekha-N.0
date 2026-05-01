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
import RekhaFlash from '@/components/RekhaFlash';

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
        getArticles(locale, 12),
        getTrendingArticles(locale, 6),
        getFeaturedArticle(locale),
    ]);

    const hero = featuredArticle || (latestArticles && latestArticles[0]);
    const topArticles = latestArticles ? latestArticles.slice(0, 4) : [];
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="page-enter">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-10 md:py-16 space-y-20 md:space-y-32">

                {/* ─── REKHA FLASH ─── */}
                <div className="mb-2">
                    <RekhaFlash />
                </div>

                {/* ─── ROW 1: HERO (75%) & TRENDING (25%) ─── */}
                <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* HERO (75% / 3 cols) */}
                    <div className="lg:col-span-3">
                        {hero && (
                            <Link href={buildArticleUrl('te', hero, 1, 'hero')} className="group block relative aspect-[16/9] md:aspect-[21/9] w-full rounded-xl overflow-hidden shadow-sm hover-lift">
                                <Image src={getImageUrl(hero.heroImage, 'hero')} alt={hero.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-3 z-10">
                                    <span className="text-[#C8102E] text-sm font-bold uppercase tracking-wider block drop-shadow-md">రాజకీయాలు</span>
                                    <h1 className="text-white font-head text-2xl md:text-4xl lg:text-5xl leading-tight group-hover:text-white/90 transition-colors drop-shadow-md">{hero.title}</h1>
                                    <p className="text-white/90 font-body text-sm md:text-base line-clamp-2 drop-shadow-md max-w-3xl">{hero.excerpt}</p>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* TRENDING (25% / 1 col) */}
                    <div className="lg:col-span-1 flex flex-col">
                        <div className="mb-6 flex items-center gap-3 border-l-4 border-[#C8102E] pl-3">
                            <h2 className="text-xl font-head tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FFFFFF] leading-none">ట్రెండింగ్</h2>
                        </div>
                        <div className="space-y-6 flex-1">
                            {trendingArticles && trendingArticles.slice(0, 2).map((article, idx) => (
                                <Link key={article.id} href={buildArticleUrl('te', article, idx + 1, 'trending')} className="group block space-y-3 hover-lift">
                                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-[#D8DADC] dark:border-zinc-800">
                                        <Image src={getImageUrl(article.heroImage, 'card')} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <h3 className="card-title-reg text-[16px] leading-snug font-bold group-hover:text-[#A00D24] dark:group-hover:text-[#C8102E] transition-colors line-clamp-2 dark:text-[#FFFFFF]">{article.title}</h3>
                                    <span className="text-[#9A9A9A] dark:text-zinc-400 text-xs font-body block">{new Date(article.publishDate || Date.now()).toLocaleDateString('te-IN', { month: 'short', day: 'numeric' })}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── ROW 2: TODAY (75%) & PREVIOUS DAYS (25%) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
                    {/* TODAY (75%) */}
                    <section className="lg:col-span-3">
                        <div className="mb-6 flex items-center gap-3 border-l-4 border-[#1A1A1A] dark:border-white/80 pl-3">
                            <h2 className="text-2xl font-head tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FFFFFF] leading-none">నేడు</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {latestArticles && latestArticles.slice(1, 4).map((article, idx) => (
                                <Link key={article.id} href={buildArticleUrl('te', article, idx + 1, 'today')} className="group block space-y-3 hover-lift bg-white dark:bg-[#1A1A1A] border border-[#D8DADC]/50 dark:border-zinc-800 p-3 rounded-xl">
                                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-[#D8DADC]/50 dark:border-zinc-800 mb-4">
                                        <Image src={getImageUrl(article.heroImage, 'card')} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <span className="text-[#C8102E] text-sm font-bold uppercase tracking-wider block">
                                        {typeof article.category === 'object' ? article.category.title : 'వార్తలు'}
                                    </span>
                                    <h3 className="grid-card-title text-xl leading-snug group-hover:text-[#A00D24] dark:group-hover:text-[#C8102E] transition-colors line-clamp-2 dark:text-[#FFFFFF]">{article.title}</h3>
                                    <p className="card-excerpt line-clamp-3 text-[15px] text-[#1A1A1A]/80 dark:text-zinc-400">{article.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* PREVIOUS DAYS (25%) */}
                    <section className="lg:col-span-1">
                        <div className="mb-6 flex items-center gap-3 border-l-4 border-[#1A1A1A] dark:border-white/80 pl-3">
                            <h2 className="text-xl font-head tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FFFFFF] leading-none">ముందు రోజులు</h2>
                        </div>
                        <div className="flex flex-col gap-6">
                            {latestArticles && latestArticles.slice(2, 6).map((article, idx) => (
                                <Link key={article.id} href={buildArticleUrl('te', article, idx + 1, 'previous')} className="group block space-y-2 hover-lift border-b border-[#D8DADC] dark:border-zinc-800 pb-4 last:border-0">
                                    <h3 className="card-title-reg text-[15px] group-hover:text-[#A00D24] dark:group-hover:text-[#C8102E] transition-colors line-clamp-3 leading-snug dark:text-[#FFFFFF]">{article.title}</h3>
                                    <p className="text-xs text-[#9A9A9A] dark:text-zinc-500 font-body block pt-1">{new Date(article.publishDate || Date.now()).toLocaleDateString('te-IN', { month: 'short', day: 'numeric' })}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ─── ROW 3: WEEKLY (50%) & MONTHLY (50%) ─── */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {/* WEEKLY */}
                    <div>
                        <div className="mb-6 flex items-center gap-3 border-l-4 border-[#1A1A1A] dark:border-white/80 pl-3">
                            <h2 className="text-xl font-head tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FFFFFF] leading-none">వారపు సమీక్ష</h2>
                        </div>
                        {latestArticles && latestArticles[4] && (
                            <Link href={buildArticleUrl('te', latestArticles[4], 1, 'weekly')} className="group block space-y-4 hover-lift">
                                <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-[#D8DADC] dark:border-zinc-800">
                                    <div className="absolute top-0 left-0 bg-[#0D0D0D] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 z-10 tracking-widest uppercase">
                                        ముఖ్య అంశాలు
                                    </div>
                                    <Image src={getImageUrl(latestArticles[4].heroImage, 'card')} alt={latestArticles[4].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h3 className="lead-story-title group-hover:text-[#A00D24] dark:group-hover:text-[#C8102E] transition-colors dark:text-[#FFFFFF]">{latestArticles[4].title}</h3>
                            </Link>
                        )}
                    </div>
                    {/* MONTHLY */}
                    <div>
                        <div className="mb-6 flex items-center gap-3 border-l-4 border-[#1A1A1A] dark:border-white/80 pl-3">
                            <h2 className="text-xl font-head tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FFFFFF] leading-none">మాస సమీక్ష</h2>
                        </div>
                        {latestArticles && latestArticles[5] && (
                            <Link href={buildArticleUrl('te', latestArticles[5], 1, 'monthly')} className="group block space-y-4 hover-lift">
                                <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-[#D8DADC] dark:border-zinc-800">
                                    <div className="absolute top-0 left-0 bg-[#C8102E] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 z-10 tracking-widest uppercase">
                                        సారాంశం
                                    </div>
                                    <Image src={getImageUrl(latestArticles[5].heroImage, 'card')} alt={latestArticles[5].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <h3 className="lead-story-title group-hover:text-[#A00D24] dark:group-hover:text-[#C8102E] transition-colors dark:text-[#FFFFFF]">{latestArticles[5].title}</h3>
                            </Link>
                        )}
                    </div>
                </section>

                {/* ─── ROW 4: CATEGORIES ─── */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { title: 'సినిమా', article: latestArticles?.[6] },
                        { title: 'స్పోర్ట్స్', article: latestArticles?.[7] },
                        { title: 'బిజినెస్', article: latestArticles?.[8] },
                        { title: 'రాజకీయాలు', article: latestArticles?.[9] },
                    ].map((cat, i) => (
                        <div key={cat.title}>
                            <div className="mb-4 flex items-center gap-3 border-l-4 border-[#1A1A1A] dark:border-white/80 pl-3">
                                <h2 className="text-lg font-head tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FFFFFF] leading-none">{cat.title}</h2>
                            </div>
                            {cat.article && (
                                <Link href={buildArticleUrl('te', cat.article, 1, 'category')} className="group block space-y-2 hover-lift">
                                    <h3 className="card-title-reg group-hover:text-[#A00D24] dark:group-hover:text-[#C8102E] transition-colors line-clamp-3 leading-snug dark:text-[#FFFFFF]">{cat.article.title}</h3>
                                    <p className="card-excerpt text-sm line-clamp-3 text-[#1A1A1A]/80 dark:text-zinc-400">{cat.article.excerpt}</p>
                                </Link>
                            )}
                        </div>
                    ))}
                </section>

                {/* ─── ROW 5: REKHA WATCH ─── */}
                <section>
                    <div className="mb-6 flex items-center gap-3 border-l-4 border-[#C8102E] pl-3">
                        <h2 className="text-xl font-head tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FFFFFF] leading-none">రేఖ వాచ్</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* YouTube Channel CTA (25%) */}
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-[#D8DADC] dark:border-zinc-800 group cursor-pointer hover-lift">
                            <Image src={`https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800`} alt="YouTube" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
                            <div className="absolute top-0 left-0 bg-[#C8102E] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider z-10">
                                YouTube Channel
                            </div>
                            <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <h3 className="text-white font-head text-[15px] leading-tight">లైవ్: పబ్లిక్ టాక్ - నేటి ప్రధాన వార్తలు</h3>
                            </div>
                        </div>

                        {/* Video Thumbnails (75% / 3 items) */}
                        {[
                            { title: "ప్రకృతి ఒడిలో: అద్భుతమైన పర్యాటక ప్రాంతాలు", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800" },
                            { title: "ఆరోగ్య చిట్కాలు: నేటి ఆహారపు అలవాట్లు", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800" },
                            { title: "టెక్ గురు: సరికొత్త గ్యాడ్జెట్స్ రివ్యూ", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" }
                        ].map((video, i) => (
                            <div key={i} className="group block space-y-3 cursor-pointer hover-lift bg-white dark:bg-[#1A1A1A] border border-[#D8DADC] dark:border-zinc-800 p-2 rounded-xl">
                                <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#D8DADC]/50 dark:border-zinc-800">
                                    <Image src={video.img} alt="Video Thumbnail" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-0 left-0 bg-[#0D0D0D] text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider z-10">
                                        Video
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                        <svg className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                                <h3 className="text-[#1A1A1A] dark:text-[#FFFFFF] font-head text-[15px] line-clamp-2 px-1 leading-snug">{video.title}</h3>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
