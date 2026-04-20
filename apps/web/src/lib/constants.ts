import { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
    {
        label: 'రేఖ ఫ్లాష్',
        href: '/rekha-flash',
        isFlash: true,
    },
    {
        label: 'ట్రెండింగ్',
        href: '/trending',
    },
    {
        label: 'ఫైర్',
        href: '/fire',
    },
    {
        label: 'సినిమా',
        href: '/cinema',
    },
    {
        label: 'స్పోర్ట్స్',
        href: '/sports',
    },
    {
        label: 'రాజకీయాలు',
        href: '/politics',
    },
    {
        label: 'బిజినెస్',
        href: '/business',
    },
    {
        label: 'ఉద్యోగాలు',
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
    domain: 'jeevanarekha.com',
    description: 'నిజాన్ని నిర్భయంగా, నిష్పక్షపాతంగా అందించే తెలుగు వార్తా పోర్టల్.',
    author: 'Vijayi Software',
};

// Category slugs that have their own direct routes
export const CATEGORY_ROUTES = [
    'trending', 'fire', 'cinema', 'sports', 'politics', 'business', 'jobs'
] as const;
