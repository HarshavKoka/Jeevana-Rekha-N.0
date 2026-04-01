import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'trending',
    title: { te: 'ట్రెండింగ్', en: 'Trending' },
    description: { te: 'ప్రస్తుతం ట్రెండ్ అవుతున్న వార్తలు.', en: 'Currently trending news stories.' },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function TrendingPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
