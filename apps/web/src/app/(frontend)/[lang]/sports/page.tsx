import { Metadata } from 'next';
import { Language } from '@/types';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

const meta = {
    slug: 'sports',
    title: { te: 'క్రీడలు', en: 'Sports' },
    description: { te: 'తాజా క్రీడా వార్తలు, స్కోర్లు మరియు విశ్లేషణలు.', en: 'Latest sports news, scores, and analysis.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: lang as Language });
}

export default async function SportsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang={lang as Language} />;
}
