"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(null);
    const [translations, setTranslations] = useState(null);

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
            setTranslations(savedLanguage === 'ar' ? arTranslations : enTranslations);
        } else {
            setLanguage('en');
            setTranslations(enTranslations);
        }
    }, []);

    const changeLanguage = (lang) => {
        setLanguage(lang);
        setTranslations(lang === 'ar' ? arTranslations : enTranslations);
        localStorage.setItem('language', lang);
    };

    if (language === null || translations === null) {
        return null;
    }

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