'use client';

import React from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
    title: string;
    url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };

    const shareLinks = [
        {
            name: 'Facebook',
            icon: <Facebook size={18} />,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'bg-[#1877F2]'
        },
        {
            name: 'X',
            icon: <Twitter size={18} />,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            color: 'bg-black'
        },
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={18} />,
            href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            color: 'bg-[#25D366]'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                onClick={handleNativeShare}
                className="lg:hidden flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
                <Share2 size={18} /> Share Now
            </button>

            <div className="hidden lg:flex items-center gap-3">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 ${link.color} text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm`}
                        aria-label={`Share on ${link.name}`}
                    >
                        {link.icon}
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors shadow-sm"
                    aria-label="Copy link"
                >
                    <LinkIcon size={18} />
                </button>
            </div>
        </div>
    );
}
