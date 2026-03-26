'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { NAV_ITEMS } from '../lib/constants';
import { langPath } from '../lib/url';
import MobileDrawer from './MobileDrawer';
import RekhaFlash from './RekhaFlash';

export default function Header({ lang }: { lang: string }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Separate Rekha Flash from regular nav items
  const flashItem = NAV_ITEMS.find(item => item.isFlash);
  const regularItems = NAV_ITEMS.filter(item => !item.isFlash);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-700 border-b ${isScrolled
      ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md py-2 shadow-sm border-gray-100 dark:border-zinc-800'
      : 'bg-white dark:bg-zinc-950 py-3 border-transparent'
      }`}>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-10">
        {/* TOP ROW: Logo and Controls */}
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* MOBILE MENU TRIGGER */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* LEFT: ELITE THEME TOGGLE (Desktop) */}
          <div className="hidden lg:flex flex-1 justify-start">
            <button
              onClick={toggleTheme}
              className="relative w-16 h-8 rounded-full bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all duration-500 hover:border-primary/50 group overflow-hidden shadow-inner"
              aria-label="Toggle Theme"
            >
              <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 shadow-md transform transition-all duration-500 flex items-center justify-center ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
                }`}>
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-600" />
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sun className={`w-3 h-3 text-amber-500 transition-transform duration-500 ${theme === 'dark' ? 'scale-0' : 'scale-100'}`} />
                <Moon className={`w-3 h-3 text-zinc-400 transition-transform duration-500 ${theme === 'dark' ? 'scale-100' : 'scale-0'}`} />
              </div>
            </button>
          </div>

          {/* CENTER: LOGO */}
          <div className="flex-1 flex justify-center">
            <Link href={langPath(language, '/')} className="text-3xl md:text-4xl font-black font-te flex items-center gap-2 text-zinc-900 dark:text-white hover:opacity-90 transition-all duration-700 transform-gpu hover:scale-[1.02] tracking-tight group">
              JEEVANA <span className="text-primary font-black uppercase group-hover:scale-105 transition-transform duration-700 inline-block">REKHA</span>
            </Link>
          </div>

          {/* RIGHT: ELITE LANGUAGE TOGGLE with globe icon */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleLanguage}
              className="group flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-zinc-900 transition-all duration-500 shadow-sm bg-white dark:bg-zinc-950"
              aria-label="Change Language"
            >
              <div className="relative w-6 h-6 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform duration-500">
                <Image
                  src="/assets/globe.jpeg"
                  alt="Language"
                  fill
                  className="object-cover"
                />
              </div>
              <span className={`font-black uppercase tracking-[0.1em] text-sm transition-all duration-500 ${language === 'te' ? 'text-zinc-700 dark:text-zinc-200' : 'text-primary'
                }`}>
                {language === 'te' ? 'English' : 'తెలుగు'}
              </span>
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Navigation (Desktop) - EXTRAORDINARY RESTRUCTURE */}
        <nav className="hidden lg:flex items-center py-4 border-t border-gray-100 dark:border-zinc-900">
          <div className="flex items-center gap-12 xl:gap-16">
            <RekhaFlash />
            {regularItems.map((item) => {
              const fullHref = langPath(language, item.href);
              const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/');
              return (
                <Link
                  key={item.href}
                  href={fullHref}
                  className={`relative py-3 font-black font-te uppercase tracking-[0.12em] transition-all duration-800 transform-gpu ease-[cubic-bezier(0.16,1,0.3,1)] text-base ${isActive ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400 hover:text-primary'} ${language === 'en' ? 'scale-100' : 'scale-100'
                    }`}
                >
                  {item.label[language]}
                  {isActive && (
                    <span className="absolute bottom-1 left-0 w-full h-1 bg-primary rounded-full transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* MOBILE DRAWER */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}
