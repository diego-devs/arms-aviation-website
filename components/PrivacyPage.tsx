
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Page } from '../App';

interface PrivacyPageProps {
    onNavigate: (page: Page) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 pt-24 md:pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <button onClick={() => onNavigate('home')} className="mb-8 text-amber-500 hover:text-amber-600 transition-colors font-semibold">
                    &larr; {t.privacyPage.backToHome}
                </button>
                <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-8">
                        {t.privacyPage.title}
                    </h1>
                    <div className="text-gray-700 dark:text-gray-300 space-y-8">
                        {t.privacyPage.content.map((section: any, index: number) => (
                            <div key={index}>
                                <h2 className="text-2xl font-bold text-amber-500 mb-3">{section.heading}</h2>
                                <p className="leading-relaxed whitespace-pre-line">{section.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
