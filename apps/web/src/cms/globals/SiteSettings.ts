import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
    slug: 'site-settings',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'siteName',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
        },
        {
            name: 'socialLinks',
            type: 'array',
            fields: [
                {
                    name: 'platform',
                    type: 'text',
                },
                {
                    name: 'url',
                    type: 'text',
                },
            ],
        },
    ],
};
