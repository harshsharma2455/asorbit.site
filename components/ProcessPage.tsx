
import React from 'react';
import HowItWorks from './HowItWorks';

const ProcessPage: React.FC = () => {
    return (
        <div key="process" className="animate-fadeInUp pt-20">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                    Our Process
                </h1>
                <p className="mt-4 text-xl text-slate-600">
                    A clear and collaborative blueprint for your success.
                </p>
            </div>
            <HowItWorks />
        </div>
    );
};

export default ProcessPage;