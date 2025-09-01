import React from 'react';
import { logoUrl } from '../../lib/images';

export const ArmsAviationLogo: React.FC<{ className?: string }> = ({ className = 'h-20' }) => (
    <img src={logoUrl} alt="ARMS AVIATION Logo" className={`${className} object-contain invert dark:invert-0`} />
);