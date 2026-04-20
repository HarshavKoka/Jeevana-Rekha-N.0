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
        <div className="flex items-center gap-3 shrink-0">
            {/* Blinking Red Dot + Label */}
            <Link
                href="/rekha-flash"
                className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
            >
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <span className={`font-black uppercase tracking-[0.14em] text-red-600 group-hover:text-red-700 transition-all duration-300 whitespace-nowrap text-base`}>
                    రేఖ ఫ్లాష్
                </span>
            </Link>
        </div>
    );
}
