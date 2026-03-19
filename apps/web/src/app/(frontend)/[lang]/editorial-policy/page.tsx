import { Metadata } from 'next';
import { Language } from '@/types';
import { generateSEO } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateSEO({ title: 'Editorial Policy', description: 'Our editorial standards and policy.', lang: lang as Language, path: '/editorial-policy' });
}

export default async function EditorialPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 page-enter prose dark:prose-invert prose-lg font-te">
            <h1>{lang === 'te' ? 'సంపాదకీయ విధానం' : 'Editorial Policy'}</h1>
            <p>{lang === 'te' ? 'JEEVANA REKHA నైతిక జర్నలిజం ప్రమాణాలకు కట్టుబడి ఉంటుంది. మా కంటెంట్ నిష్పక్షపాతంగా, ఖచ్చితంగా మరియు ప్రజా ప్రయోజనం కోసం ఉంటుంది.' : 'JEEVANA REKHA adheres to the highest standards of ethical journalism. Our content is unbiased, accurate, and serves the public interest.'}</p>
        </div>
    );
}
