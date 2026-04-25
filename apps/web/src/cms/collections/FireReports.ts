import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminOrEditor } from '../access/isAdmin';

export const FireReports: CollectionConfig = {
    slug: 'fire-reports',
    admin: {
        useAsTitle: 'issue',
        defaultColumns: ['issue', 'name', 'status', 'createdAt'],
        listSearchableFields: ['name', 'issue', 'briefing'],
    },
    access: {
        // Submissions contain personal info — only admins/editors can view them.
        read: isAdminOrEditor,
        // Anyone can submit a fire report (public tip submission).
        create: () => true,
        // Allow editors to update status for verification.
        update: isAdminOrEditor,
        delete: isAdmin,
    },
    fields: [
        {
            name: 'status',
            type: 'select',
            defaultValue: 'pending',
            options: [
                { label: 'Pending / పెండింగ్', value: 'pending' },
                { label: 'Reviewed / పరిశీలించబడింది', value: 'reviewed' },
                { label: 'Rejected / తిరస్కరించబడింది', value: 'rejected' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Reporter Name',
        },
        {
            name: 'issue',
            type: 'text',
            required: true,
            label: 'Issue / Headline',
        },
        {
            name: 'briefing',
            type: 'textarea',
            required: true,
            label: 'Detailed Briefing',
        },
        {
            name: 'attachments',
            type: 'array',
            label: 'Evidence / Attachments',
            fields: [
                {
                    name: 'file',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
    ],
    timestamps: true,
};
