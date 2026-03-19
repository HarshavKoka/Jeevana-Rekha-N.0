import { Metadata } from 'next';
import { Language } from '@/types';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateSEO({ title: 'Terms & Conditions', description: 'Terms and conditions of use.', lang: lang as Language, path: '/terms' });
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 page-enter prose dark:prose-invert prose-lg font-te">
            <h1>{lang === 'te' ? 'నిబంధనలు & షరతులు' : 'Terms & Conditions'}</h1>
            <p>{lang === 'te' ? 'ఈ వెబ్‌సైట్‌ను ఉపయోగించడం ద్వారా మీరు ఈ నిబంధనలను అంగీకరిస్తారు.' : 'By using this website, you agree to these terms.'}</p>
        </div>
    );
}
