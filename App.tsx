
import React, { useState, useCallback, useEffect } from 'react';
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
import GallerySection from './components/GallerySection';

export type Page = 'home' | 'quote' | 'about' | 'terms' | 'privacy';

const lightBgUrls = [
    "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1548&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1619651565842-6db8f969fd39?q=80&w=1740&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1684838200815-36eef38f353c?q=80&w=1835&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];
const darkBgUrls = [
    "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=1808&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566212774954-4c48b5052304?q=80&w=1752&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1566212774847-025968e5bf56?q=80&w=1752&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

const ThemedBackground: React.FC = () => {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);

    const imageUrls = theme === 'light' ? lightBgUrls : darkBgUrls;
    
    useEffect(() => {
        // Reset index when theme changes to start the new gallery from the beginning
        setCurrentIndex(0);
    }, [theme]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
        }, 7000); // Change image every 7 seconds

        return () => clearTimeout(timer);
    }, [currentIndex, imageUrls.length]);

    return (
        <div className="fixed inset-0 z-[-1] bg-black">
            {imageUrls.map((url, index) => (
                <div
                    key={url}
                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url('${url}')`,
                        opacity: index === currentIndex ? 1 : 0,
                        animation: index === currentIndex ? 'kenburns-zoom 20s ease-out forwards' : 'none',
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-white/20 dark:bg-black/60" />
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
                        <GallerySection />
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
