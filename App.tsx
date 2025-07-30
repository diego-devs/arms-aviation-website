
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
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import QuotePage from './components/QuotePage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';

export type Page = 'home' | 'quote' | 'about' | 'terms' | 'privacy';

const lightBgUrl = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const darkBgUrl = "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=1808&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const ThemedBackground: React.FC = () => {
    const { theme } = useTheme();
    return (
        <div className="fixed inset-0 z-[-1]">
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-1000"
                style={{ backgroundImage: `url('${lightBgUrl}')`, opacity: theme === 'light' ? 1 : 0 }}
            />
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-1000"
                style={{ backgroundImage: `url('${darkBgUrl}')`, opacity: theme === 'dark' ? 1 : 0 }}
            />
            <div className="absolute inset-0 bg-white/20 dark:bg-black/50" />
        </div>
    );
}

const AppContent: React.FC = () => {
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
        <div className="relative bg-transparent text-gray-800 dark:text-gray-200 min-h-screen">
            <ThemedBackground />
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
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AppContent />
            </LanguageProvider>
        </ThemeProvider>
    );
};

export default App;
