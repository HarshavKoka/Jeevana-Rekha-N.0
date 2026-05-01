'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X, Settings, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { NAV_ITEMS } from '../lib/constants';

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
    <>
      {/* STICKY TOP ROW (Header) */}
      <div className="w-full sticky top-0 z-50 bg-[#F7F8FA] dark:bg-[#0D0D0D] border-b border-[#6B6B6B] dark:border-[#6B6B6B] transition-colors duration-500 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-4 flex items-center justify-between">

          {/* MOBILE: Hamburger trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-[#1A1A1A] dark:text-[#FFFFFF]" />
          </button>

          {/* DESKTOP LEFT: Settings hamburger + dropdown */}
          <div className="hidden lg:flex flex-1 justify-start relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(prev => !prev)}
              aria-label="Open settings"
              aria-expanded={isSettingsOpen}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 cursor-pointer ${isSettingsOpen
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white dark:bg-white dark:border-white dark:text-[#1A1A1A]'
                : 'bg-transparent border-[#1A1A1A]/20 dark:border-white/20 text-[#1A1A1A] dark:text-[#FFFFFF] hover:border-[#1A1A1A]/50 dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5'
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
                        className={`relative w-14 h-7 rounded-full border transition-all duration-500 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${theme === 'dark'
                          ? 'bg-zinc-800 border-zinc-700'
                          : 'bg-gray-100 border-gray-200'
                          }`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all duration-500 ${theme === 'dark'
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

                  {/* Navigation Links in Settings Menu */}
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-800">
                    <ul className="space-y-2 py-2">
                      {regularItems.map(item => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={() => setIsSettingsOpen(false)} className="text-sm font-bold text-zinc-900 dark:text-white hover:text-primary transition-colors block">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/50 dark:text-white/50 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="వెతకండి..."
                    className="w-52 xl:w-64 pl-9 pr-4 py-2 text-sm font-te rounded-full border border-[#1A1A1A]/20 dark:border-white/20 bg-white/50 dark:bg-black/50 text-[#1A1A1A] dark:text-[#FFFFFF] placeholder-[#1A1A1A]/40 dark:placeholder-white/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-[#1A1A1A]/50 dark:text-white/50 hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[#1A1A1A]/20 dark:border-white/20 text-[#1A1A1A]/70 dark:text-[#FFFFFF]/70 hover:border-[#1A1A1A]/50 dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1A1A1A] dark:hover:text-[#FFFFFF] transition-all duration-300 cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* NON-STICKY BOTTOM ROW (Navbar) */}
      <div className="w-full bg-[#F7F8FA] dark:bg-[#0D0D0D] border-b-[3px] border-[#6B6B6B] dark:border-[#6B6B6B] transition-colors duration-500 relative z-40">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-3 hidden lg:flex justify-center items-center">
          <nav>
            <div className="flex items-center gap-12 xl:gap-16">
              {regularItems.map((item) => {
                const fullHref = item.href;
                const isActive = pathname === fullHref || pathname.startsWith(fullHref + '/');
                return (
                  <Link
                    key={item.href}
                    href={fullHref}
                    className={`relative py-1 transition-all duration-300 nav-link font-head ${isActive
                      ? 'text-primary font-bold'
                      : 'text-[#1A1A1A]/80 dark:text-zinc-400 hover:text-primary dark:hover:text-primary'
                      }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-4 left-0 w-full h-1 bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
