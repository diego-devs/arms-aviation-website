
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CtaSectionProps {
    onNavigate: (page: 'quote') => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    return (
        <section id="contact" className="relative py-24 md:py-32 flex items-center justify-center text-center text-white">
             <div className="absolute inset-0 bg-black/40 z-10"></div>
            <div className="relative z-20 container mx-auto px-6">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest">{t.cta.title}</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                    {t.cta.subtitle}
                </p>
                <button
                    onClick={() => onNavigate('quote')}
                    className="mt-8 inline-block bg-yellow-600 text-white font-bold uppercase tracking-wider py-4 px-10 rounded-sm hover:bg-yellow-700 transition-all duration-300 shadow-lg text-lg"
                >
                    {t.cta.button}
                </button>
            </div>
        </section>
    );
};

export default CtaSection;
