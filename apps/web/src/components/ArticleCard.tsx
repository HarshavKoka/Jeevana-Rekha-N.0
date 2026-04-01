import Link from 'next/link';
import Image from 'next/image';
import CategoryBadge from './CategoryBadge';

interface ArticleCardProps {
    lang: string;
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    image?: string;
    isSidebar?: boolean;
}

export default function ArticleCard({ lang, slug, category, title, excerpt, date, image, isSidebar = false, publishDate }: ArticleCardProps & { publishDate?: string }) {
    const isoDate = publishDate
        ? new Date(publishDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
    const href = `/te/${isoDate}/1/${category || 'today'}/${slug}`;
    return (
        <Link
            href={href}
            className="group block bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 border border-gray-100 dark:border-zinc-800"
        >
            {/* Top: Image */}
            <div className={`relative ${isSidebar ? 'aspect-[3/4]' : 'aspect-square md:aspect-[4/3]'} w-full overflow-hidden`}>
                <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] bg-gray-50 dark:bg-zinc-900/50 italic">
                            Jeevana Rekha News
                        </div>
                    )}
                </div>
                <div className="absolute top-4 left-4 z-10">
                    <CategoryBadge label={category} />
                </div>
                {isSidebar && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                )}
            </div>

            {/* Middle/Bottom: Content */}
            <div className={`p-6 ${isSidebar ? 'absolute bottom-0 left-0 right-0 p-8' : ''}`}>
                <h3 className={`font-bold font-te leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-primary ${isSidebar ? 'text-white text-xl md:text-2xl' : 'text-gray-900 dark:text-gray-100 text-lg md:text-xl'
                    }`}>
                    {title}
                </h3>

                {!isSidebar && (
                    <>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-te line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity">
                            {excerpt}
                        </p>
                        <div className="mt-6 pt-5 flex items-center justify-between border-t border-gray-50 dark:border-zinc-800/50">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{date}</span>
                            <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Read More <span className="text-lg">→</span>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
}
