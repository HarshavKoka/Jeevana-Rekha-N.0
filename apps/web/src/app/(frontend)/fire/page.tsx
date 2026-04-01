import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import FireReportForm from '@/components/FireReportForm';
import SectionTitle from '@/components/SectionTitle';

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
    return generateSEO({
        title: 'ఫైర్ రిపోర్ట్',
        description: 'సిటిజన్ రిపోర్టర్ — మీ సమస్యలను నేరుగా మాకు చేరవేయండి.',
        lang: 'te',
        path: '/fire',
    });
}

export default async function FirePage() {
    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 page-enter">
            <SectionTitle title="🔥 ఫైర్ రిపోర్ట్" />
            <p className="text-lg font-te text-gray-500 dark:text-zinc-400 max-w-2xl mt-4 mb-8">
                సిటిజన్ రిపోర్టర్ — మీ చుట్టుపక్కల సమస్యలను మాకు చేరవేయండి.
            </p>
            <FireReportForm />
        </div>
    );
}
