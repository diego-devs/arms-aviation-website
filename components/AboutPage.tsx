
import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Page } from '../App';
import { images } from '../lib/images';

interface AboutPageProps {
    onNavigate: (page: Page) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.about.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    const nextSlide = useCallback(() => {
        const isLastSlide = currentIndex === images.about.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex]);

    return (
        <div className="bg-transparent min-h-screen text-gray-800 dark:text-gray-200 pt-24 md:pt-32 pb-20">
            <div className="container mx-auto px-6">
                <button onClick={() => onNavigate('home')} className="mb-8 text-amber-500 hover:text-amber-600 transition-colors font-semibold">
                    &larr; {t.aboutPage.backToHome}
                </button>
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">{t.aboutPage.title}</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
                        {t.aboutPage.intro}
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                            <h2 className="text-3xl font-bold uppercase tracking-wider text-amber-500 mb-4">{t.aboutPage.missionTitle}</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.aboutPage.missionText}</p>
                        </div>
                        <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                            <h2 className="text-3xl font-bold uppercase tracking-wider text-amber-500 mb-4">{t.aboutPage.visionTitle}</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.aboutPage.visionText}</p>
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex items-center justify-center">
                        <div className="relative w-full h-[34rem] rounded-lg overflow-hidden shadow-2xl">
                             {/* Images with transitions */}
                             {images.about.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`About ARMS AVIATION ${index + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                                />
                            ))}

                            {/* Navigation Buttons */}
                            <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                {images.about.map((_, index) => (
                                    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-amber-400'}`}></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
