
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeroProps {
    onNavigate: (page: 'quote') => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    return (
        <section className="relative h-screen flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <div className="relative z-20 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-widest">
                    {t.hero.title}
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    {t.hero.subtitle}
                </p>
                <button
                    onClick={() => onNavigate('quote')}
                    className="mt-8 inline-block bg-amber-500 text-white font-bold uppercase tracking-wider py-3 px-8 rounded-sm hover:bg-amber-600 transition-all duration-300 shadow-lg"
                >
                    {t.hero.cta}
                </button>
            </div>
        </section>
    );
};

export default Hero;
