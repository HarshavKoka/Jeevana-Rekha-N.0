import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
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

// Both the main domain and admin subdomain must be allowed.
// Admin panel at admin.jeevanarekha.com makes cross-origin API calls to
// jeevanarekha.com/api — CORS and CSRF must permit that origin.
const serverUrl  = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://jeevanarekha.com';
const adminUrl   = process.env.NEXT_PUBLIC_ADMIN_URL
    ?? (serverUrl ? serverUrl.replace('://', '://admin.') : 'https://admin.jeevanarekha.com');

// Always include both domains explicitly — never leave csrf empty
const allowedOrigins = [serverUrl, adminUrl].filter(Boolean);

export default buildConfig({
    serverURL: serverUrl,
    secret: process.env.PAYLOAD_SECRET!,

    // CORS — allow both main domain and admin subdomain
    cors: allowedOrigins,

    // CSRF — protect mutations; must include admin subdomain origin.
    // An empty array would block ALL mutations (uploads, saves, etc.)
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

    plugins: [
        s3Storage({
            collections: {
                media: {
                    prefix: 'media',
                    generateFileURL: ({ filename, prefix }) => {
                        const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
                        if (mediaUrl) return `${mediaUrl}/${filename}`;
                        return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${prefix}/${filename}`;
                    },
                },
            },
            bucket: process.env.S3_BUCKET!,
            config: {
                credentials: {
                    accessKeyId:     process.env.S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                },
                region: process.env.S3_REGION ?? 'ap-south-1', // Mumbai — always ap-south-1 for S3
            },
        }),
    ],

    localization: {
        locales: [
            { label: 'Telugu', code: 'te' },
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
