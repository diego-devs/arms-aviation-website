
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Fleet from './components/Fleet';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import QuotePage from './components/QuotePage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';

export type Page = 'home' | 'quote' | 'about' | 'terms' | 'privacy';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [quoteAircraftId, setQuoteAircraftId] = useState<string | undefined>(undefined);

    const navigate = useCallback((target: Page | string, payload?: any) => {
        if (target === 'home' || target === 'quote' || target === 'about' || target === 'terms' || target === 'privacy') {
            setPage(target as Page);
            if (target === 'quote' && typeof payload === 'string') {
                setQuoteAircraftId(payload);
            } else {
                setQuoteAircraftId(undefined);
            }
            window.scrollTo(0, 0);
        } else if (typeof target === 'string' && target.startsWith('#')) {
            setPage('home');
            // Ensure DOM is updated before trying to scroll
            setTimeout(() => {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 0);
        }
    }, []);

    return (
        <ThemeProvider>
            <LanguageProvider>
                <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
                    <Header onNavigate={navigate} />
                    <main>
                        {page === 'home' && (
                            <>
                                <Hero onNavigate={navigate} />
                                <Services />
                                <WhyUs />
                                <Fleet onNavigate={navigate}/>
                                <CtaSection onNavigate={navigate} />
                            </>
                        )}
                        {page === 'quote' && <QuotePage onNavigate={navigate} preSelectedAircraftId={quoteAircraftId} />}
                        {page === 'about' && <AboutPage onNavigate={navigate} />}
                        {page === 'terms' && <TermsPage onNavigate={navigate} />}
                        {page === 'privacy' && <PrivacyPage onNavigate={navigate} />}
                    </main>
                    <Footer onNavigate={navigate} />
                    <WhatsAppButton />
                </div>
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
