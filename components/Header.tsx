// Header.tsx
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './icons/Logo';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();          // for active-link styling
  const isHome = pathname === '/';

  /* ── show shadow / blur after scrolling ─────────────────── */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── lock body scroll when mobile menu open ─────────────── */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
  }, [isMenuOpen]);

  /* ── helper for link classes ─────────────────────────────── */
  const linkClass = (active: boolean) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors
     hover:bg-slate-100 ${
       active ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
     }`;

  /* ── MAIN RETURN ─────────────────────────────────────────── */
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-lg shadow-[var(--shadow-custom)]' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 text-slate-900 text-2xl font-bold transition-opacity hover:opacity-80"
            aria-label="Homepage"
          >
            <Logo className="h-8 w-auto" />
            <span className="hidden sm:inline">asorbit</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link
                to="/#features"
                className={linkClass(isHome && hash === '#features')}
              >
                Features
              </Link>
              <Link
                to="/#process"
                className={linkClass(isHome && hash === '#process')}
              >
                Process
              </Link>
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              to="/resources"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-[var(--shadow-custom)]"
            >
              Resources
            </Link>
          </div>

          {/* Mobile burger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen((o) => !o)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                /* X icon */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Burger icon */
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white/80 backdrop-blur-lg`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/#features"
            onClick={() => setIsMenuOpen(false)}
            className={linkClass(isHome && hash === '#features') + ' block text-base w-full text-left'}
          >
            Features
          </Link>
          <Link
            to="/#process"
            onClick={() => setIsMenuOpen(false)}
            className={linkClass(isHome && hash === '#process') + ' block text-base w-full text-left'}
          >
            Process
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-slate-200">
          <div className="px-2">
            <Link
              to="/resources"
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-indigo-600 text-white block px-5 py-3 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-all duration-300"
            >
              Resources
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
