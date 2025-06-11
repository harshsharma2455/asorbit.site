import React from 'react';
import type { AppPage } from '../../MainApp'; // Adjust path if MainApp moves
import AsorbitLogoActual from './AsorbitLogoActual'; // Import the new logo

interface AppHeaderProps {
  onNavigate: (page: AppPage) => void;
  currentAppPage: AppPage;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onNavigate, currentAppPage }) => {
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-primary-600 text-white";
  const inactiveLinkClasses = "text-slate-700 hover:bg-primary-100 hover:text-primary-700";

  return (
    <header className="w-full max-w-5xl py-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-2 sm:px-0">
        <button onClick={() => onNavigate('landing')} className="flex items-center space-x-2 text-2xl font-bold text-primary-700 hover:text-primary-600 transition-colors" aria-label="ASORBIT Home">
          <div className="w-[40px] h-[40px] overflow-hidden flex-shrink-0">
            <AsorbitLogoActual className="transform scale-[0.333333] origin-top-left" />
          </div>
          <span>ASORBIT</span>
        </button>
        <nav className="mt-3 sm:mt-0">
          <ul className="flex space-x-2 sm:space-x-3">
            <li>
              <button 
                onClick={() => onNavigate('landing')}
                className={`${navLinkClasses} ${currentAppPage === 'landing' ? activeLinkClasses : inactiveLinkClasses}`}
                aria-current={currentAppPage === 'landing' ? "page" : undefined}
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('paperGenerator')}
                className={`${navLinkClasses} ${currentAppPage === 'paperGenerator' ? activeLinkClasses : inactiveLinkClasses}`}
                aria-current={currentAppPage === 'paperGenerator' ? "page" : undefined}
              >
                Paper Generator
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('diagramGenerator')}
                className={`${navLinkClasses} ${currentAppPage === 'diagramGenerator' ? activeLinkClasses : inactiveLinkClasses}`}
                aria-current={currentAppPage === 'diagramGenerator' ? "page" : undefined}
              >
                Diagram Generator
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
