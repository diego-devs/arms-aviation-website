
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SpanishFlagIcon, EnglishFlagIcon } from './icons/FlagIcons';

const LanguageToggle: React.FC = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
            aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
            {language === 'es' ? <EnglishFlagIcon /> : <SpanishFlagIcon />}
        </button>
    );
};

export default LanguageToggle;
