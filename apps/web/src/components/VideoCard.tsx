import Image from 'next/image';
import { Play, Youtube } from 'lucide-react';

interface VideoCardProps {
    title: string;
    image?: string;
    date?: string;
}

export default function VideoCard({ title, image, date = "Today" }: VideoCardProps) {
    return (
        <div className="flex-shrink-0 w-[320px] md:w-[450px] snap-start group relative aspect-[16/9] overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer">
            {/* Background Image/Placeholder */}
            <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-900">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 320px, 450px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-800 font-black text-xs uppercase tracking-[0.5em] bg-gray-50 dark:bg-zinc-950 italic">
                        News Clip
                    </div>
                )}
            </div>

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

            {/* Center Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-125 group-hover:bg-red-700">
                    <Youtube fill="currentColor" size={32} />
                </div>
            </div>

            {/* Category Tag */}
            <div className="absolute top-4 left-4">
                <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                    Video
                </span>
            </div>

            {/* Title Bottom-Left */}
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{date}</span>
                <h4 className="text-white text-lg md:text-2xl font-black font-te line-clamp-2 leading-tight drop-shadow-lg">
                    {title}
                </h4>
            </div>
        </div>
    );
}
