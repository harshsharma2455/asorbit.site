
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import PaperGeneratorPage from './App'; // Renamed App.tsx
import LandingPage from './pages/LandingPage';
import DiagramGeneratorStandalonePage from './pages/DiagramGeneratorStandalonePage';
import AppHeader from './components/layout/AppHeader';
import { GeminiService } from './services';
import { API_KEY_ERROR_MESSAGE } from './config';
import { LightBulbIcon } from './config';

export type AppPage = 'landing' | 'paperGenerator' | 'diagramGenerator';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  const geminiServiceInstanceRef = useRef<GeminiService | null>(null);

  const getEnsuredGeminiService = useCallback((): GeminiService => {
    if (geminiServiceInstanceRef.current) {
      return geminiServiceInstanceRef.current;
    }
    if (!process.env.API_KEY) {
      setGlobalError(API_KEY_ERROR_MESSAGE);
      console.error(API_KEY_ERROR_MESSAGE);
      throw new Error(API_KEY_ERROR_MESSAGE); // This will be caught by the component using it
    }
    try {
      const instance = new GeminiService();
      geminiServiceInstanceRef.current = instance;
      setGlobalError(null); // Clear any previous API key error
      return instance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize AI Service.";
      setGlobalError(errorMessage); // Set global error for display
      console.error("Error initializing GeminiService in MainApp:", errorMessage, error);
      throw error; 
    }
  }, []);

  // Attempt to initialize service on mount to catch API key errors early
  useEffect(() => {
    try {
      getEnsuredGeminiService();
    } catch (error) {
      // Error is already set by getEnsuredGeminiService
    }
  }, [getEnsuredGeminiService]);

  const handleNavigate = useCallback((page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  }, []);

  // Memoize the service instance to avoid re-creating it on every render
  const geminiService = useMemo(() => {
    try {
      return getEnsuredGeminiService();
    } catch (error) {
      return null; // Return null if service couldn't be initialized
    }
  }, [getEnsuredGeminiService]);


  if (globalError) {
    const isApiKeyError = globalError.includes("API key not configured");
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${isApiKeyError ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`} role="alertdialog" aria-labelledby="error-title" aria-describedby="error-description">
        <LightBulbIcon className={`w-16 h-16 ${isApiKeyError ? 'text-red-400': 'text-yellow-400'} mb-4`} />
        <h1 id="error-title" className="text-3xl font-bold mb-4">Application Error</h1>
        <p id="error-description" className="text-lg text-center">{globalError}</p>
        <p className="mt-2 text-sm text-center">
          {isApiKeyError 
            ? "Please ensure the API key (process.env.API_KEY) is correctly configured and refresh the page."
            : "Please check the browser console for more details or try refreshing."
          }
        </p>
        <button 
            onClick={() => window.location.reload()} 
            className={`mt-6 px-4 py-2 ${isApiKeyError ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold rounded-md transition-colors`}
        >
            Refresh Page
        </button>
      </div>
    );
  }
  
  // If geminiService is null after attempting initialization (and no globalError is set, which means it wasn't an API key issue initially)
  // This might indicate a non-API key related init failure.
  if (!geminiService && !globalError) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-yellow-50 text-yellow-700" role="alert">
        <LightBulbIcon className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Initialization Error</h1>
        <p className="text-lg">Could not initialize a critical service. The application cannot proceed.</p>
         <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors"
        >
            Refresh Page
        </button>
      </div>
    );
  }


  const renderPage = () => {
    if (!geminiService) { // Should be caught by above checks, but as a fallback
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-500">Critical service not available. Cannot render page.</p>
            </div>
        );
    }
    switch (currentPage) {
      case 'paperGenerator':
        return <PaperGeneratorPage geminiService={geminiService} setGlobalError={setGlobalError} globalError={globalError} onNavigate={handleNavigate} />;
      case 'diagramGenerator':
        return <DiagramGeneratorStandalonePage geminiService={geminiService} setGlobalError={setGlobalError} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 selection:bg-accent-500 selection:text-white">
      <AppHeader onNavigate={handleNavigate} currentAppPage={currentPage} />
      <main className="w-full mt-8"> {/* Add margin-top to account for fixed header */}
        {renderPage()}
      </main>
       <footer className="w-full max-w-5xl mt-12 pt-8 border-t border-slate-300 text-center">
        <p className="text-sm text-slate-500">
          ASORBIT - Powered by Gemini AI. Diagrams rendered with JSXGraph.
        </p>
      </footer>
    </div>
  );
};

export default MainApp;
