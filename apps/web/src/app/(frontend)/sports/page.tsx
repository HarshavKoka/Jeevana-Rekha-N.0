import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'sports',
    title: { te: 'క్రీడలు', en: 'Sports' },
    description: { te: 'తాజా క్రీడా వార్తలు, స్కోర్లు మరియు విశ్లేషణలు.', en: 'Latest sports news, scores, and analysis.' },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function SportsPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
