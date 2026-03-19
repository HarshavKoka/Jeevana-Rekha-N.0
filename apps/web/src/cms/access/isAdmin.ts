import type { Access } from 'payload';

// Minimal user shape — matches the Users collection's `roles` field
type CmsUser = {
    id: string;
    roles?: string[];
};

/** Only admins can perform this action. */
export const isAdmin: Access = ({ req: { user } }) => {
    return Boolean((user as CmsUser)?.roles?.includes('admin'));
};

/** Admins and editors can perform this action. */
export const isAdminOrEditor: Access = ({ req: { user } }) => {
    const roles = (user as CmsUser)?.roles ?? [];
    return roles.includes('admin') || roles.includes('editor');
};
