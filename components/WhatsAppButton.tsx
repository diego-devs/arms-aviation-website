
import React, { useState } from 'react';
import { WhatsAppIcon } from './icons/SocialIcons';
import { useLanguage } from '../contexts/LanguageContext';
import WhatsAppModal from './WhatsAppModal';

const WhatsAppButton: React.FC = () => {
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSend = (message: string) => {
        if (!message.trim()) return;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/525561132730?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 z-40"
                aria-label={t.whatsapp.ariaLabel}
            >
                <WhatsAppIcon />
            </button>
            <WhatsAppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSend={handleSend}
            />
        </>
    );
};

export default WhatsAppButton;
