
import React, { createContext, useState, useContext, useMemo } from 'react';
import { translations } from '../lib/translations';

type Language = 'es' | 'en';

// A recursive function to translate the entire translations object
const translateObject = (obj: any, lang: Language): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (obj.hasOwnProperty('en') && obj.hasOwnProperty('es')) {
        // Check if it's a translation leaf node
        const keys = Object.keys(obj);
        const isTranslationNode = keys.every(k => ['en', 'es'].includes(k) || !isNaN(parseInt(k)));
        if(isTranslationNode && keys.length >= 2){
             return obj[lang];
        }
    }

    if (Array.isArray(obj)) {
        return obj.map(item => translateObject(item, lang));
    }

    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = translateObject(obj[key], lang);
        }
    }
    return newObj;
};


interface LanguageContextProps {
    language: Language;
    toggleLanguage: () => void;
    t: any; // translated object
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es'); // Default to Spanish

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'es' ? 'en' : 'es'));
    };

    const t = useMemo(() => translateObject(translations, language), [language]);

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
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
