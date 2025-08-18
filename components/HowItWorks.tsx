import React from 'react';

const ProcessStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
    <div className="relative flex items-start group">
        <div className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200 group-last:hidden"></div>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center mr-6 z-10 transition-colors duration-300 group-hover:border-indigo-500 group-hover:bg-indigo-50">
            <span className="font-bold text-indigo-600">{number}</span>
        </div>
        <div className="pt-1">
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="mt-2 text-[var(--text-secondary)]">{description}</p>
        </div>
    </div>
);

const HowItWorks: React.FC = () => {
    return (
        <section id="process" className="py-24 sm:py-32 bg-white/50 border-y border-[var(--border-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">My Process</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        A Blueprint for Your AI Transformation
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-[var(--text-secondary)] lg:mx-auto">
                        I follow a structured, collaborative process to ensure your AI solution is a perfect fit.
                    </p>
                </div>
                <div className="mt-20 max-w-3xl mx-auto">
                    <div className="space-y-12">
                        <ProcessStep
                            number="1"
                            title="Discovery & Strategy"
                            description="I dive deep into your business to understand your challenges and identify the most impactful automation opportunities."
                        />
                        <ProcessStep
                            number="2"
                            title="Custom AI Development"
                            description="I build and train bespoke AI models tailored to your specific data and operational needs."
                        />
                        <ProcessStep
                            number="3"
                            title="Seamless Deployment"
                            description="I handle the full integration and deployment process, ensuring minimal disruption and maximum uptime for your team."
                        />
                        <ProcessStep
                            number="4"
                            title="Ongoing Optimization"
                            description="My partnership doesn't end at launch. I continuously monitor, refine, and support your AI systems for peak performance."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;