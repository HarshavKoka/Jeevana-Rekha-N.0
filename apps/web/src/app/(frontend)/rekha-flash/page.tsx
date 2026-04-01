import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'rekha-flash',
    title: { te: 'రేఖ ఫ్లాష్', en: 'Rekha Flash' },
    description: { te: 'బ్రేకింగ్ న్యూస్ మరియు ఫ్లాష్ హెడ్‌లైన్స్.', en: 'Breaking news and flash headlines.' },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function RekhaFlashPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
