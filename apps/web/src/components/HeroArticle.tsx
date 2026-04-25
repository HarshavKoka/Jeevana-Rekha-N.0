import Link from 'next/link';
import Image from 'next/image';
import CategoryBadge from './CategoryBadge';

interface HeroArticleProps {
    lang: string;
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    image?: string;
}

export default function HeroArticle({ lang, slug, category, title, excerpt, date, image, publishDate }: HeroArticleProps & { publishDate?: string }) {
    const isoDate = publishDate
        ? new Date(publishDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
    const href = `/te/${isoDate}/1/${category || 'today'}/${slug}`;
    return (
        <Link href={href} className="group block relative overflow-hidden rounded-[2.5rem] shadow-xl transition-all duration-500 hover:shadow-2xl">
            <div className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-[2.5rem]">
                {/* Image */}
                <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-900">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                            sizes="100vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-800 font-black uppercase tracking-[1em] bg-gray-50 dark:bg-zinc-950 italic text-2xl">
                            Featured News
                        </div>
                    )}
                </div>

                {/* Category Badge overlay */}
                <div className="absolute top-8 left-8 z-10">
                    <CategoryBadge label={category} />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 space-y-6">
                    <h1 className="hero-headline text-white line-clamp-3 max-w-5xl">
                        {title}
                    </h1>
                    <p className="hero-summary text-gray-200 line-clamp-2 max-w-4xl opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                        {excerpt}
                    </p>

                    <div className="pt-8 flex items-center justify-between border-t border-white/10">
                        <span className="metadata-text text-gray-300 uppercase tracking-[0.2em]">{date}</span>
                        <div className="flex items-center gap-3 text-white font-black text-sm md:text-lg uppercase tracking-widest group-hover:gap-5 transition-all font-body">
                            Read Full Story <span className="text-primary text-2xl md:text-3xl">→</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
