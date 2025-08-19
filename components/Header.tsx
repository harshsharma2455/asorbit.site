import React, { useState, useEffect } from 'react';
import type { View } from '../App';
import { Logo } from './icons/Logo';

interface HeaderProps {
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
      // Prevent scrolling when mobile menu is open
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }, [isMenuOpen]);

    const handleNavigation = (view: View) => {
        onNavigate(view);
        setIsMenuOpen(false);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-lg shadow-[var(--shadow-custom)]' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <button onClick={() => handleNavigation('home')} className="flex items-center gap-2 text-slate-900 text-2xl font-bold transition-opacity hover:opacity-80 focus:outline-none" aria-label="Homepage">
                            <Logo className="h-8 w-auto" />
                            <span className="hidden sm:inline">asorbit</span>
                        </button>
                    </div>
                    <nav className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-2">
                            <button onClick={() => handleNavigation('features')} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</button>
                            <button onClick={() => handleNavigation('process')} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Process</button>
                        </div>
                    </nav>
                    <div className="hidden md:block">
                         <button onClick={() => handleNavigation('resources')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-[var(--shadow-custom)]">Resources</button>
                    </div>
                    <div className="md:hidden">
                         <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white/80 backdrop-blur-lg`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <button onClick={() => handleNavigation('features')} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Features</button>
                    <button onClick={() => handleNavigation('process')} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Process</button>
                </div>
                <div className="pt-4 pb-3 border-t border-slate-200">
                    <div className="px-2">
                         <button onClick={() => handleNavigation('resources')} className="w-full bg-indigo-600 text-white block px-5 py-3 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-all duration-300">Resources</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
