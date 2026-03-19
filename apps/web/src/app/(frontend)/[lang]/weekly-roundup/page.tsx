import { Metadata } from 'next';
import { Language } from '@/types';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

const meta = {
    slug: 'weekly-roundup',
    title: { te: 'వారాంతపు వార్తలు', en: 'Weekly Roundup' },
    description: { te: 'వారంలో ముఖ్య వార్తల సారాంశం.', en: 'Summary of the week\'s top stories.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: lang as Language });
}

export default async function WeeklyRoundupPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang={lang as Language} />;
}
