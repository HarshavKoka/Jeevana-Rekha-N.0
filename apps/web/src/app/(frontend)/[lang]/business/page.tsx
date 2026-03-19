import { Metadata } from 'next';
import { Language } from '@/types';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

const meta = {
    slug: 'business',
    title: { te: 'బిజినెస్', en: 'Business' },
    description: { te: 'తాజా వ్యాపార వార్తలు, మార్కెట్ అప్‌డేట్లు మరియు ఆర్థిక విశ్లేషణలు.', en: 'Latest business news, market updates, and financial analysis.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: lang as Language });
}

export default async function BusinessPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang={lang as Language} />;
}
