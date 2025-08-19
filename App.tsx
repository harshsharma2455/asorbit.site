import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ContactPage from './components/ContactPage';
import Chatbot from './components/Chatbot';
import ResourcesPage from './components/FormsPage';

export type View = 'home' | 'features' | 'process' | 'contact' | 'resources';

const Orb: React.FC<{ scrollY: number; className: string; factor: number; style?: React.CSSProperties }> = ({ scrollY, className, factor, style }) => (
    <div
        className={`absolute rounded-full ${className}`}
        style={{
            ...style,
            transform: `translateZ(${scrollY * factor * 0.4}px) translateY(${scrollY * factor * 0.15}px) rotateY(${scrollY * 0.03}deg)`,
        }}
    />
);

const App: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const [currentView, setCurrentView] = useState<View>('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (currentView === 'contact' || currentView === 'resources') {
            window.scrollTo(0, 0);
        }
    }, [currentView]);
    
    const handleNavigate = (view: View) => {
        if (view === 'contact' || view === 'resources') {
            setCurrentView(view);
        } else if (view === 'home') {
            setCurrentView('home');
            setTimeout(() => {
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 50);
        } else {
            setCurrentView('home');
            setTimeout(() => {
                const element = document.getElementById(view);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 50);
        }
    };

    const renderView = () => {
        switch (currentView) {
            case 'contact':
                return <ContactPage />;
            case 'resources':
                return <ResourcesPage />;
            case 'home':
            default:
                return <HomePage onNavigate={handleNavigate} scrollY={scrollY} />;
        }
    };

    return (
        <>
            <div className="bg-[var(--bg-primary)] text-slate-800 flex-grow" style={{ perspective: '1000px' }}>
                <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none overflow-x-hidden">
                    <div 
                        className="absolute top-0 left-0 w-full h-[200vh] bg-gradient-to-b from-indigo-100/10 via-transparent to-transparent"
                        style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
                    ></div>
                    <div className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                        <Orb scrollY={scrollY} factor={-0.4} className="w-[600px] h-[600px] bg-indigo-500/5 blur-3xl" style={{ top: '10vh', left: '10vw' }} />
                        {currentView === 'home' && (
                            <>
                                <Orb scrollY={scrollY} factor={-0.7} className="w-[500px] h-[500px] bg-cyan-400/5 blur-3xl" style={{ top: '80vh', right: '15vw' }} />
                                <Orb scrollY={scrollY} factor={0.3} className="w-96 h-96 border border-indigo-200/20 rounded-full" style={{ top: '150vh', left: '20vw' }}/>
                                <Orb scrollY={scrollY} factor={0.5} className="w-72 h-72 border border-cyan-200/20 rounded-full" style={{ top: '200vh', right: '25vw' }}/>
                                <Orb scrollY={scrollY} factor={-0.6} className="w-[300px] h-[300px] bg-purple-500/5 blur-3xl" style={{ top: '250vh', left: '10vw' }} />
                            </>
                        )}
                    </div>
                </div>
                
                <div className="relative flex flex-col h-full">
                    <Header onNavigate={handleNavigate} />
                    <main className="flex-grow">
                        {renderView()}
                    </main>
                    <Footer onNavigate={handleNavigate} />
                </div>
            </div>
            <Chatbot />
        </>
    );
};

export default App;