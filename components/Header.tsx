import React from 'react';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'HOME', href: '#home' },
  { name: 'TOOLS', href: '#tools' },
  { name: 'ABOUT', href: '#about' },
];

export const Header: React.FC = () => {
  const [activeItem, setActiveItem] = React.useState<string>('HOME');

  return (
    <header className="py-2 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="mx-auto flex items-center justify-between max-w-6xl w-full">
        <a href="#home" className="flex items-center space-x-2" onClick={() => setActiveItem('HOME')}>
          <img 
            src="components/icons/logo_icon.png" 
            alt="Asorbit Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12"
          />
          {/* Optional: Text logo next to icon */}
          {/* <span className="text-2xl font-bold text-white">ASORBIT</span> */}
        </a>
        <nav className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`
                px-3 py-1 sm:px-3 md:px-4 
                rounded-full text-xs sm:text-sm font-medium transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50
                ${
                  activeItem === item.name
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};