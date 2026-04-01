import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'weekly-roundup',
    title: { te: 'వారాంతపు వార్తలు', en: 'Weekly Roundup' },
    description: { te: 'వారంలో ముఖ్య వార్తల సారాంశం.', en: "Summary of the week's top stories." },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function WeeklyRoundupPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
