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

    useEffect(() => {
        const savedLang = localStorage.getItem('lang') as Language | null;
        if (savedLang && savedLang !== initialLang) {
            // If the saved language is different from the current URL lang, 
            // we might want to redirect, but for now we just sync the state
            setLanguageState(savedLang);
        }
    }, [initialLang]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('lang', lang);

        // Redirect to the new language route
        const segments = pathname.split('/');
        segments[1] = lang;
        router.push(segments.join('/'));
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
