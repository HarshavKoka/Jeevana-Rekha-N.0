import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import VideoCard from '@/components/VideoCard';
import SectionTitle from '@/components/SectionTitle';

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
    return generateSEO({
        title: 'వీడియోలు',
        description: 'తాజా వీడియో వార్తలు మరియు క్లిప్పింగ్స్.',
        lang: 'te',
        path: '/videos',
    });
}

export default async function VideosPage() {
    return (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-12 page-enter">
            <SectionTitle title="📹 వీడియోలు" />
            <p className="text-lg font-te text-gray-500 dark:text-zinc-400 max-w-2xl mt-4 mb-12">
                తాజా వీడియో వార్తలు మరియు క్లిప్పింగ్స్.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <VideoCard title="వీడియోలు త్వరలో వస్తాయి" />
            </div>
        </div>
    );
}
