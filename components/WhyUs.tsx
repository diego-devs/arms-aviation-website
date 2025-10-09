
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ShieldIcon, DiamondIcon, LockIcon, ClockIcon } from './icons/FeatureIcons';

const iconMap: { [key: string]: React.FC } = {
    'Uncompromising Safety': ShieldIcon,
    'Seguridad Inquebrantable': ShieldIcon,
    'Absolute Luxury & Comfort': DiamondIcon,
    'Lujo y Confort Absoluto': DiamondIcon,
    'Total Privacy': LockIcon,
    'Privacidad Total': LockIcon,
    '24/7 Availability': ClockIcon,
    'Disponibilidad 24/7': ClockIcon,
};


const WhyUs: React.FC = () => {
    const { t } = useLanguage();
    const features = t.whyUs.features;

    return (
        <section id="why-us" className="py-20 bg-white/80 dark:bg-black/80 backdrop-blur-md">
            <div className="container mx-auto px-6 text-gray-800 dark:text-gray-200">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest">
                        {t.whyUs.title}
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                        {t.whyUs.subtitle}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {features.map((feature: any) => {
                        const Icon = iconMap[feature.name];
                        return (
                            <div key={feature.name} className="bg-gray-100/70 dark:bg-gray-900/70 p-6 text-center rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-200/70 dark:hover:bg-gray-700/60 transition-all duration-300">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-slate-500/10 dark:bg-slate-300/10 p-4 rounded-full">
                                        {Icon && <Icon />}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{feature.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
