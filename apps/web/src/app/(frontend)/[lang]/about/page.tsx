import { Metadata } from 'next';
import { Language } from '@/types';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateSEO({ title: lang === 'te' ? 'మా గురించి' : 'About Us', description: lang === 'te' ? 'JEEVANA REKHA గురించి తెలుసుకోండి.' : 'Learn about JEEVANA REKHA.', lang: lang as Language, path: '/about' });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 page-enter prose dark:prose-invert prose-lg font-te">
            <h1>{lang === 'te' ? 'మా గురించి' : 'About Us'}</h1>
            <p>{lang === 'te'
                ? 'JEEVANA REKHA అనేది నిజం, నిర్భయత్వం, బాధ్యత అనే సూత్రాల ఆధారంగా పనిచేసే డిజిటల్ వార్తా వేదిక. మేము నైతిక జర్నలిజం మరియు ప్రజా ప్రయోజనానికి అంకితమై ఉన్నాము.'
                : 'JEEVANA REKHA is a digital news platform operating on the principles of Truth, Resilience, and Responsibility. We are dedicated to ethical journalism and public interest.'}</p>
            <p>{lang === 'te'
                ? 'మా లక్ష్యం తెలుగు ప్రజలకు నిష్పక్షపాతమైన, విశ్వసనీయమైన వార్తలను అందించడం. మేము రాజకీయాలు, వ్యాపారం, క్రీడలు, సినిమా మరియు మరిన్ని అంశాలను కవర్ చేస్తాము.'
                : 'Our mission is to provide unbiased, trustworthy news to the Telugu community. We cover politics, business, sports, cinema, and more.'}</p>
        </div>
    );
}
