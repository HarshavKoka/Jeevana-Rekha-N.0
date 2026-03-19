import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
    },
    fields: [
        {
            name: 'roles',
            type: 'select',
            hasMany: true,
            defaultValue: ['editor'],
            options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Editor', value: 'editor' },
            ],
            access: {
                read: ({ req: { user } }) => Boolean((user as any)?.roles?.includes('admin')),
                update: ({ req: { user } }) => Boolean((user as any)?.roles?.includes('admin')),
            },
        },
    ],
};
