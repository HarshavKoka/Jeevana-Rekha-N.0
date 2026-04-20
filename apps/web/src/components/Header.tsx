'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X, Settings, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { NAV_ITEMS } from '../lib/constants';
import { langPath } from '../lib/url';
import MobileDrawer from './MobileDrawer';
import RekhaFlash from './RekhaFlash';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const settingsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node))
        setIsSettingsOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when search opens; close on Escape
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setSearchQuery(''); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

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

          {/* MOBILE: Hamburger trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* DESKTOP LEFT: Settings hamburger + dropdown */}
          <div className="hidden lg:flex flex-1 justify-start relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(prev => !prev)}
              aria-label="Open settings"
              aria-expanded={isSettingsOpen}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
                isSettingsOpen
                  ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900'
                  : 'bg-transparent border-gray-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-gray-400 dark:hover:border-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-900'
              }`}
            >
              {isSettingsOpen
                ? <X className="w-4 h-4" />
                : <Menu className="w-4 h-4" />
              }
            </button>

            {/* DROPDOWN */}
            {isSettingsOpen && (
              <div className="absolute top-14 left-0 z-50 w-64 origin-top-left animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

                  {/* Header label */}
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 flex items-center gap-2">
                    <Settings className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-600">
                      Preferences
                    </span>
                  </div>

                  {/* Theme toggle row */}
                  <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-600">
                          {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                        </p>
                      </div>

                      {/* Pill toggle */}
                      <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className={`relative w-14 h-7 rounded-full border transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          theme === 'dark'
                            ? 'bg-zinc-800 border-zinc-700'
                            : 'bg-gray-100 border-gray-200'
                        }`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all duration-500 ${
                          theme === 'dark'
                            ? 'translate-x-7 bg-zinc-700'
                            : 'translate-x-0 bg-white'
                        }`}>
                          {theme === 'dark'
                            ? <Sun className="w-3.5 h-3.5 text-amber-400" />
                            : <Moon className="w-3.5 h-3.5 text-zinc-500" />
                          }
                        </span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* CENTER: Logo */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/"
              className="relative h-10 md:h-12 w-48 md:w-64 hover:opacity-90 transition-all duration-700 transform-gpu hover:scale-[1.02] flex items-center"
            >
              <Image
                src="/assets/logo.png"
                alt="Jeevana Rekha Logo"
                fill
                className="object-contain mix-blend-multiply dark:invert dark:mix-blend-screen"
                priority
              />
            </Link>
          </div>

          {/* RIGHT: Search */}
          <div className="flex-1 flex justify-end items-center" ref={searchRef}>
            {/* Expanded search input */}
            {isSearchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="వెతకండి..."
                    className="w-52 xl:w-64 pl-9 pr-4 py-2 text-sm font-te rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-gray-400 dark:hover:border-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all duration-300"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM ROW: Navigation (Desktop) */}
        <nav className="hidden lg:flex justify-center items-center py-4 border-t border-gray-100 dark:border-zinc-900">
          <div className="flex items-center gap-12 xl:gap-16">
            {flashItem && <RekhaFlash />}
            {regularItems.map((item) => {
              const fullHref = item.href;
              const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/');
              return (
                <Link
                  key={item.href}
                  href={fullHref}
                  className={`relative py-3 font-black font-te uppercase tracking-[0.12em] transition-all duration-300 text-base ${
                    isActive
                      ? 'text-primary'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-primary'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-0 w-full h-1 bg-primary rounded-full" />
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
