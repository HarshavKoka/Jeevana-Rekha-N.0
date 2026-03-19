import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor } from '../access/isAdmin';

export const Articles: CollectionConfig = {
    slug: 'articles',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'category', 'publishDate', 'status', 'isTrending', 'isFeatured'],
    },
    access: {
        read: () => true,
        create: isAdminOrEditor,
        update: isAdminOrEditor,
        delete: isAdmin, // only admins can permanently delete
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
