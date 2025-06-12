"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState(enTranslations);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
        setTranslations(savedLanguage === 'ar' ? arTranslations : enTranslations);
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        setTranslations(lang === 'ar' ? arTranslations : enTranslations);
        localStorage.setItem('language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 