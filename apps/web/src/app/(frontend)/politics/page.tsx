import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'politics',
    title: { te: 'రాజకీయాలు', en: 'Politics' },
    description: { te: 'తాజా రాజకీయ వార్తలు, విశ్లేషణలు మరియు అభిప్రాయాలు.', en: 'Latest political news, analysis, and opinion.' },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function PoliticsPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
