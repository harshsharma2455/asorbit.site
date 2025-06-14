import React from 'react';
import type { AppPage } from '../../MainApp';
import AsorbitLogoActual from './AsorbitLogoActual';

interface SidebarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const HomeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const DocumentIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const ShapesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, collapsed, onToggleCollapse }) => {
  const menuItems = [
    {
      id: 'landing' as AppPage,
      label: 'Home',
      icon: HomeIcon,
      description: 'Dashboard and overview'
    },
    {
      id: 'paperGenerator' as AppPage,
      label: 'Paper Generator',
      icon: DocumentIcon,
      description: 'Create question papers'
    },
    {
      id: 'diagramGenerator' as AppPage,
      label: 'Diagram Generator',
      icon: ShapesIcon,
      description: 'Generate visual diagrams'
    }
  ];

  return (
    <div className={`fixed left-0 top-0 h-full bg-dark-900 border-r border-dark-700 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 overflow-hidden flex-shrink-0">
              <AsorbitLogoActual className="transform scale-[0.267] origin-top-left" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">ASORBIT</h1>
              <p className="text-dark-400 text-xs">AI Tools</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 overflow-hidden mx-auto">
            <AsorbitLogoActual className="transform scale-[0.267] origin-top-left" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors ${collapsed ? 'hidden' : ''}`}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const IconComponent = item.icon;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive 
                       ? 'bg-primary-600 text-white shadow-lg' 
                       : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  } ${collapsed ? 'justify-center' : 'space-x-3'}`}

                  title={collapsed ? item.label : undefined}
                >
                  <IconComponent className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-dark-400 group-hover:text-white'}`} />
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className={`text-xs ${isActive ? 'text-primary-100' : 'text-dark-500 group-hover:text-dark-300'}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-dark-700">
          <div className="text-xs text-dark-500 text-center">
            <p>Powered by Gemini AI</p>
            <p className="mt-1">© 2025 ASORBIT</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;