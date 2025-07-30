
import React from 'react';
import { WhatsAppIcon } from './icons/SocialIcons';
import { useLanguage } from '../contexts/LanguageContext';

const WhatsAppButton: React.FC = () => {
    const { t } = useLanguage();
    return (
        <a 
            href="https://wa.me/525561132730" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 z-40"
            aria-label={t.whatsapp.ariaLabel}
        >
            <WhatsAppIcon />
        </a>
    );
};

export default WhatsAppButton;
