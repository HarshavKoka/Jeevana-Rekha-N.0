import { Metadata } from 'next';
import { Language } from '@/types';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 60;

const meta = {
    slug: 'rekha-flash',
    title: { te: 'రేఖ ఫ్లాష్', en: 'Rekha Flash' },
    description: { te: 'బ్రేకింగ్ న్యూస్ మరియు ఫ్లాష్ హెడ్‌లైన్స్.', en: 'Breaking news and flash headlines.' },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: lang as Language });
}

export default async function RekhaFlashPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang={lang as Language} />;
}
