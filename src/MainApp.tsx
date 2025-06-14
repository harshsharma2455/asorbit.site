import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import PaperGeneratorPage from './App';
import LandingPage from './pages/LandingPage';
import DiagramGeneratorStandalonePage from './pages/DiagramGeneratorStandalonePage';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar.tsx';
import { GeminiService } from './services';
import { API_KEY_ERROR_MESSAGE } from './config';
import { LightBulbIcon } from './config';

export type AppPage = 'landing' | 'paperGenerator' | 'diagramGenerator';

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const geminiServiceInstanceRef = useRef<GeminiService | null>(null);

  const getEnsuredGeminiService = useCallback((): GeminiService => {
    if (geminiServiceInstanceRef.current) {
      return geminiServiceInstanceRef.current;
    }
    if (!process.env.API_KEY) {
      setGlobalError(API_KEY_ERROR_MESSAGE);
      console.error(API_KEY_ERROR_MESSAGE);
      throw new Error(API_KEY_ERROR_MESSAGE);
    }
    try {
      const instance = new GeminiService();
      geminiServiceInstanceRef.current = instance;
      setGlobalError(null);
      return instance;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize AI Service.";
      setGlobalError(errorMessage);
      console.error("Error initializing GeminiService in MainApp:", errorMessage, error);
      throw error; 
    }
  }, []);

  useEffect(() => {
    try {
      getEnsuredGeminiService();
    } catch (error) {
      // Error is already set by getEnsuredGeminiService
    }
  }, [getEnsuredGeminiService]);

  const handleNavigate = useCallback((page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  const geminiService = useMemo(() => {
    try {
      return getEnsuredGeminiService();
    } catch (error) {
      return null;
    }
  }, [getEnsuredGeminiService]);

  if (globalError) {
    const isApiKeyError = globalError.includes("API key not configured");
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 ${isApiKeyError ? 'bg-red-50' : 'bg-yellow-50'}`} role="alertdialog">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <LightBulbIcon className={`w-16 h-16 ${isApiKeyError ? 'text-red-500': 'text-yellow-500'} mb-6 mx-auto`} />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Error</h1>
          <p className="text-gray-600 mb-6">{globalError}</p>
          <p className="text-sm text-gray-500 mb-6">
            {isApiKeyError 
              ? "Please ensure the API key is correctly configured and refresh the page."
              : "Please check the browser console for more details or try refreshing."
            }
          </p>
          <button 
              onClick={() => window.location.reload()} 
              className={`w-full px-6 py-3 ${isApiKeyError ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white font-semibold rounded-lg transition-colors`}
          >
              Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  if (!geminiService && !globalError) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-yellow-50" role="alert">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <LightBulbIcon className="w-16 h-16 text-yellow-500 mb-6 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Initialization Error</h1>
          <p className="text-gray-600 mb-6">Could not initialize a critical service. The application cannot proceed.</p>
           <button 
              onClick={() => window.location.reload()} 
              className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
          >
              Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!geminiService) {
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Bar */}
        <TopBar 
          currentPage={currentPage}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto custom-scrollbar">
          <div className="p-6">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainApp;