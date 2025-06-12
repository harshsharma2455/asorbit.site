import React, { useState } from 'react';
import type { AppPage } from '../../MainApp';
import AsorbitLogoActual from './AsorbitLogoActual';

interface AppHeaderProps {
  onNavigate: (page: AppPage) => void;
  currentAppPage: AppPage;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onNavigate, currentAppPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: '🏠' },
    { id: 'paperGenerator', label: 'Paper Generator', icon: '📝' },
    { id: 'diagramGenerator', label: 'Diagram Generator', icon: '📊' }
  ];

  const getNavClasses = (pageId: string) => {
    const baseClasses = "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105";
    const isActive = currentAppPage === pageId;
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg`;
    }
    return `${baseClasses} text-slate-700 hover:bg-white/80 hover:shadow-md backdrop-blur-sm`;
  };

  return (
    <header className="w-full max-w-6xl py-6 relative z-20">
      <div className="glass-effect rounded-2xl px-6 py-4 backdrop-blur-md border border-white/20 shadow-xl">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('landing')} 
            className="group flex items-center space-x-3 text-2xl font-bold text-primary-700 hover:text-primary-600 transition-all duration-300 transform hover:scale-105" 
            aria-label="ASORBIT Home"
          >
            <div className="w-[50px] h-[50px] overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:rotate-12">
              <AsorbitLogoActual className="transform scale-[0.416666] origin-top-left" />
            </div>
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              ASORBIT
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as AppPage)}
                className={getNavClasses(item.id)}
                aria-current={currentAppPage === item.id ? "page" : undefined}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {currentAppPage === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl opacity-20 animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            aria-label="Toggle mobile menu"
          >
            <svg 
              className={`w-6 h-6 text-slate-700 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20 animate-fade-in-down">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as AppPage);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${getNavClasses(item.id)} w-full text-left justify-start`}
                  aria-current={currentAppPage === item.id ? "page" : undefined}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default AppHeader;