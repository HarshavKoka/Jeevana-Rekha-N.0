'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface FlashHeadline {
    id: string;
    title: string;
    slug: string;
}

// Fallback headlines when CMS is not connected
const FALLBACK_HEADLINES: FlashHeadline[] = [
    { id: '1', title: 'JEEVANA REKHA - నిజం, నిర్భయత్వం, బాధ్యత', slug: '#' },
    { id: '2', title: 'బ్రేకింగ్ వార్తలు ఇక్కడ చూడండి', slug: '#' },
];

export default function RekhaFlash() {
    const [headlines, setHeadlines] = useState<FlashHeadline[]>(FALLBACK_HEADLINES);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch trending headlines from CMS
    useEffect(() => {
        async function fetchTrending() {
            try {
                const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3002';
                if (!cmsUrl) return;

                const res = await fetch(`${cmsUrl}/api/articles?where[status][equals]=published&limit=6&locale=te&sort=-publishDate`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.docs?.length > 0) {
                        setHeadlines(data.docs.map((d: any) => ({
                            id: d.id,
                            title: d.title,
                            slug: d.slug,
                        })));
                    }
                }
            } catch {
                // Silently fallback to default headlines
            }
        }
        fetchTrending();
    }, []);

    // Auto-rotate headlines
    useEffect(() => {
        if (headlines.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % headlines.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [headlines.length]);

    return (
        <div className="flex items-center gap-4 shrink-0 overflow-hidden max-w-[200px] xl:max-w-[300px]">
            {/* Blinking Red Dot + Label */}
            <Link
                href="/rekha-flash"
                className="flex items-center gap-2 group transition-all duration-300"
            >
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <span className="nav-link text-red-600 group-hover:text-red-700 whitespace-nowrap">
                    రేఖ ఫ్లాష్
                </span>
            </Link>

            {/* Separator */}
            <div className="h-4 w-[1px] bg-gray-200 dark:bg-zinc-800" />

            {/* Scrolling Headlines */}
            <div className="relative h-5 flex-1 overflow-hidden">
                {headlines.map((h, i) => (
                    <Link
                        key={h.id}
                        href={`/rekha-flash#${h.slug}`}
                        className={`absolute inset-0 transition-all duration-700 nav-link text-zinc-500 dark:text-zinc-400 hover:text-primary whitespace-nowrap overflow-hidden text-ellipsis ${
                            i === currentIndex 
                                ? 'translate-y-0 opacity-100' 
                                : 'translate-y-full opacity-0'
                        }`}
                    >
                        {h.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}
