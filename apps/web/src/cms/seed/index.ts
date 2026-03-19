import type { Payload } from 'payload';

export const seed = async (payload: Payload): Promise<void> => {
    payload.logger.info('Seeding database...');

    // 1. Create Admin User (Idempotent)
    let admin;
    const existingAdmin = await payload.find({
        collection: 'users',
        where: { email: { equals: 'admin@jeevanarekha.com' } },
    });

    if (existingAdmin.docs.length > 0) {
        admin = existingAdmin.docs[0];
    } else {
        admin = await payload.create({
            collection: 'users',
            data: {
                email: 'admin@jeevanarekha.com',
                password: 'password',
                roles: ['admin'],
            },
        });
    }

    // 2. Create Categories (Idempotent)
    const categoryDocs = [
        { title_te: 'రాజకీయాలు', title_en: 'Politics', slug: 'politics' },
        { title_te: 'క్రీడలు', title_en: 'Sports', slug: 'sports' },
        { title_te: 'సినిమా', title_en: 'Cinema', slug: 'cinema' },
        { title_te: 'బిజినెస్', title_en: 'Business', slug: 'business' },
        { title_te: 'టెక్నాలజీ', title_en: 'Technology', slug: 'technology' },
        { title_te: 'ఉద్యోగాలు', title_en: 'Jobs', slug: 'jobs' },
        { title_te: 'ట్రెండింగ్', title_en: 'Trending', slug: 'trending' },
    ];

    await Promise.all(
        categoryDocs.map(async (cat) => {
            const existing = await payload.find({
                collection: 'categories',
                where: { slug: { equals: cat.slug } },
            });
            if (existing.docs.length > 0) return existing.docs[0];
            return payload.create({
                collection: 'categories',
                locale: 'te',
                data: {
                    title: cat.title_te,
                    slug: cat.slug,
                },
            }).then(async (doc) => {
                await payload.update({
                    collection: 'categories',
                    id: doc.id,
                    locale: 'en',
                    data: {
                        title: cat.title_en,
                    },
                });
                return doc;
            });
        })
    );

    payload.logger.info('Seeding complete.');
};
