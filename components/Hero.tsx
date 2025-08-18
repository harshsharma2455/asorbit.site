import React from 'react';
import type { View } from '../App';

interface HeroProps {
    onNavigate: (view: View) => void;
    scrollY: number;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, scrollY }) => {
    // Generate particles once to avoid re-calculating on every scroll
    const particles = React.useMemo(() => 
        Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
        })), []);

    const contentOpacity = Math.max(0, 1 - scrollY / 500);
    const contentScale = Math.max(0.8, 1 - scrollY / 3000);

    return (
        <section id="home" className="sticky top-0 h-screen flex justify-center text-center overflow-hidden pt-40 sm:pt-0 sm:items-center">
            {/* Layer 1: Existing Grid Background */}
            <div className="absolute inset-0 bg-grid-slate-200/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_80%)]"></div>

            {/* Layer 2: Deep Parallax Shapes */}
            <div 
                className="absolute inset-0 transition-transform duration-100 ease-out"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            >
                <div className="absolute top-[20%] left-[5%] w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
                <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Layer 3: Foreground Particles */}
            <div 
                className="absolute inset-0 transition-transform duration-100 ease-out"
                style={{ transform: `translateY(-${scrollY * 0.4}px)` }}
            >
                {particles.map(p => (
                    <div 
                        key={p.id}
                        className="absolute w-1 h-1 bg-slate-300/80 rounded-full animate-twinkle"
                        style={{ top: p.top, left: p.left, animationDelay: p.animationDelay }}
                    />
                ))}
            </div>
            
            {/* Main Content */}
            <div 
                className="relative z-10 px-4 transition-transform duration-100 ease-out"
                style={{ 
                    transform: `translateY(${scrollY * 0.25}px) scale(${contentScale})`,
                    opacity: contentOpacity
                }}
            >
                <h1 
                    className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight drop-shadow-sm"
                >
                    Automate Your Business with <br />
                    <span 
                        className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400"
                    >
                        asorbit
                    </span>
                </h1>
                <p 
                    className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-600"
                >
                    Asorbit delivers custom AI automations that streamline your operations, boost efficiency, and unlock unprecedented growth.
                </p>
                <div 
                    className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
                >
                    <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-[var(--shadow-custom-lg)]">
                        Get Started
                    </button>
                    <button onClick={() => onNavigate('features')} className="w-full sm:w-auto bg-white text-slate-800 px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-[var(--shadow-custom-lg)] border border-slate-200">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;