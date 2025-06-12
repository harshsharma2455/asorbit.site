import React, { useState } from 'react';
import type { AppPage } from '../../NewMainApp';
import type { UserProfile } from '../../types';
import AsorbitLogoActual from './AsorbitLogoActual';

interface AppHeaderProps {
  onNavigate: (page: AppPage) => void;
  currentAppPage: AppPage;
  isAuthenticated?: boolean;
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
  onShowAuth?: () => void;
  onShowSubscription?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onNavigate, 
  currentAppPage, 
  isAuthenticated = false,
  currentUser,
  onSignOut,
  onShowAuth,
  onShowSubscription
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', authRequired: true },
    { id: 'paperGenerator', label: 'Paper Generator', icon: '📝' },
    { id: 'diagramGenerator', label: 'Diagram Generator', icon: '📊' },
    { id: 'doubtSolver', label: 'Doubt Solver', icon: '❓', authRequired: true }
  ];

  const getNavClasses = (pageId: string) => {
    const baseClasses = "relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105";
    const isActive = currentAppPage === pageId;
    
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg`;
    }
    return `${baseClasses} text-slate-700 hover:bg-white/80 hover:shadow-md backdrop-blur-sm`;
  };

  const getSubscriptionBadgeColor = (subscription: string) => {
    switch (subscription) {
      case 'pro':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'premium':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white';
      default:
        return 'bg-slate-200 text-slate-700';
    }
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
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              
              return (
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
              );
            })}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-700">{currentUser.name}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${getSubscriptionBadgeColor(currentUser.subscription)}`}>
                      {currentUser.subscription.charAt(0).toUpperCase() + currentUser.subscription.slice(1)}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <button
                      onClick={() => {
                        onShowSubscription?.();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinej="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <span>Upgrade Plan</span>
                    </button>
                    <div className="border-t border-slate-200 my-1"></div>
                    <button
                      onClick={() => {
                        onSignOut?.();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onShowAuth}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>

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
              {navItems.map((item) => {
                if (item.authRequired && !isAuthenticated) return null;
                
                return (
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
                );
              })}
              
              {/* Mobile Auth/User Section */}
              <div className="pt-4 border-t border-white/20">
                {isAuthenticated && currentUser ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700">{currentUser.name}</div>
                        <div className={`text-xs px-2 py-0.5 rounded-full ${getSubscriptionBadgeColor(currentUser.subscription)}`}>
                          {currentUser.subscription.charAt(0).toUpperCase() + currentUser.subscription.slice(1)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onShowSubscription?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full p-3 text-left text-sm text-slate-700 hover:bg-white/50 rounded-xl transition-colors"
                    >
                      Upgrade Plan
                    </button>
                    <button
                      onClick={() => {
                        onSignOut?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full p-3 text-left text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onShowAuth?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full p-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default AppHeader;