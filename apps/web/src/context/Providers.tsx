'use client';

import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import { Language } from '../types';

interface ProvidersProps {
    children: React.ReactNode;
    initialLang: Language;
}

export const Providers: React.FC<ProvidersProps> = ({ children, initialLang }) => {
    return (
        <LanguageProvider initialLang={initialLang}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </LanguageProvider>
    );
};
