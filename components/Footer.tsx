import React from 'react';
import { FacebookIcon, InstagramIcon, TwitterIcon } from './icons/SocialIcons';
import { useLanguage } from '../contexts/LanguageContext';
import { ArmsAviationLogo } from './icons/Logo';
import { Page } from '../App';

interface FooterProps {
    onNavigate: (target: Page | string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const { t } = useLanguage();

    const handleNavClick = (e: React.MouseEvent, target: string, type: 'page' | 'anchor') => {
        e.preventDefault();
        onNavigate(type === 'page' ? target as Page : target);
    }

    return (
        <footer className="bg-gray-50/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Logo & About */}
                    <div className="md:col-span-1">
                        <ArmsAviationLogo className="h-20" />
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                           {t.footer.about}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-gray-800 dark:text-gray-100">{t.footer.quickLinks}</h4>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#services" onClick={(e) => handleNavClick(e, '#services', 'anchor')} className="text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm cursor-pointer">{t.footer.services}</a></li>
                            <li><a href="#fleet" onClick={(e) => handleNavClick(e, '#fleet', 'anchor')} className="text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm cursor-pointer">{t.footer.ourFleet}</a></li>
                            <li><a href="#why-us" onClick={(e) => handleNavClick(e, '#why-us', 'anchor')} className="text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm cursor-pointer">{t.footer.whyUs}</a></li>
                            <li><a href="about" onClick={(e) => handleNavClick(e, 'about', 'page')} className="text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm cursor-pointer">{t.footer.aboutUs}</a></li>
                            <li><a href="quote" onClick={(e) => handleNavClick(e, 'quote', 'page')} className="text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm cursor-pointer">{t.footer.requestQuote}</a></li>
                            <li><a href="terms" onClick={(e) => handleNavClick(e, 'terms', 'page')} className="text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm cursor-pointer">{t.footer.terms}</a></li>
                            <li><a href="privacy" onClick={(e) => handleNavClick(e, 'privacy', 'page')} className="text-gray-600 dark:text-gray-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm cursor-pointer">{t.footer.privacy}</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-gray-800 dark:text-gray-100">{t.footer.contactInfo}</h4>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="text-gray-600 dark:text-gray-400">{t.footer.ceo}</li>
                            <li className="text-gray-600 dark:text-gray-400">{t.footer.location}</li>
                            <li className="text-gray-600 dark:text-gray-400">{t.footer.email}: <a href="mailto:armsaviation1@gmail.com" className="hover:text-slate-600 dark:hover:text-slate-300">armsaviation1@gmail.com</a></li>
                            <li className="text-gray-600 dark:text-gray-400">{t.footer.phone}: <a href="tel:+525561132730" className="hover:text-slate-600 dark:hover:text-slate-300">+52 55 6113 2730</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Social Media */}
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-gray-800 dark:text-gray-100">{t.footer.followUs}</h4>
                        <div className="mt-4 flex space-x-4">
                            {/* Disabled Facebook icon for now */}
                            {/* <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                <FacebookIcon />
                            </a> */}
                            
                            <a 
                                href="https://www.instagram.com/armsaviation/" 
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram" 
                                className="text-gray-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <InstagramIcon />
                            </a>

                            {/* Disabled X/Twitter icon for now */}
                            {/* <a href="#" aria-label="X" className="text-gray-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                <TwitterIcon />
                            </a> */}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} ARMS AVIATION. {t.footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
