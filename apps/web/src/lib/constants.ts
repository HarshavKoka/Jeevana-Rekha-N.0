import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
    {
        label: { te: 'రేఖ ఫ్లాష్', en: 'Rekha Flash' },
        href: '/rekha-flash',
        isFlash: true,
    },
    {
        label: { te: 'ట్రెండింగ్', en: 'Trending' },
        href: '/trending',
    },
    {
        label: { te: 'ఫైర్', en: 'Fire' },
        href: '/fire',
    },
    {
        label: { te: 'సినిమా', en: 'Cinema' },
        href: '/cinema',
    },
    {
        label: { te: 'స్పోర్ట్స్', en: 'Sports' },
        href: '/sports',
    },
    {
        label: { te: 'రాజకీయాలు', en: 'Politics' },
        href: '/politics',
    },
    {
        label: { te: 'బిజినెస్', en: 'Business' },
        href: '/business',
    },
    {
        label: { te: 'ఉద్యోగాలు', en: 'Jobs' },
        href: '/jobs',
    },
];

export const SOCIAL_LINKS = {
    facebook: 'https://facebook.com/jeevanarekha',
    twitter: 'https://twitter.com/jeevanarekha',
    instagram: 'https://instagram.com/jeevanarekha',
    youtube: 'https://youtube.com/jeevanarekha',
};

export const SITE_CONFIG = {
    name: 'JEEVANA REKHA',
    nameTE: 'JEEVANA REKHA',
    domain: 'jeevanarekha.com',
    description: {
        te: 'నిజాన్ని నిర్భయంగా, నిష్పక్షపాతంగా అందించే తెలుగు వార్తా పోర్టల్.',
        en: 'A trusted digital news platform committed to ethical journalism and public interest.',
    },
    author: 'Vijayi Software',
};

// Category slugs that have their own direct routes
export const CATEGORY_ROUTES = [
    'trending', 'fire', 'cinema', 'sports', 'politics', 'business', 'jobs'
] as const;
