import type { GlobalConfig } from 'payload';

export const ThemeSettings: GlobalConfig = {
    slug: 'theme-settings',
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'primaryColor',
            type: 'text',
            defaultValue: '#FF0000',
        },
        {
            name: 'secondaryColor',
            type: 'text',
            defaultValue: '#0B3D91',
        },
        {
            name: 'fontHeadingEnglish',
            type: 'text',
            defaultValue: 'Merriweather',
        },
        {
            name: 'fontHeadingTelugu',
            type: 'text',
            defaultValue: 'Noto Serif Telugu',
        },
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'favicon',
            type: 'upload',
            relationTo: 'media',
        },
    ],
};
