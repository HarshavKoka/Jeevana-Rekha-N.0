'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Moon, Sun } from 'lucide-react';
import { NAV_ITEMS } from '../lib/constants';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { usePathname } from 'next/navigation';

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
    const { language, toggleLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    // Disable scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-zinc-950 z-[70] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
                        <Link href={`/${language}`} className="text-2xl font-black font-te tracking-tighter" onClick={onClose}>
                            JEEVANA <span className="text-primary font-black uppercase">REKHA</span>
                        </Link>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Rekha Flash (Mobile) */}
                    <Link
                        href={`/${language}/rekha-flash`}
                        className="flex items-center gap-3 px-6 py-4 bg-red-50 dark:bg-red-950/20 border-b border-gray-100 dark:border-zinc-800"
                        onClick={onClose}
                    >
                        <span className="relative flex h-3 w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                        <span className="text-sm font-black uppercase tracking-[0.15em] text-red-600">
                            {language === 'te' ? 'రేఖ ఫ్లాష్' : 'REKHA FLASH'}
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-6">
                        <ul className="space-y-1">
                            {NAV_ITEMS.filter(item => !item.isFlash).map((item) => {
                                const fullHref = `/${language}${item.href}`;
                                const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/');
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={fullHref}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold font-te transition-all ${isActive
                                                ? 'text-primary bg-red-50 dark:bg-red-950/20'
                                                : 'text-gray-900 dark:text-gray-100 hover:text-primary hover:bg-gray-50 dark:hover:bg-zinc-900'
                                                }`}
                                            onClick={onClose}
                                        >
                                            {item.label[language]}
                                            {isActive && (
                                                <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Bottom Controls */}
                    <div className="p-6 border-t border-gray-100 dark:border-zinc-800 space-y-4">
                        <div className="flex items-center justify-between group">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                {language === 'te' ? 'థీమ్' : 'Theme'}
                            </span>
                            <button
                                onClick={toggleTheme}
                                className="relative w-14 h-7 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all duration-500 shadow-inner overflow-hidden"
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white dark:bg-zinc-800 shadow transform transition-all duration-500 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                                    }`}>
                                    {theme === 'dark' ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-zinc-600" />}
                                </div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between group">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                {language === 'te' ? 'భాష' : 'Language'}
                            </span>
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-primary/50 transition-all duration-300 shadow-sm"
                            >
                                <div className="relative w-5 h-5 overflow-hidden rounded-full border border-gray-100 dark:border-zinc-800">
                                    <Image src="/assets/globe.jpeg" alt="Language" fill className="object-cover" />
                                </div>
                                <span className={`font-black uppercase text-xs tracking-wider ${language === 'te' ? 'text-zinc-500' : 'text-primary'}`}>
                                    {language === 'te' ? 'EN' : 'తెలుగు'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
