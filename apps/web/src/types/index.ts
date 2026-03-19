export type Language = 'te' | 'en';

export type CategorySlug =
    | 'trending'
    | 'fire'
    | 'cinema'
    | 'sports'
    | 'politics'
    | 'business'
    | 'jobs'
    | 'technology'
    | 'spiritual'
    | 'defense'
    | 'videos';

export interface Category {
    id: string;
    slug: CategorySlug;
    title: string; // Localized from CMS
    order?: number;
    description?: string;
}

export interface Author {
    id: string;
    name: string;
    email?: string;
    bio?: string;
    avatar?: string;
    role?: string;
}

export interface MediaItem {
    id: string;
    url: string;
    alt: string;
    credit?: string;
    sizes?: {
        thumbnail?: { url: string };
        card?: { url: string };
        hero?: { url: string };
        tablet?: { url: string };
    };
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: any[]; // Block content from Payload
    publishDate: string;
    publishYear: string;
    publishMonth: string;
    publishDay: string;
    category: Category;
    author: Author;
    heroImage: MediaItem | string;
    keywords: { keyword: string }[];
    isTrending: boolean;
    isFeatured: boolean;
    status: 'draft' | 'published';
    seo?: {
        title?: string;
        description?: string;
    };
}

export interface Video {
    id: string;
    title: string;
    url: string;
    thumbnail?: string;
    category?: CategorySlug;
    date: string;
}

export interface NavItem {
    label: {
        te: string;
        en: string;
    };
    href: string;
    isFlash?: boolean; // Rekha Flash special styling
    isExternal?: boolean;
}

export interface SiteSettings {
    siteName: string;
    description: string;
    socialLinks: {
        platform: string;
        url: string;
    }[];
}
