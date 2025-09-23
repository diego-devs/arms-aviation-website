
import React, { useState, useCallback, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { images } from '../lib/images';

const GallerySection: React.FC = () => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    const galleryImages = images.mainGallery;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, [galleryImages.length]);

    const prevSlide = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? galleryImages.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, galleryImages.length]);

    useEffect(() => {
        const timer = setTimeout(nextSlide, 5000); // Change image every 5 seconds
        return () => clearTimeout(timer);
    }, [currentIndex, nextSlide]);

    return (
        <section id="gallery" className="py-20 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-gray-900 dark:text-gray-100">
                        {t.gallerySection.title}
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                        {t.gallerySection.subtitle}
                    </p>
                </div>

                <div className="relative max-w-7xl mx-auto">
                    <div className="relative h-[36rem] w-full overflow-hidden rounded-lg shadow-2xl">
                        {galleryImages.map((src, index) => (
                             <div 
                                key={src} 
                                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                             >
                                <img src={src} alt={`Gallery image ${index + 1}`} className="w-full h-full object-cover" />
                             </div>
                        ))}

                        {/* Navigation */}
                        <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10" aria-label="Previous image">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10" aria-label="Next image">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {galleryImages.map((_, index) => (
                            <button 
                                key={index} 
                                onClick={() => setCurrentIndex(index)} 
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600 hover:bg-amber-400'}`}
                                aria-label={`Go to image ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
