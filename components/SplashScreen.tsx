import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
    isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
    const [parts, setParts] = useState({ a: 'a', sorb: '', i: 'i', t: '' });
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Start animation after a short delay to ensure component is mounted
        const t0 = setTimeout(() => setIsAnimating(true), 100);

        // Sequence the reveal of the word parts
        const t1 = setTimeout(() => {
            setParts(p => ({ ...p, sorb: 'sorb' }));
        }, 600);
        
        const t2 = setTimeout(() => {
            setParts(p => ({ ...p, t: 't' }));
        }, 1200);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    // Determine the width of the sorb part for the animation
    const sorbWidth = isAnimating && parts.sorb ? '3ch' : '0ch'; // 'ch' is a unit relative to the width of the "0" character

    return (
        <div 
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg-primary)] transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <h1 className="text-7xl md:text-8xl font-bold text-slate-800 flex items-baseline font-mono tracking-tighter">
                <span>{parts.a}</span>
                <span 
                    className="inline-block overflow-hidden transition-all duration-700 ease-in-out" 
                    style={{ width: sorbWidth, transitionProperty: 'width' }}
                >
                    {parts.sorb}
                </span>
                <span>{parts.i}</span>
                <span 
                    className="transition-opacity duration-500 ease-in-out" 
                    style={{ opacity: isAnimating && parts.t ? 1 : 0 }}
                >
                    {parts.t}
                </span>
            </h1>
        </div>
    );
};

export default SplashScreen;