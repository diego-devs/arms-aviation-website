
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { images } from '../lib/images';

interface ServiceCardProps {
    imageSrc: string;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ imageSrc, title, description }) => (
    <div className="group relative overflow-hidden rounded-lg shadow-lg">
        <img src={imageSrc} alt={title} className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
            <h3 className="text-2xl font-bold uppercase tracking-wider">{title}</h3>
            <p className="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-xs transform-gpu translate-y-4 group-hover:translate-y-0">{description}</p>
        </div>
    </div>
);


const Services: React.FC = () => {
    const { t } = useLanguage();
    
    const servicesData = t.services.cards.map((service: any) => ({
        ...service,
        imageSrc: images.services[service.id as keyof typeof images.services],
    }));

    return (
        <section id="services" className="py-20 bg-gray-50/80 dark:bg-black/80 backdrop-blur-md">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-black text-center uppercase tracking-widest text-gray-900 dark:text-gray-100">{t.services.title}</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map((service: any) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
