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
                            admin: {
                                description: 'Main accent color — used for links, badges, highlights, and borders (hex value, e.g. #FF0000).',
                            },
                        },
                        {
                            name: 'secondaryColor',
                            type: 'text',
                            label: 'Secondary Color',
                            defaultValue: '#0B3D91',
                            admin: {
                                description: 'Supporting brand color for secondary elements (hex value, e.g. #0B3D91).',
                            },
                        },
                    ],
                },
                {
                    label: 'Font Sizes',
                    description: 'Controls the base text scale for the entire site. All sizes adjust proportionally.',
                    fields: [
                        {
                            name: 'bodyFontSize',
                            type: 'select',
                            label: 'Text Scale',
                            defaultValue: 'medium',
                            required: true,
                            options: [
                                { label: 'Small  (14 px) — Compact reading', value: 'small' },
                                { label: 'Medium (16 px) — Default', value: 'medium' },
                                { label: 'Large  (18 px) — Accessibility', value: 'large' },
                            ],
                            admin: {
                                description:
                                    'Sets the root font size. All text on the site — body copy, headings, captions — scales proportionally with this setting.',
                            },
                        },
                        {
                            name: 'headingScale',
                            type: 'select',
                            label: 'Heading Style',
                            defaultValue: 'normal',
                            required: true,
                            options: [
                                { label: 'Compact — Tight tracking, dense headlines', value: 'compact' },
                                { label: 'Normal  — Default editorial style', value: 'normal' },
                                { label: 'Spacious — Open tracking, airy headlines', value: 'spacious' },
                            ],
                            admin: {
                                description:
                                    'Controls letter-spacing and line-height on all headings. Does not override the font size set by Text Scale.',
                            },
                        },
                    ],
                },
                {
                    label: 'Fonts',
                    description: 'Typeface names loaded from Google Fonts.',
                    fields: [
                        {
                            name: 'fontHeadingTelugu',
                            type: 'text',
                            label: 'Telugu Heading Font',
                            defaultValue: 'Noto Serif Telugu',
                            admin: {
                                description: 'Google Font name used for all Telugu headlines (e.g. "Noto Serif Telugu").',
                            },
                        },
                        {
                            name: 'fontHeadingEnglish',
                            type: 'text',
                            label: 'English Heading Font',
                            defaultValue: 'Merriweather',
                            admin: {
                                description: 'Google Font name used for English headlines (e.g. "Merriweather").',
                            },
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
