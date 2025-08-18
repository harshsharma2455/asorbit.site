
import React from 'react';
import Testimonials from './Testimonials';

const TestimonialsPage: React.FC = () => {
    return (
        <div key="testimonials" className="animate-fadeInUp pt-20">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                    What Our Clients Say
                </h1>
                <p className="mt-4 text-xl text-slate-600">
                    Real results from businesses we've empowered.
                </p>
            </div>
            <Testimonials />
        </div>
    );
};

export default TestimonialsPage;