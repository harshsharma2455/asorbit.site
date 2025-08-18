
import React from 'react';
import Features from './Features';

const FeaturesPage: React.FC = () => {
    return (
        <div key="features" className="animate-fadeInUp pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                    Our Features
                </h1>
                <p className="mt-4 text-xl text-slate-600">
                    Discover the powerful AI-driven tools that set Asorbit apart.
                </p>
            </div>
            <Features />
        </div>
    );
};

export default FeaturesPage;