import { Metadata } from 'next';
import { Language } from '@/types';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateSEO({ title: 'Privacy Policy', description: 'Our privacy policy.', lang: lang as Language, path: '/privacy' });
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 page-enter prose dark:prose-invert prose-lg font-te">
            <h1>{lang === 'te' ? 'గోప్యతా విధానం' : 'Privacy Policy'}</h1>
            <p>{lang === 'te' ? 'మీ వ్యక్తిగత సమాచారాన్ని మేము ఎలా సేకరిస్తాము, ఉపయోగిస్తాము మరియు రక్షిస్తాము అనే విషయాలను ఈ విధానం వివరిస్తుంది.' : 'This policy explains how we collect, use, and protect your personal information.'}</p>
        </div>
    );
}
