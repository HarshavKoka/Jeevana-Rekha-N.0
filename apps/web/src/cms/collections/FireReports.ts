import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor } from '../access/isAdmin';

export const FireReports: CollectionConfig = {
    slug: 'fire-reports',
    admin: {
        useAsTitle: 'name',
    },
    access: {
        // Submissions contain personal info — only admins/editors can view them.
        read: isAdminOrEditor,
        // Anyone can submit a fire report (public tip submission).
        create: () => true,
        // Reports are immutable once submitted.
        update: () => false,
        delete: isAdmin,
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
