import type { GlobalConfig } from 'payload';

export const ThemeSettings: GlobalConfig = {
    slug: 'theme-settings',
    label: 'Theme & Typography',
    admin: {
        description: 'Control the visual appearance, color scheme, and typography of the entire site.',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Colors',
                    description: 'Brand colors applied across the site.',
                    fields: [
                        {
                            name: 'primaryColor',
                            type: 'text',
                            label: 'Primary Color',
                            defaultValue: '#FF0000',
                        },
                        {
                            name: 'secondaryColor',
                            type: 'text',
                            label: 'Secondary Color',
                            defaultValue: '#0B3D91',
                        },
                        {
                            name: 'backgroundColor',
                            type: 'text',
                            label: 'Background Color',
                            defaultValue: '#ffffff',
                        },
                        {
                            name: 'cardColor',
                            type: 'text',
                            label: 'Card Background',
                            defaultValue: '#ffffff',
                        },
                        {
                            name: 'textColor',
                            type: 'text',
                            label: 'Main Text Color',
                            defaultValue: '#09090b',
                        },
                        {
                            name: 'mutedTextColor',
                            type: 'text',
                            label: 'Muted Text Color',
                            defaultValue: '#71717a',
                        },
                    ],
                },
                {
                    label: 'Font Sizes',
                    description: 'Controls the base text scale.',
                    fields: [
                        {
                            name: 'bodyFontSize',
                            type: 'select',
                            label: 'Base Font Size',
                            defaultValue: 'medium',
                            options: [
                                { label: 'Small (14px)', value: 'small' },
                                { label: 'Medium (16px)', value: 'medium' },
                                { label: 'Large (18px)', value: 'large' },
                            ],
                        },
                    ],
                },
                {
                    label: 'Fonts',
                    description: 'Google Font names.',
                    fields: [
                        {
                            name: 'fontHeading',
                            type: 'text',
                            label: 'Heading Font',
                            defaultValue: 'Ramabhadra',
                        },
                        {
                            name: 'fontBody',
                            type: 'text',
                            label: 'Body Font',
                            defaultValue: 'Noto Sans Telugu',
                        },
                    ],
                },
                {
                    label: 'Branding',
                    description: 'Site logo and favicon assets.',
                    fields: [
                        {
                            name: 'logo',
                            type: 'upload',
                            label: 'Site Logo',
                            relationTo: 'media',
                            admin: {
                                description: 'Logo displayed in the site header. Recommended: SVG or PNG with transparent background.',
                            },
                        },
                        {
                            name: 'favicon',
                            type: 'upload',
                            label: 'Favicon',
                            relationTo: 'media',
                            admin: {
                                description: 'Browser tab icon. Recommended: 32×32 PNG or ICO.',
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
