
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { images } from '../lib/images';

interface QuotePageProps {
    onNavigate: (page: 'home') => void;
    preSelectedAircraftId?: string;
}

const mexicanAirports = [
    { code: 'TLC', name: 'Toluca (Licenciado Adolfo López Mateos)' },
    { code: 'GDL', name: 'Guadalajara (Miguel Hidalgo y Costilla)' },
    { code: 'MTY', name: 'Monterrey (General Mariano Escobedo)' },
    { code: 'MEX', name: 'Mexico City (Benito Juárez)' },
    { code: 'CUN', name: 'Cancún' },
    { code: 'TIJ', name: 'Tijuana (General Abelardo L. Rodríguez)' },
    { code: 'SJD', name: 'Los Cabos' },
    { code: 'PVR', name: 'Puerto Vallarta (Licenciado Gustavo Díaz Ordaz)' },
];

const QuotePage: React.FC<QuotePageProps> = ({ onNavigate, preSelectedAircraftId }) => {
    const { t } = useLanguage();
    const allAircraft = t.fleet.data.map((craft: any) => ({
        ...craft,
        images: images.fleet[craft.id as keyof typeof images.fleet] || []
    }));

    const [selectedAircraftId, setSelectedAircraftId] = useState<string>(preSelectedAircraftId || '');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [numPassengers, setNumPassengers] = useState('1');
    const [flightType, setFlightType] = useState<'one-way' | 'round-trip'>('one-way');
    const [passengerName, setPassengerName] = useState('');
    const [passengerEmail, setPassengerEmail] = useState('');
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
        
        const selectedAircraftInfo = allAircraft.find((a: any) => a.id === selectedAircraftId);
        if (!selectedAircraftInfo) {
            alert(t.quotePage.selectAircraft);
            return;
        }

        const originAirport = mexicanAirports.find(a => a.code === origin);
        const destinationAirport = mexicanAirports.find(a => a.code === destination);

        const messageParts = [
            `*${t.quotePage.whatsappMessage.title}*`,
            '',
            `*${t.quotePage.whatsappMessage.passengerName}:* ${passengerName}`,
            `*${t.quotePage.whatsappMessage.passengerEmail}:* ${passengerEmail}`,
            `*${t.quotePage.whatsappMessage.aircraft}:* ${selectedAircraftInfo.name}`,
            `*${t.quotePage.whatsappMessage.flightType}:* ${flightType === 'one-way' ? t.quotePage.oneWay : t.quotePage.roundTrip}`,
            `*${t.quotePage.whatsappMessage.numPassengers}:* ${numPassengers}`,
            `*${t.quotePage.whatsappMessage.origin}:* ${originAirport?.name} (${origin})`,
            `*${t.quotePage.whatsappMessage.destination}:* ${destinationAirport?.name} (${destination})`,
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
                <button onClick={() => onNavigate('home')} className="mb-8 text-amber-500 hover:text-amber-600 transition-colors font-semibold">
                    &larr; {t.quotePage.backToHome}
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Form */}
                    <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-8">
                            {t.quotePage.title}
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div>
                                <label htmlFor="passenger-name" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.passengerName}</label>
                                <input type="text" id="passenger-name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} required className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label htmlFor="passenger-email" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.passengerEmail}</label>
                                <input type="email" id="passenger-email" value={passengerEmail} onChange={(e) => setPassengerEmail(e.target.value)} required className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>
                             <div>
                                <label htmlFor="aircraft-type" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.aircraftType}</label>
                                <select 
                                    id="aircraft-type" 
                                    value={selectedAircraftId}
                                    onChange={handleAircraftChange}
                                    required
                                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="">{t.quotePage.selectAircraft}</option>
                                    {allAircraft.map((craft: any) => (
                                        <option key={craft.id} value={craft.id}>{craft.name}</option>
                                    ))}
                                </select>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.flightType}</label>
                                    <div className="flex items-center space-x-6 mt-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3">
                                        <label className="flex items-center text-gray-800 dark:text-gray-200 cursor-pointer">
                                            <input type="radio" name="flight-type" value="one-way" checked={flightType === 'one-way'} onChange={() => setFlightType('one-way')} className="text-amber-500 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-amber-500" />
                                            <span className="ml-2 text-sm">{t.quotePage.oneWay}</span>
                                        </label>
                                        <label className="flex items-center text-gray-800 dark:text-gray-200 cursor-pointer">
                                            <input type="radio" name="flight-type" value="round-trip" checked={flightType === 'round-trip'} onChange={() => setFlightType('round-trip')} className="text-amber-500 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-amber-500" />
                                            <span className="ml-2 text-sm">{t.quotePage.roundTrip}</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="num-passengers" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.numPassengers}</label>
                                    <input type="number" id="num-passengers" value={numPassengers} onChange={(e) => setNumPassengers(e.target.value)} required min="1" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="origin" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.origin}</label>
                                    <select id="origin" required value={origin} onChange={e => setOrigin(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        <option value="">{t.quotePage.selectAirport}</option>
                                        {mexicanAirports.map(airport => (
                                            <option key={airport.code} value={airport.code}>{airport.name} - {airport.code}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="destination" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.destination}</label>
                                    <select id="destination" required value={destination} onChange={e => setDestination(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        <option value="">{t.quotePage.selectAirport}</option>
                                        {mexicanAirports.map(airport => (
                                            <option key={airport.code} value={airport.code}>{airport.name} - {airport.code}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="date" className="block text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">{t.quotePage.date}</label>
                                <input type="date" id="date" required value={travelDate} onChange={e => setTravelDate(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:[color-scheme:dark]" />
                            </div>

                            <button type="submit" className="w-full bg-amber-500 text-white font-bold uppercase tracking-wider py-4 px-8 rounded-sm hover:bg-amber-600 transition-all duration-300 shadow-lg mt-4">
                                {t.quotePage.submitButton}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Image Carousel */}
                    <div className="flex items-center justify-center min-h-[400px] lg:min-h-full">
                        <div className="relative w-full h-full max-h-[600px] aspect-w-4 aspect-h-3">
                        {aircraftImages.length > 0 ? (
                            <>
                                <img 
                                    src={aircraftImages[currentImageIndex]}
                                    alt={selectedAircraft?.name || 'Selected Aircraft'}
                                    className="rounded-lg shadow-2xl object-cover w-full h-full" 
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
                             <div className="w-full h-full bg-gray-100/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg flex items-center justify-center p-8">
                                <p className="text-gray-500 dark:text-gray-400 text-center">{t.quotePage.selectAircraftPrompt}</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotePage;
