import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug', 'order'],
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
            unique: true,
            admin: {
                position: 'sidebar',
                description: 'URL slug: politics, business, cinema, sports, etc.',
            },
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 0,
            admin: {
                position: 'sidebar',
                description: 'Display order in navigation (lower = first).',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
            admin: {
                description: 'Category description for SEO and category pages.',
            },
        },
    ],
};
