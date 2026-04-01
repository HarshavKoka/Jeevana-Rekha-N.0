import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
    slug: 'media',
    upload: {
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 512,
                position: 'centre',
            },
            {
                name: 'hero',
                width: 1200,
                height: 630,
                position: 'centre',
            },
            {
                name: 'tablet',
                width: 1024,
                height: undefined,
                position: 'centre',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'alt',
            type: 'text',
            localized: true,
            admin: {
                description: 'Alt text for accessibility and SEO. Fill in after uploading.',
            },
        },
        {
            name: 'credit',
            type: 'text',
            admin: {
                description: 'Photo/image credit.',
            },
        },
    ],
};
