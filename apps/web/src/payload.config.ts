import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './cms/collections/Users';
import { Articles } from './cms/collections/Articles';
import { Categories } from './cms/collections/Categories';
import { Media } from './cms/collections/Media';
import { FireReports } from './cms/collections/FireReports';
import { Pages } from './cms/collections/Pages';
import { ThemeSettings } from './cms/globals/ThemeSettings';
import { SiteSettings } from './cms/globals/SiteSettings';
import { seed } from './cms/seed';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION',

    admin: {
        user: Users.slug,
        meta: {
            titleSuffix: ' — Jeevana Rekha CMS',
        },
    },

    editor: lexicalEditor(),

    db: mongooseAdapter({
        url: process.env.MONGODB_URI || '',
    }),

    collections: [
        Users,
        Articles,
        Categories,
        Media,
        FireReports,
        Pages,
    ],

    globals: [
        ThemeSettings,
        SiteSettings,
    ],

    localization: {
        locales: [
            { label: 'Telugu', code: 'te' },
            { label: 'English', code: 'en' },
        ],
        defaultLocale: 'te',
        fallback: true,
    },

    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },

    sharp,

    onInit: async (payload) => {
        if (process.env.PAYLOAD_SEED === 'true') {
            await seed(payload);
        }
    },
});
