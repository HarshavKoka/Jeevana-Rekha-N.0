import { Metadata } from 'next';
import { Language } from '@/types';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

const meta = {
    slug: 'trending',
    title: { te: 'ట్రెండింగ్', en: 'Trending' },
    description: { te: 'ప్రస్తుతం ట్రెండ్ అవుతున్న వార్తలు.', en: 'Currently trending news stories.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: lang as Language });
}

export default async function TrendingPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang={lang as Language} />;
}
