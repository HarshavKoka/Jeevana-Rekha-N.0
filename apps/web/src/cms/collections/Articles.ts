import type { CollectionConfig } from 'payload';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { isAdmin, isAdminOrEditor } from '../access/isAdmin';

// Lazily initialized — only created when a published article is saved
let cfClient: CloudFrontClient | null = null;
function getCloudFrontClient(): CloudFrontClient {
    if (!cfClient) {
        cfClient = new CloudFrontClient({
            region: 'us-east-1', // Always us-east-1 for CloudFront (global service)
            credentials: {
                accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }
    return cfClient;
}

const invalidateCloudFront = async (slug: string, dateStr: string, categorySlug: string) => {
    const distributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;
    if (!distributionId) return;

    const paths = [
        '/',
        `/te/${dateStr}/*`,
        `/${categorySlug}`,
        '/trending',
        '/api/*',
    ];

    await getCloudFrontClient().send(
        new CreateInvalidationCommand({
            DistributionId: distributionId,
            InvalidationBatch: {
                CallerReference: `${slug}-${Date.now()}`,
                Paths: { Quantity: paths.length, Items: paths },
            },
        }),
    );
    console.log(`[CloudFront] Invalidated for: ${slug}`);
};

export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'publishDate', 'status', 'isTrending', 'isFeatured'],
    },
    access: {
        read: ({ req: { user } }) => {
            if (user) return true;
            return { status: { equals: 'published' } };
        },
        create: isAdminOrEditor,
        update: isAdminOrEditor,
        delete: isAdmin,
    },
    hooks: {
        beforeChange: [
            ({ data }) => {
                if (data?.publishDate) {
                    const d = new Date(data.publishDate);
                    data.publishYear = String(d.getFullYear());
                    data.publishMonth = String(d.getMonth() + 1).padStart(2, '0');
                    data.publishDay = String(d.getDate()).padStart(2, '0');
                }
                return data;
            },
        ],
        afterChange: [
            async ({ doc }) => {
                // Only invalidate when publishing
                if (doc.status !== 'published') return;

                const dateStr = doc.publishDate
                    ? new Date(doc.publishDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0];
                const categorySlug =
                    typeof doc.category === 'object' ? doc.category?.slug : 'general';

                // ── Step 1: Bust Next.js ISR data cache ──────────────────────
                try {
                    const { revalidateTag, revalidatePath } = await import('next/cache');
                    revalidateTag('articles');
                    revalidatePath('/');
                    revalidatePath('/trending');
                    revalidatePath(`/${categorySlug}`);
                } catch {
                    // silently skip if called outside App Router request context
                }

                // ── Step 2: Bust CloudFront edge cache ───────────────────────
                try {
                    await invalidateCloudFront(doc.slug, dateStr, categorySlug);
                } catch (err) {
                    // Log but never crash — a failed invalidation is non-fatal
                    console.error('[CloudFront] Cache invalidation failed:', err);
                }
            },
        ],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
            required: true,
            localized: true,
            admin: {
                description: 'Short summary shown on cards and in SEO meta description.',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
                description: 'URL-safe identifier. e.g. india-condemns-attacks',
            },
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: false,
            required: true,
        },
        {
            name: 'keywords',
            type: 'array',
            admin: {
                description: 'Tags/keywords for this article. Used for SEO and filtering.',
            },
            fields: [
                {
                    name: 'keyword',
                    type: 'text',
                    required: true,
                },
            ],
        },
        {
            name: 'publishDate',
            type: 'date',
            required: true,
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
        {
            name: 'publishYear',
            type: 'text',
            admin: { hidden: true },
        },
        {
            name: 'publishMonth',
            type: 'text',
            admin: { hidden: true },
        },
        {
            name: 'publishDay',
            type: 'text',
            admin: { hidden: true },
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'isTrending',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Show in Rekha Flash ticker & trending page.',
            },
        },
        {
            name: 'isFeatured',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Feature as hero article on homepage.',
            },
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'draft',
            options: [
                { label: 'Draft', value: 'draft' },
                { label: 'Published', value: 'published' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'content',
            type: 'blocks',
            blocks: [
                {
                    slug: 'hero',
                    fields: [{ name: 'text', type: 'text' }],
                },
                {
                    slug: 'paragraph',
                    fields: [{ name: 'text', type: 'richText' }],
                },
                {
                    slug: 'image',
                    fields: [
                        { name: 'image', type: 'upload', relationTo: 'media' },
                        { name: 'caption', type: 'text', localized: true },
                    ],
                },
                {
                    slug: 'quote',
                    fields: [
                        { name: 'text', type: 'textarea', localized: true },
                        { name: 'attribution', type: 'text' },
                    ],
                },
            ],
        },
        {
            name: 'seo',
            type: 'group',
            admin: {
                description: 'Override auto-generated SEO. Leave blank to use title/excerpt.',
            },
            fields: [
                { name: 'title', type: 'text', localized: true },
                { name: 'description', type: 'textarea', localized: true },
            ],
        },
    ],
};
