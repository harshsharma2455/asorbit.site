import React from 'react';
import { Link } from 'react-router-dom';

const HomeResources: React.FC = () => {
    return (
        <section id="home-resources" className="py-24 sm:py-32 bg-white/50 border-t border-[var(--border-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Unlock Your AI Potential
                    </h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">
                        Download my exclusive guides and templates to accelerate your AI journey. Get practical insights and ready-to-use materials, completely free.
                    </p>
                    <div className="mt-10">
                        <Link
                            to="/resources"
                            className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-[var(--shadow-custom-lg)]"
                        >
                            Explore Free Resources
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeResources;
