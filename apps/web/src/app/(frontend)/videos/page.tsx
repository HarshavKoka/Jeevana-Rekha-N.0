import { Metadata } from 'next';
import { Language } from '@/types';
import { generateSEO } from '@/lib/seo';
import VideoCard from '@/components/VideoCard';
import SectionTitle from '@/components/SectionTitle';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateSEO({
        title: lang === 'te' ? 'వీడియోలు' : 'Videos',
        description: lang === 'te' ? 'తాజా వీడియో వార్తలు మరియు క్లిప్పింగ్స్.' : 'Latest video news and clippings.',
        lang: lang as Language,
        path: '/videos',
    });
}

export default async function VideosPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-12 page-enter">
            <SectionTitle title={lang === 'te' ? '📹 వీడియోలు' : '📹 Videos'} />
            <p className="text-lg font-te text-gray-500 dark:text-zinc-400 max-w-2xl mt-4 mb-12">
                {lang === 'te' ? 'తాజా వీడియో వార్తలు మరియు క్లిప్పింగ్స్.' : 'Latest video news and clippings.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <VideoCard title={lang === 'te' ? 'వీడియోలు త్వరలో వస్తాయి' : 'Videos coming soon'} />
            </div>
        </div>
    );
}
