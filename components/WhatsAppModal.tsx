import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArmsAviationLogo } from './icons/Logo';

interface WhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string) => void;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, onSend }) => {
    const [message, setMessage] = useState('');
    const { t } = useLanguage();
    const [isClosing, setIsClosing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 300); // Delay focus until after animation
        }
    }, [isOpen]);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${scrollHeight}px`;
        }
    }, [message]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setMessage('');
            setIsClosing(false); // Fix: Reset closing state after animation
        }, 300); // Match animation duration
    };

    const handleSendClick = () => {
        if (message.trim()) {
            onSend(message);
            handleClose();
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);
    
    if (!isOpen && !isClosing) {
        return null;
    }

    const modalClasses = (isOpen && !isClosing) ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0';
    const backdropClasses = (isOpen && !isClosing) ? 'opacity-100' : 'opacity-0';

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-end justify-end p-0 sm:p-6 transition-opacity duration-300 ${backdropClasses}`}
            aria-modal="true"
            role="dialog"
        >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose}></div>

            <div className={`relative z-10 w-full max-w-sm transform transition-all duration-300 ease-out ${modalClasses}`}>
                <div className="bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-2xl flex flex-col h-[60vh] sm:h-[500px] max-h-[90vh] overflow-hidden">
                    <header className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <div className="flex items-center space-x-3">
                             <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center p-1">
                                <ArmsAviationLogo className="h-8 object-contain" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 dark:text-gray-100">ARMS AVIATION</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t.whatsapp.modal.title}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Close chat">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </header>
                    
                    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700/50 overflow-y-auto">
                        <div className="bg-amber-100/50 dark:bg-amber-500/10 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                           {t.whatsapp.modal.greeting}
                        </div>
                    </div>
                    
                    <footer className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center space-x-3">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t.whatsapp.modal.placeholder}
                                rows={1}
                                style={{maxHeight: '100px'}}
                                className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-800 dark:text-gray-200"
                            />
                            <button 
                                onClick={handleSendClick}
                                className="bg-amber-500 text-white rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center hover:bg-amber-600 transition-colors disabled:bg-amber-500/50 disabled:cursor-not-allowed"
                                disabled={!message.trim()}
                                aria-label={t.whatsapp.modal.send}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppModal;