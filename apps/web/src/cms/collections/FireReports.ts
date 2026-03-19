import type { CollectionConfig } from 'payload';

export const FireReports: CollectionConfig = {
    slug: 'fire-reports',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        read: () => true,
        create: () => true,
        update: () => false,
        delete: () => false,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'issue',
            type: 'text',
            required: true,
        },
        {
            name: 'briefing',
            type: 'textarea',
            required: true,
        },
        {
            name: 'attachments',
            type: 'array',
            fields: [
                {
                    name: 'file',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
};
