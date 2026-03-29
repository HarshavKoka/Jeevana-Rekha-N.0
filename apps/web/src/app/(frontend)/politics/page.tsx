import { Metadata } from 'next';
import { Language } from '@/types';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 60;

const meta = {
    slug: 'politics',
    title: { te: 'రాజకీయాలు', en: 'Politics' },
    description: { te: 'తాజా రాజకీయ వార్తలు, విశ్లేషణలు మరియు అభిప్రాయాలు.', en: 'Latest political news, analysis, and opinion.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: lang as Language });
}

export default async function PoliticsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang={lang as Language} />;
}
