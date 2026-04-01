import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'jobs',
    title: { te: 'ఉద్యోగాలు', en: 'Jobs' },
    description: { te: 'తాజా ఉద్యోగ అవకాశాలు మరియు కెరీర్ న్యూస్.', en: 'Latest job opportunities and career news.' },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function JobsPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
