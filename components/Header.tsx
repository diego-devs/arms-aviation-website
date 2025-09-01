
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { ArmsAviationLogo } from './icons/Logo';
import { Page } from '../App';

interface HeaderProps {
    onNavigate: (page: Page | string, payload?: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navLinks = [
        { name: t.nav.privateFlights, href: '#services', type: 'anchor' },
        { name: t.nav.ourFleet, href: '#fleet', type: 'anchor' },
        { name: t.nav.whyUs, href: '#why-us', type: 'anchor' },
        { name: t.nav.about, href: 'about', type: 'page' },
        { name: t.nav.requestQuote, href: 'quote', type: 'page' },
    ];

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, type: string) => {
        e.preventDefault();
        setMenuOpen(false);
        if (type === 'page') {
            onNavigate(href as Page);
        } else {
            onNavigate(href);
        }
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="relative h-8 w-28"> {/* Placeholder for logo to maintain layout */}
                        <button 
                            onClick={() => onNavigate('home')} 
                            aria-label="Go to homepage" 
                            className={`absolute left-0 z-20 transition-all duration-300 transform ${scrolled ? 'top-0 w-36 h-10' : '-top-4 w-64 h-20'}`}
                        >
                            <ArmsAviationLogo className="w-full h-full" />
                        </button>
                    </div>

                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                             <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href, link.type)} className="text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-colors cursor-pointer">
                                {link.name}
                            </a>
                        ))}
                        <LanguageToggle />
                        <ThemeToggle />
                    </nav>
                    <div className="lg:hidden flex items-center space-x-2">
                        <LanguageToggle />
                        <ThemeToggle />
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-800 dark:text-gray-200 focus:outline-none" aria-label="Open menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white/95 dark:bg-gray-800/95`}>
                <nav className="flex flex-col items-center space-y-4 py-4">
                     {navLinks.map((link) => (
                         <a key={link.name} href={link.href} onClick={(e) => handleNavClick(e, link.href, link.type)} className="text-sm font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-colors cursor-pointer">
                            {link.name}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;
