import React from 'react';
import Hero from './Hero';
import Features from './Features';
import HomeResources from './HomeResources';
import HowItWorks from './HowItWorks';
import CTA from './CTA';
import type { View } from '../App';

interface HomePageProps {
    onNavigate: (view: View) => void;
    scrollY: number;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, scrollY }) => {
    return (
        <div>
            <Hero onNavigate={onNavigate} scrollY={scrollY} />
            <div className="relative z-10 bg-[var(--bg-primary)]">
                <Features />
                <HowItWorks />
                <HomeResources />
                <CTA />
            </div>
        </div>
    );
};

export default HomePage;
