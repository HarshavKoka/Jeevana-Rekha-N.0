import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'business',
    title: { te: 'బిజినెస్', en: 'Business' },
    description: { te: 'తాజా వ్యాపార వార్తలు, మార్కెట్ అప్‌డేట్లు మరియు ఆర్థిక విశ్లేషణలు.', en: 'Latest business news, market updates, and financial analysis.' },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function BusinessPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
