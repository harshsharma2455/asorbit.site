import React, { useState, useEffect } from 'react';
import type { View } from '../App';

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
        document.body.style.overflow = 'unset';
      }
    }, [isMenuOpen]);

    const handleNavigation = (view: View) => {
        onNavigate(view);
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-lg shadow-[var(--shadow-custom)]' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex-shrink-0">
                            <button onClick={() => handleNavigation('home')} className="text-slate-900 text-2xl font-bold transition-opacity hover:opacity-80">
                               asorbit
                            </button>
                        </div>
                        <nav className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-2">
                                <button onClick={() => handleNavigation('features')} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Features</button>
                                <button onClick={() => handleNavigation('process')} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Process</button>
                                <button onClick={() => handleNavigation('projectsPage')} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">Projects</button>
                            </div>
                        </nav>
                        <div className="hidden md:block">
                             <button onClick={() => handleNavigation('contact')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-[var(--shadow-custom)]">Contact Me</button>
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
            </header>
            
            {/* Mobile Menu */}
            <div 
                id="mobile-menu"
                className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-lg pt-20 transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
                aria-hidden={!isMenuOpen}
            >
                <div className="px-4 pt-8 h-full">
                    <nav className="flex flex-col items-center justify-center text-center space-y-6">
                        <button onClick={() => handleNavigation('features')} className="text-2xl font-semibold text-slate-700 hover:text-indigo-600">Features</button>
                        <button onClick={() => handleNavigation('process')} className="text-2xl font-semibold text-slate-700 hover:text-indigo-600">Process</button>
                        <button onClick={() => handleNavigation('projectsPage')} className="text-2xl font-semibold text-slate-700 hover:text-indigo-600">Projects</button>
                        <div className="pt-8">
                             <button onClick={() => handleNavigation('contact')} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-[var(--shadow-custom)]">Contact Me</button>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Header;