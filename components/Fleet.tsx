
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Page } from '../App';
import { images } from '../lib/images';

interface FleetProps {
    onNavigate: (page: Page, payload?: any) => void;
}

const Fleet: React.FC<FleetProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    const fleetData = t.fleet.data.map((aircraft: any) => ({
        ...aircraft,
        images: images.fleet[aircraft.id as keyof typeof images.fleet] || []
    }));

    const groupedFleet = useMemo(() => {
        return fleetData.reduce((acc: any, aircraft: any) => {
            const brandKey = aircraft.brand as keyof typeof t.fleet.brands;
            if (!acc[brandKey]) {
                acc[brandKey] = [];
            }
            acc[brandKey].push(aircraft);
            return acc;
        }, {} as { [key in keyof typeof t.fleet.brands]: any[] });
    }, [fleetData, t.fleet.brands]);
    
    const brands = Object.keys(groupedFleet);
    
    const [activeBrand, setActiveBrand] = useState<string>('');

    useEffect(() => {
        if (brands.length > 0 && !activeBrand) {
            setActiveBrand(brands[0]);
        }
    }, [brands, activeBrand]);

    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeBrand]);

    const activeFleet = groupedFleet[activeBrand as keyof typeof groupedFleet] || [];

    const prevSlide = useCallback(() => {
        if (!activeFleet.length) return;
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? activeFleet.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, activeFleet.length]);

    const nextSlide = useCallback(() => {
        if (!activeFleet.length) return;
        const isLastSlide = currentIndex === activeFleet.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, activeFleet.length]);

    const handleSelectAircraft = () => {
        if (!activeFleet.length) return;
        onNavigate('quote', activeFleet[currentIndex].id);
    };

    const currentAircraft = activeFleet[currentIndex];

    return (
        <section id="fleet" className="py-20 bg-gray-50/80 dark:bg-black/80 backdrop-blur-md">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-black text-center uppercase tracking-widest text-gray-900 dark:text-gray-100">{t.fleet.title}</h2>
                
                <div className="flex flex-wrap justify-center gap-2 my-8">
                    {brands.map((brandKey) => (
                        <button
                            key={brandKey}
                            onClick={() => setActiveBrand(brandKey)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${activeBrand === brandKey ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 shadow-md' : 'bg-white/50 dark:bg-gray-900/50 hover:bg-slate-200 dark:hover:bg-gray-700'}`}
                        >
                            {t.fleet.brands[brandKey as keyof typeof t.fleet.brands]}
                        </button>
                    ))}
                </div>

                <div className="mt-4 relative max-w-7xl mx-auto">
                    {currentAircraft ? (
                        <>
                            <div className="relative h-[34rem] w-full overflow-hidden rounded-lg shadow-2xl">
                                {/* Image Slides */}
                                {activeFleet.map((aircraft: any, index: number) => (
                                    <div key={aircraft.id} className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                                        <img src={aircraft.images[0]} alt={aircraft.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    </div>
                                ))}

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
                                    <h3 className="text-3xl md:text-4xl font-bold">{currentAircraft.name}</h3>
                                    <p className="mt-2 max-w-2xl text-gray-300">{currentAircraft.description}</p>
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base">
                                        <div><span className="font-bold text-slate-400">{t.fleet.capacity}:</span> {currentAircraft.capacity}</div>
                                        <div><span className="font-bold text-slate-400">{t.fleet.highlights}:</span> {currentAircraft.highlights}</div>
                                    </div>
                                    <button
                                        onClick={handleSelectAircraft}
                                        className="mt-6 inline-block bg-yellow-600 text-white font-bold uppercase tracking-wider py-2 px-6 rounded-sm hover:bg-yellow-700 transition-all duration-300 shadow-lg text-sm"
                                    >
                                        {t.fleet.selectAircraftCta}
                                    </button>
                                </div>

                                {/* Navigation */}
                                <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>

                            {/* Dots */}
                            <div className="flex justify-center mt-6 space-x-2">
                                {activeFleet.map((_: any, index: number) => (
                                    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-slate-700 dark:bg-slate-300' : 'bg-gray-300 dark:bg-gray-600 hover:bg-slate-500 dark:hover:bg-slate-400'}`}></button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 text-gray-500 dark:text-gray-400">Select a brand to view aircraft.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Fleet;
