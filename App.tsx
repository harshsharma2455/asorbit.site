// App.tsx
// ─────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ScrollToHash from './components/ScrollToHash';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import ContactPageV2 from './components/ContactPageV2';
import ResourcesPage from './components/FormsPage';
import Chatbot from './components/Chatbot';

/* ── Parallax orb helper ─────────────────────────────────── */
const Orb: React.FC<{
  scrollY: number;
  className: string;
  factor: number;
  style?: React.CSSProperties;
}> = ({ scrollY, className, factor, style }) => (
  <div
    className={`absolute rounded-full ${className}`}
    style={{
      ...style,
      transform: `translateZ(${scrollY * factor * 0.4}px)
                  translateY(${scrollY * factor * 0.15}px)
                  rotateY(${scrollY * 0.03}deg)`,
    }}
  />
);

/* ── Main app ─────────────────────────────────────────────── */
const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  /* keep parallax scrolling */
  useEffect(() => {
    const handle = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  /* scroll to top whenever the URL changes */
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  /* show extra orbs only on the home route */
  const showHomeOrbs = pathname === '/';

  return (
    <>
      <div
        className="bg-[var(--bg-primary)] text-slate-800 flex-grow"
        style={{ perspective: '1000px' }}
      >
        {/* 3-D background */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-x-hidden">
          <div
            className="absolute top-0 left-0 w-full h-[200vh] bg-gradient-to-b from-indigo-100/10 via-transparent to-transparent"
            style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
          />
          <div
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Orb
              scrollY={scrollY}
              factor={-0.4}
              className="w-[600px] h-[600px] bg-indigo-500/5 blur-3xl"
              style={{ top: '10vh', left: '10vw' }}
            />
            {showHomeOrbs && (
              <>
                <Orb
                  scrollY={scrollY}
                  factor={-0.7}
                  className="w-[500px] h-[500px] bg-cyan-400/5 blur-3xl"
                  style={{ top: '80vh', right: '15vw' }}
                />
                <Orb
                  scrollY={scrollY}
                  factor={0.3}
                  className="w-96 h-96 border border-indigo-200/20 rounded-full"
                  style={{ top: '150vh', left: '20vw' }}
                />
                <Orb
                  scrollY={scrollY}
                  factor={0.5}
                  className="w-72 h-72 border border-cyan-200/20 rounded-full"
                  style={{ top: '200vh', right: '25vw' }}
                />
                <Orb
                  scrollY={scrollY}
                  factor={-0.6}
                  className="w-[300px] h-[300px] bg-purple-500/5 blur-3xl"
                  style={{ top: '250vh', left: '10vw' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Layout */}
        <div className="relative flex flex-col min-h-screen">
          <Header /> {/* no props needed */}
            <ScrollToHash />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPageV2 />} />
              <Route path="/contact-v2" element={<ContactPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              {/* fallback → send unknown paths to home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <Footer /> {/* no props needed */}
        </div>
      </div>

      <Chatbot />
    </>
  );
};

export default App;
