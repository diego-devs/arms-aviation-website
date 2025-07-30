
import React from 'react';

export const ArmsAviationLogo: React.FC<{ className?: string }> = ({ className = 'text-2xl' }) => (
    <div className={`font-black uppercase text-amber-500 ${className} flex items-center`}>
        <span className="tracking-wider">ARMS AVI</span>
        <span className="relative" style={{fontFamily: "'Montserrat', sans-serif"}}>
            A
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-8 absolute -top-1 left-1/2 -translate-x-1/2 text-amber-500" fill="currentColor" viewBox="0 0 32 32">
                <path d="M30.334 13.965h-5.066l-6.85-8.913A.666.666 0 0017.834 5h-3.668a.666.666 0 00-.584.948l-6.85 8.913H1.666a.666.666 0 000 1.333h5.066l3.417 4.452v6.583a.667.667 0 001.077.575l3.118-1.782 3.118 1.782a.667.667 0 001.077-.575v-6.583l3.417-4.452h5.066a.666.666 0 100-1.333z"/>
            </svg>
        </span>
        <span className="tracking-wider">TION</span>
    </div>
);
