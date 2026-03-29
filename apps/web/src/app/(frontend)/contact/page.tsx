import { Metadata } from 'next';
import { Language } from '@/types';
import { generateSEO } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateSEO({ title: lang === 'te' ? 'సంప్రదించండి' : 'Contact Us', description: lang === 'te' ? 'మమ్మల్ని సంప్రదించండి.' : 'Get in touch with us.', lang: lang as Language, path: '/contact' });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return (
        <div className="max-w-3xl mx-auto px-4 py-16 page-enter prose dark:prose-invert prose-lg font-te">
            <h1>{lang === 'te' ? 'సంప్రదించండి' : 'Contact Us'}</h1>
            <p>{lang === 'te' ? 'మీ సూచనలు, ఫిర్యాదులు లేదా వార్తా సమాచారం కోసం మమ్మల్ని సంప్రదించండి.' : 'Reach out to us for suggestions, complaints, or news tips.'}</p>
            <ul>
                <li><strong>Email:</strong> contact@jeevanarekha.com</li>
                <li><strong>Phone:</strong> +91 XXXXX XXXXX</li>
            </ul>
        </div>
    );
}
