import type { Payload } from 'payload';

export const seed = async (payload: Payload): Promise<void> => {
    payload.logger.info('Seeding database...');

    // 1. Create Admin User (Idempotent)
    let admin;
    const seedEmail    = process.env.SEED_ADMIN_EMAIL    ?? 'admin@jeevanarekha.com';
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!seedPassword) {
        throw new Error('[Seed] SEED_ADMIN_PASSWORD env var is required. Set it before running seed.');
    }

    const existingAdmin = await payload.find({
        collection: 'users',
        where: { email: { equals: seedEmail } },
    });

    if (existingAdmin.docs.length > 0) {
        // Always sync the password from env so it stays correct after a seed re-run.
        // overrideAccess is required — password is an auth field protected by access control.
        admin = await payload.update({
            collection: 'users',
            id: existingAdmin.docs[0].id,
            data: { password: seedPassword },
            overrideAccess: true,
        });
    } else {
        admin = await payload.create({
            collection: 'users',
            data: {
                email: seedEmail,
                password: seedPassword,
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
