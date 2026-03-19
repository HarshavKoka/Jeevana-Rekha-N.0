import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            localized: true,
            unique: true,
        },
        {
            name: 'layout',
            type: 'blocks',
            blocks: [],
        },
    ],
};
