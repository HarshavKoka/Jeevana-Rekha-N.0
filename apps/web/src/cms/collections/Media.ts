import type { CollectionConfig } from 'payload';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
    slug: 'media',
    upload: {
        staticDir: path.resolve(dirname, '../../../../media'),
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
            required: true,
            localized: true,
            admin: {
                description: 'Alt text for accessibility and SEO.',
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
