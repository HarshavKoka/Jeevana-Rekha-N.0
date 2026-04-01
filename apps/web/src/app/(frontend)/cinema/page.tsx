import { Metadata } from 'next';
import CategoryListPage, { generateCategoryMetadata } from '@/components/CategoryListPage';

export const revalidate = 120;

const meta = {
    slug: 'cinema',
    title: { te: 'సినిమా', en: 'Cinema' },
    description: { te: 'తాజా సినిమా వార్తలు, రివ్యూలు మరియు ఇంటర్వ్యూలు.', en: 'Latest cinema news, reviews, and interviews.' },
};

export async function generateMetadata(): Promise<Metadata> {
    return generateCategoryMetadata({ categorySlug: meta.slug, title: meta.title, description: meta.description, lang: 'te' });
}

export default async function CinemaPage() {
    return <CategoryListPage categorySlug={meta.slug} title={meta.title} description={meta.description} lang="te" />;
}
