
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { images } from '../lib/images';
import { Airport, searchAirports, getPopularAirports, PopularAirportGroup } from '../lib/airportService';

// Custom hook for debouncing input
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

interface AirportInputProps {
    id: string;
    label: string;
    onAirportSelect: (airport: Airport | null) => void;
    placeholder: string;
    required: boolean;
}

type AirportResults = Airport[] | PopularAirportGroup[];

const AirportInput: React.FC<AirportInputProps> = ({ id, label, onAirportSelect, placeholder, required }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<AirportResults>([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [popularAirports, setPopularAirports] = useState<PopularAirportGroup[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        getPopularAirports().then(setPopularAirports).catch(console.error);
    }, []);

    useEffect(() => {
        const fetchAirports = async () => {
            if (debouncedQuery.length > 2) {
                const searchResult = await searchAirports(debouncedQuery);
                setResults(searchResult);
                setDropdownVisible(searchResult.length > 0);
            } else if (query.length > 0 && debouncedQuery.length <= 2) {
                setDropdownVisible(false);
            } else if (query.length === 0 && document.activeElement !== document.getElementById(id)) {
                 setDropdownVisible(false);
            }
        };
        fetchAirports().catch(console.error);
    }, [debouncedQuery, query, id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (airport: Airport) => {
        onAirportSelect(airport);
        setQuery(`${airport.name} (${airport.iata})`);
        setDropdownVisible(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        onAirportSelect(null);
        if (newQuery.length === 0) {
            setResults(popularAirports);
            setDropdownVisible(true);
        }
    };
    
    const handleFocus = () => {
        if (!query) {
            setResults(popularAirports);
            setDropdownVisible(popularAirports.some(g => g.airports.length > 0));
        } else if (results.length > 0) {
            setDropdownVisible(true);
        }
    };

    const areResultsGrouped = (res: AirportResults): res is PopularAirportGroup[] => {
        return res.length > 0 && 'titleKey' in res[0] && Array.isArray((res[0] as PopularAirportGroup).airports);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label htmlFor={id} className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{label}</label>
            <input
                id={id}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                placeholder={placeholder}
                required={required && !query.includes('(')}
                autoComplete="off"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            {isDropdownVisible && results.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {areResultsGrouped(results) ? (
                        results.map(group => (
                            <React.Fragment key={group.titleKey}>
                                <li className="px-4 py-2 text-xs font-bold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50 sticky top-0">{t.quotePage.popularAirports[group.titleKey as keyof typeof t.quotePage.popularAirports]}</li>
                                {group.airports.map(airport => (
                                    <li
                                        key={airport.iata}
                                        onClick={() => handleSelect(airport)}
                                        className="px-4 py-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/20 text-sm"
                                    >
                                        <div className="font-semibold">{airport.name} ({airport.iata})</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{airport.city}, {airport.country}</div>
                                    </li>
                                ))}
                            </React.Fragment>
                        ))
                    ) : (
                        (results as Airport[]).map(airport => (
                             <li
                                key={airport.iata}
                                onClick={() => handleSelect(airport)}
                                className="px-4 py-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700/20 text-sm"
                            >
                                <div className="font-semibold">{airport.name} ({airport.iata})</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{airport.city}, {airport.country}</div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};


interface QuotePageProps {
    onNavigate: (page: 'home') => void;
    preSelectedAircraftId?: string;
}

const QuotePage: React.FC<QuotePageProps> = ({ onNavigate, preSelectedAircraftId }) => {
    const { t } = useLanguage();
    const allAircraft = t.fleet.data.map((craft: any) => ({
        ...craft,
        images: images.fleet[craft.id as keyof typeof images.fleet] || []
    }));

    const groupedAircraft = useMemo(() => {
        return allAircraft.reduce((acc: { [key: string]: any[] }, aircraft: any) => {
            // FIX: The cast `as keyof typeof t.fleet.brands` was incorrect because `t` is `any`,
            // which resulted in `brandKey` having a type of `string | number | symbol`, causing indexing errors.
            // `aircraft.brand` is already a string.
            const brandKey = aircraft.brand;
            if (!acc[brandKey]) {
                acc[brandKey] = [];
            }
            acc[brandKey].push(aircraft);
            return acc;
        }, {} as { [key: string]: any[] });
    }, [allAircraft]);

    const aircraftBrands = Object.keys(groupedAircraft);

    const [selectedAircraftId, setSelectedAircraftId] = useState<string>(preSelectedAircraftId || '');
    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    const [travelDate, setTravelDate] = useState('');
    const [numPassengers, setNumPassengers] = useState('1');
    const [flightType, setFlightType] = useState<'one-way' | 'round-trip'>('one-way');
    const [passengerName, setPassengerName] = useState('');
    const [passengerEmail, setPassengerEmail] = useState('');
    const [passengerPhone, setPassengerPhone] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const selectedAircraft = allAircraft.find((a: any) => a.id === selectedAircraftId);
    
    useEffect(() => {
        if (preSelectedAircraftId) {
            setSelectedAircraftId(preSelectedAircraftId);
            setCurrentImageIndex(0);
        }
    }, [preSelectedAircraftId]);
    
    const aircraftImages = selectedAircraft ? selectedAircraft.images : [];

    const handleAircraftChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAircraftId(e.target.value);
        setCurrentImageIndex(0);
    };
    
    const nextImage = () => {
        setCurrentImageIndex(prev => (prev === aircraftImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev === 0 ? aircraftImages.length - 1 : prev - 1));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedAircraftId || !origin || !destination) {
            alert('Please fill all required fields');
            return;
        }

        const selectedAircraftInfo = allAircraft.find((a: any) => a.id === selectedAircraftId);
        
        const aircraftName = selectedAircraftId === 'other' 
            ? t.quotePage.otherAircraft 
            : selectedAircraftInfo?.name;
        
        const originText = `${origin.name} (${origin.iata})`;
        const destinationText = `${destination.name} (${destination.iata})`;

        const messageParts = [
            `*${t.quotePage.whatsappMessage.title}*`,
            '',
            `*${t.quotePage.whatsappMessage.passengerName}:* ${passengerName}`,
            `*${t.quotePage.whatsappMessage.passengerEmail}:* ${passengerEmail}`,
            `*${t.quotePage.whatsappMessage.passengerPhone}:* ${passengerPhone}`,
            `*${t.quotePage.whatsappMessage.aircraft}:* ${aircraftName}`,
            `*${t.quotePage.whatsappMessage.flightType}:* ${flightType === 'one-way' ? t.quotePage.oneWay : t.quotePage.roundTrip}`,
            `*${t.quotePage.whatsappMessage.numPassengers}:* ${numPassengers}`,
            `*${t.quotePage.whatsappMessage.origin}:* ${originText}`,
            `*${t.quotePage.whatsappMessage.destination}:* ${destinationText}`,
            `*${t.quotePage.whatsappMessage.date}:* ${travelDate}`
        ];

        const message = messageParts.join('\n');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/525561132730?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };
    
    return (
        <div className="bg-transparent min-h-screen text-gray-800 dark:text-gray-200 pt-24 md:pt-32 pb-20">
            <div className="container mx-auto px-6">
                <button onClick={() => onNavigate('home')} className="mb-8 text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 transition-colors font-semibold">
                    &larr; {t.quotePage.backToHome}
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Form */}
                    <div className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md p-8 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-8">
                            {t.quotePage.title}
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div>
                                <label htmlFor="passenger-name" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.passengerName}</label>
                                <input type="text" id="passenger-name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500" />
                            </div>
                            <div>
                                <label htmlFor="passenger-email" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.passengerEmail}</label>
                                <input type="email" id="passenger-email" value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500" />
                            </div>
                             <div>
                                <label htmlFor="passenger-phone" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.passengerPhone}</label>
                                <input type="tel" id="passenger-phone" value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} required className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500" />
                            </div>
                             <div>
                                <label htmlFor="aircraft-type" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.aircraftType}</label>
                                <select 
                                    id="aircraft-type" 
                                    value={selectedAircraftId}
                                    onChange={handleAircraftChange}
                                    required
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                                >
                                    <option value="">{t.quotePage.selectAircraft}</option>
                                    {aircraftBrands.map((brandKey) => (
                                        // FIX: Removed incorrect type cast `as keyof typeof t.fleet.brands`.
                                        // With `brandKey` correctly typed as a string, this direct access is safe and correct.
                                        // This resolves all three reported errors.
                                        <optgroup key={brandKey} label={t.fleet.brands[brandKey]}>
                                            {groupedAircraft[brandKey].map((craft: any) => (
                                                <option key={craft.id} value={craft.id}>{craft.name}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                    <option value="other">{t.quotePage.otherAircraft}</option>
                                </select>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.flightType}</label>
                                    <div className="flex items-center space-x-6 mt-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3">
                                        <label className="flex items-center text-gray-800 dark:text-gray-200 cursor-pointer">
                                            <input type="radio" name="flight-type" value="one-way" checked={flightType === 'one-way'} onChange={() => setFlightType('one-way')} className="text-slate-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-slate-500" />
                                            <span className="ml-2 text-sm">{t.quotePage.oneWay}</span>
                                        </label>
                                        <label className="flex items-center text-gray-800 dark:text-gray-200 cursor-pointer">
                                            <input type="radio" name="flight-type" value="round-trip" checked={flightType === 'round-trip'} onChange={() => setFlightType('round-trip')} className="text-slate-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-slate-500" />
                                            <span className="ml-2 text-sm">{t.quotePage.roundTrip}</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="num-passengers" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.numPassengers}</label>
                                    <input type="number" id="num-passengers" value={numPassengers} onChange={(e) => setNumPassengers(e.target.value)} required min="1" className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                               <AirportInput 
                                    id="origin"
                                    label={t.quotePage.origin}
                                    onAirportSelect={setOrigin}
                                    placeholder={t.quotePage.selectAnAirport}
                                    required
                               />
                               <AirportInput 
                                    id="destination"
                                    label={t.quotePage.destination}
                                    onAirportSelect={setDestination}
                                    placeholder={t.quotePage.selectAnAirport}
                                    required
                               />
                            </div>
                            
                            <div>
                                <label htmlFor="date" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.date}</label>
                                <input type="date" id="date" required value={travelDate} onChange={e => setTravelDate(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:[color-scheme:dark]" />
                            </div>

                            <button type="submit" className="w-full bg-yellow-600 text-white font-bold uppercase tracking-wider py-4 px-8 rounded-sm hover:bg-yellow-700 transition-all duration-300 shadow-lg mt-4">
                                {t.quotePage.submitButton}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Image Carousel */}
                    <div className="relative min-h-[400px] lg:min-h-0 rounded-lg shadow-2xl overflow-hidden">
                        {aircraftImages.length > 0 ? (
                            <>
                                <img 
                                    src={aircraftImages[currentImageIndex]}
                                    alt={selectedAircraft?.name || 'Selected Aircraft'}
                                    className="absolute inset-0 w-full h-full object-cover" 
                                />
                                {aircraftImages.length > 1 && (
                                    <>
                                        <button type="button" onClick={prevImage} className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button type="button" onClick={nextImage} className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <img 
                                    src={images.quote.placeholder}
                                    alt={t.quotePage.selectAircraftPrompt}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8 z-10">
                                    <p className="text-white text-center text-lg font-semibold">{t.quotePage.selectAircraftPrompt}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotePage;
