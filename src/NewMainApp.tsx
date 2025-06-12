import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import NewEducationalApp from './NewApp';
import LandingPage from './pages/LandingPage';
import DiagramGeneratorStandalonePage from './pages/DiagramGeneratorStandalonePage';
import AppHeader from './components/layout/AppHeader';
import NotificationSystem from './components/ui/NotificationSystem';
import AuthModal from './components/auth/AuthModal';
import SubscriptionModal from './components/subscription/SubscriptionModal';
import { GeminiService } from './services';
import { API_KEY_ERROR_MESSAGE } from './config';
import { LightBulbIcon } from './config';
import type { UserProfile } from './types';

export type AppPage = 'landing' | 'paperGenerator' | 'diagramGenerator' | 'doubtSolver' | 'dashboard';

const NewMainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }>>([]);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const geminiServiceInstanceRef = useRef<GeminiService | null>(null);

  // Add notification function
  const addNotification = useCallback((notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration || 5000);
  }, []);

  const getEnsuredGeminiService = useCallback((): GeminiService => {
    if (geminiServiceInstanceRef.current) {
      return geminiServiceInstanceRef.current;
    }
    try {
      const instance = new GeminiService();
      geminiServiceInstanceRef.current = instance;
      setGlobalError(null);
      addNotification({
        type: 'success',
        title: 'AI Service Ready',
        message: 'Gemini AI has been successfully initialized and is ready to assist you.',
        duration: 3000
      });
      return instance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize AI Service.";
      setGlobalError(errorMessage);
      console.error("Error initializing GeminiService in NewMainApp:", errorMessage, error);
      addNotification({
        type: 'error',
        title: 'Initialization Failed',
        message: errorMessage,
        duration: 8000
      });
      throw error; 
    }
  }, [addNotification]);

  // Initialize with loading animation
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 2000));
        getEnsuredGeminiService();
        
        // Check for existing authentication (in real app, this would check localStorage/cookies)
        const savedUser = localStorage.getItem('asorbit_user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setIsAuthenticated(true);
            setCurrentPage('dashboard');
          } catch (e) {
            localStorage.removeItem('asorbit_user');
          }
        }
      } catch (error) {
        // Error is already handled by getEnsuredGeminiService
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [getEnsuredGeminiService]);

  const handleNavigate = useCallback((page: AppPage) => {
    // Check if authentication is required for certain pages
    if (!isAuthenticated && (page === 'dashboard' || page === 'doubtSolver')) {
      setShowAuthModal(true);
      setAuthMode('signin');
      addNotification({
        type: 'info',
        title: 'Authentication Required',
        message: 'Please sign in to access this feature.',
        duration: 4000
      });
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add navigation feedback
    addNotification({
      type: 'info',
      title: 'Navigation',
      message: `Switched to ${
        page === 'paperGenerator' ? 'Paper Generator' : 
        page === 'diagramGenerator' ? 'Diagram Generator' : 
        page === 'doubtSolver' ? 'Doubt Solver' :
        page === 'dashboard' ? 'Dashboard' :
        'Home'
      }`,
      duration: 2000
    });
  }, [addNotification, isAuthenticated]);

  const handleAuthRequired = useCallback(() => {
    setShowAuthModal(true);
    setAuthMode('signup');
    addNotification({
      type: 'info',
      title: 'Upgrade Required',
      message: 'Sign up for a free account to continue using our services.',
      duration: 4000
    });
  }, [addNotification]);

  const handleAuthSuccess = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem('asorbit_user', JSON.stringify(user));
    
    addNotification({
      type: 'success',
      title: 'Welcome!',
      message: `Successfully signed in as ${user.name}`,
      duration: 4000
    });

    // Navigate to dashboard after successful auth
    setCurrentPage('dashboard');
  }, [addNotification]);

  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('asorbit_user');
    setCurrentPage('landing');
    
    addNotification({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been successfully signed out.',
      duration: 3000
    });
  }, [addNotification]);

  const handleSubscriptionUpgrade = useCallback((plan: 'premium' | 'pro') => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        subscription: plan,
        subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('asorbit_user', JSON.stringify(updatedUser));
      setShowSubscriptionModal(false);
      
      addNotification({
        type: 'success',
        title: 'Subscription Upgraded!',
        message: `Welcome to ${plan.charAt(0).toUpperCase() + plan.slice(1)}! Enjoy your enhanced features.`,
        duration: 5000
      });
    }
  }, [currentUser, addNotification]);

  const geminiService = useMemo(() => {
    try {
      return getEnsuredGeminiService();
    } catch (error) {
      return null;
    }
  }, [getEnsuredGeminiService]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-accent-600 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="loading-logo-container animate-fade-in mb-8">
            <div className="loading-logo transform scale-125">
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in-up text-shadow">
            ASORBIT
          </h1>
          <p className="text-xl text-white/90 mb-8 animate-fade-in-up loading-dots" style={{animationDelay: '0.2s'}}>
            Initializing AI Educational Platform
          </p>
          
          <div className="w-80 h-2 bg-white/20 rounded-full overflow-hidden animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="h-full progress-bar rounded-full"></div>
          </div>
          
          <p className="text-white/70 mt-6 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            Preparing your intelligent teaching assistant...
          </p>
        </div>
      </div>
    );
  }

  if (globalError) {
    const isApiKeyError = globalError.includes("API key not configured");
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden ${isApiKeyError ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-yellow-500 to-orange-600'}`}>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white opacity-10 rounded-full animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl">
          <div className="animate-wiggle mb-8">
            <LightBulbIcon className={`w-24 h-24 ${isApiKeyError ? 'text-red-200': 'text-yellow-200'} mx-auto`} />
          </div>
          
          <h1 className="text-4xl font-bold mb-6 text-white text-shadow animate-fade-in-up">
            {isApiKeyError ? 'Configuration Required' : 'Application Error'}
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 animate-scale-in">
            <p className="text-xl text-white/90 mb-4">{globalError}</p>
            <p className="text-white/70">
              {isApiKeyError 
                ? "Please ensure the API key is correctly configured and refresh the page."
                : "Please check the browser console for more details or try refreshing."
              }
            </p>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className={`interactive-button button-glow px-8 py-4 ${isApiKeyError ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white font-bold text-lg rounded-xl shadow-2xl transition-all duration-300 animate-pulse-glow`}
          >
            <span className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Application</span>
            </span>
          </button>
        </div>
      </div>
    );
  }
  
  if (!geminiService && !globalError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-yellow-400 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <LightBulbIcon className="w-20 h-20 text-yellow-100 mb-6 mx-auto animate-bounce-gentle" />
          <h1 className="text-3xl font-bold mb-4 text-white text-shadow">Service Initialization Error</h1>
          <p className="text-xl text-white/90 mb-8">Could not initialize a critical service. The application cannot proceed.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="interactive-button bg-white text-yellow-600 px-8 py-4 font-bold text-lg rounded-xl shadow-2xl hover:bg-yellow-50 transition-all duration-300"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!geminiService) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <p className="text-red-500 text-xl">Critical service not available. Cannot render page.</p>
        </div>
      );
    }
    
    const pageProps = {
      geminiService,
      setGlobalError,
      globalError,
      onNavigate: handleNavigate,
      addNotification,
      isAuthenticated,
      userSubscription: currentUser?.subscription || 'free',
      onAuthRequired: handleAuthRequired
    };

    switch (currentPage) {
      case 'dashboard':
      case 'doubtSolver':
        return <NewEducationalApp {...pageProps} />;
      case 'paperGenerator':
        return <NewEducationalApp {...pageProps} />;
      case 'diagramGenerator':
        return <DiagramGeneratorStandalonePage {...pageProps} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={handleNavigate} addNotification={addNotification} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 selection:bg-accent-500 selection:text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200/20 to-accent-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent-200/20 to-primary-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center p-4 md:p-8">
        <AppHeader 
          onNavigate={handleNavigate} 
          currentAppPage={currentPage}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onShowAuth={() => setShowAuthModal(true)}
          onShowSubscription={() => setShowSubscriptionModal(true)}
        />
        
        <main className="w-full mt-8 animate-fade-in-up">
          {renderPage()}
        </main>
        
        <footer className="w-full max-w-5xl mt-16 pt-8 border-t border-slate-300/50 text-center animate-fade-in">
          <div className="glass-effect rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-semibold gradient-text">ASORBIT</span> - Powered by Gemini AI. Diagrams rendered with JSXGraph.
            </p>
            <p className="text-xs text-slate-500">
              Empowering educators with intelligent tools for the future of learning.
            </p>
          </div>
        </footer>
      </div>
      
      {/* Notification System */}
      <NotificationSystem notifications={notifications} />
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuthSuccess={handleAuthSuccess}
        addNotification={addNotification}
      />
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentSubscription={currentUser?.subscription || 'free'}
        onUpgrade={handleSubscriptionUpgrade}
        addNotification={addNotification}
      />
    </div>
  );
};

export default NewMainApp;