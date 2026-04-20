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

// ─── Article content block types ───────────────────────────────────────────

export interface HeroBlock {
    blockType: 'hero';
    text: string;
}

export interface ParagraphBlock {
    blockType: 'paragraph';
    text: Record<string, unknown>; // Lexical rich text JSON
}

export interface ImageBlock {
    blockType: 'image';
    image: MediaItem | string;
    caption?: string;
}

export interface QuoteBlock {
    blockType: 'quote';
    text: string;
    attribution?: string;
}

export type ContentBlock = HeroBlock | ParagraphBlock | ImageBlock | QuoteBlock;

// ─── Core entities ──────────────────────────────────────────────────────────

export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: ContentBlock[];
    publishDate: string;
    publishYear: string;
    publishMonth: string;
    publishDay: string;
    // Payload populates these as objects at depth >= 1, or returns ID strings at depth 0
    category: Category | string;
    author: Author | string;
    heroImage: MediaItem | string;
    keywords: { keyword: string }[];
    isTrending: boolean;
    isFeatured: boolean;
    status: 'draft' | 'published';
    updatedAt?: string;
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
    label: string;
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
