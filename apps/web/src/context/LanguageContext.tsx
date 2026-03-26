'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Language } from '../types';

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode, initialLang: Language }> = ({ children, initialLang }) => {
    const [language, setLanguageState] = useState<Language>(initialLang);
    const router = useRouter();
    const pathname = usePathname();

    // Keep language state in sync with the visible URL.
    // Telugu is the default (no prefix); English uses /en prefix.
    useEffect(() => {
        const langFromUrl: Language = pathname.startsWith('/en') ? 'en' : 'te';
        setLanguageState(langFromUrl);
        localStorage.setItem('lang', langFromUrl);
    }, [pathname]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('lang', lang);

        if (lang === 'en') {
            // Currently on Telugu (no prefix) → prepend /en
            if (!pathname.startsWith('/en')) {
                router.push('/en' + (pathname === '/' ? '' : pathname));
            }
        } else {
            // Currently on English → strip /en prefix
            if (pathname.startsWith('/en')) {
                const stripped = pathname.slice(3) || '/';
                router.push(stripped);
            }
        }
    };

    const toggleLanguage = () => {
        const newLang = language === 'te' ? 'en' : 'te';
        setLanguage(newLang);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
