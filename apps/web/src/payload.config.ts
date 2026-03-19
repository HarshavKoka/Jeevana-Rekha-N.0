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

// Fail fast — never start without required secrets
const REQUIRED_ENV_VARS = ['MONGODB_URI', 'PAYLOAD_SECRET'] as const;
for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
        throw new Error(`[Jeevana Rekha] Missing required environment variable: ${key}`);
    }
}

// Allowed origins — CMS admin + API only accessible from own domain
const allowedOrigins = process.env.NEXT_PUBLIC_SERVER_URL
    ? [process.env.NEXT_PUBLIC_SERVER_URL]
    : [];

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    secret: process.env.PAYLOAD_SECRET!,

    // CORS — restrict API access to own domain in production
    cors: allowedOrigins.length > 0 ? allowedOrigins : '*',

    // CSRF — protect mutations from cross-site requests
    csrf: allowedOrigins,

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
