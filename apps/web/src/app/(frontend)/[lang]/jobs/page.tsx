import { Metadata } from 'next';
import { Language } from '@/types';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

const meta = {
    slug: 'jobs',
    title: { te: 'ఉద్యోగాలు', en: 'Jobs' },
    description: { te: 'తాజా ఉద్యోగ అవకాశాలు మరియు కెరీర్ న్యూస్.', en: 'Latest job opportunities and career news.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: lang as Language });
}

export default async function JobsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang={lang as Language} />;
}
