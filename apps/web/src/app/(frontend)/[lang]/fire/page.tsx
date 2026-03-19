import { Metadata } from 'next';
import { Language } from '@/types';
import { generateSEO } from '@/lib/seo';
import FireReportForm from '@/components/FireReportForm';
import SectionTitle from '@/components/SectionTitle';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateSEO({
        title: lang === 'te' ? 'ఫైర్ రిపోర్ట్' : 'Fire Report',
        description: lang === 'te' ? 'సిటిజన్ రిపోర్టర్ — మీ సమస్యలను నేరుగా మాకు చేరవేయండి.' : 'Submit civic issues and breaking news to our desk.',
        lang: lang as Language,
        path: '/fire',
    });
}

export default async function FirePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-12 page-enter">
            <SectionTitle title={lang === 'te' ? '🔥 ఫైర్ రిపోర్ట్' : '🔥 Fire Report'} />
            <p className="text-lg font-te text-gray-500 dark:text-zinc-400 max-w-2xl mt-4 mb-8">
                {lang === 'te' ? 'సిటిజన్ రిపోర్టర్ — మీ చుట్టుపక్కల సమస్యలను మాకు చేరవేయండి.' : 'Citizen Reporter — Submit civic issues directly to our editorial desk.'}
            </p>
            <FireReportForm />
        </div>
    );
}
