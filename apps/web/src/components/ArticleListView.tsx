import Link from 'next/link';
import Image from 'next/image';
import { Article, Language } from '@/types';
import { getImageUrl, buildArticleUrl } from '@/lib/url';
import SectionTitle from './SectionTitle';

interface ArticleListViewProps {
    articles: Article[];
    title: string;
    lang: Language;
    date: string;
    category: 'today' | 'previous-days';
}

export default function ArticleListView({ articles, title, lang, date, category }: ArticleListViewProps) {
    return (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-12 space-y-12 page-enter">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-primary/10 pb-6 gap-4">
                <SectionTitle title={title} />
                <div className="flex items-center gap-3 text-zinc-400 font-te bg-zinc-50 dark:bg-zinc-900/50 px-5 py-2 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <time className="font-bold text-sm">
                        {new Date(date).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>
            </div>

            {articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {articles.map((article, idx) => {
                        const imageUrl = getImageUrl(article.heroImage, 'card');
                        const href = buildArticleUrl(lang, article, idx + 1, category);
                        const categorySlug = typeof article.category === 'object' ? (article.category.slug as any)?.[lang] || (article.category.slug as any)?.['te'] || '' : '';
                        const publishDate = new Date(article.publishDate);

                        return (
                            <Link key={article.id} href={href} className="group block hover-lift">
                                <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-card">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={imageUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        {categorySlug && (
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary text-white px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                                                    {categorySlug}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <time className="text-[10px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-[0.2em]">
                                            {publishDate.toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </time>
                                        <h3 className="text-xl font-bold font-te text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm font-te text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-32 space-y-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
                    <span className="text-6xl block">🗞️</span>
                    <p className="text-xl font-te text-zinc-400">
                        {lang === 'te' ? 'ఈ తేదీన వార్తలు ఏమీ లేవు.' : 'No articles found for this date.'}
                    </p>
                    <Link href="/" className="inline-block bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-transform">
                        {lang === 'te' ? 'హోమ్ పేజీకి వెళ్లండి' : 'Back to Home'}
                    </Link>
                </div>
            )}
        </div>
    );
}
