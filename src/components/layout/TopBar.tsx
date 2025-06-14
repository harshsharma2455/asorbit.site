import React from 'react';
import type { AppPage } from '../../MainApp';

interface TopBarProps {
  currentPage: AppPage;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const MenuIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const BellIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const getPageTitle = (page: AppPage): string => {
  switch (page) {
    case 'landing':
      return 'Dashboard';
    case 'paperGenerator':
      return 'Paper Generator';
    case 'diagramGenerator':
      return 'Diagram Generator';
    default:
      return 'ASORBIT';
  }
};

const getPageDescription = (page: AppPage): string => {
  switch (page) {
    case 'landing':
      return 'Welcome to your AI-powered educational toolkit';
    case 'paperGenerator':
      return 'Create comprehensive question papers with AI assistance';
    case 'diagramGenerator':
      return 'Generate visual diagrams from text descriptions';
    default:
      return '';
  }
};

const TopBar: React.FC<TopBarProps> = ({ currentPage, onToggleSidebar, sidebarCollapsed }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {sidebarCollapsed && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle(currentPage)}</h1>
            <p className="text-sm text-gray-500">{getPageDescription(currentPage)}</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">AI Service Active</span>
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;