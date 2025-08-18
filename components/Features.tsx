import React, { useState, useEffect, useRef } from 'react';
import { AutomationIcon } from './icons/AutomationIcon';
import { IntegrationIcon } from './icons/IntegrationIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const featuresData: Feature[] = [
    {
        icon: <AutomationIcon />,
        title: "Intelligent Automation",
        description: "Automate complex workflows and repetitive tasks with AI agents that learn and adapt to your business processes.",
    },
    {
        icon: <IntegrationIcon />,
        title: "Seamless Integration",
        description: "Our solutions integrate effortlessly with your existing software stack, from CRMs to ERPs, ensuring a smooth transition.",
    },
    {
        icon: <AnalyticsIcon />,
        title: "Actionable Analytics",
        description: "Gain deep insights from your data. Our AI models identify trends, predict outcomes, and provide clear, actionable recommendations.",
    }
];

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => (
    <div className="bg-white/60 p-8 rounded-xl border border-[var(--border-primary)] backdrop-blur-sm transition-all duration-300 hover:border-indigo-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-custom-lg)] shadow-[var(--shadow-custom)]">
        <div className="mb-5 text-indigo-600">{icon}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-[var(--text-secondary)]">{description}</p>
    </div>
);

const Features: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <section id="features" className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Why Choose Asorbit?</h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">Unlock efficiency and intelligence in every facet of your business.</p>
                </div>
                <div ref={containerRef} className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {featuresData.map((feature, index) => (
                         <div key={feature.title} className={isVisible ? 'animate-fadeInUp' : 'opacity-0'} style={{ animationDelay: `${index * 150}ms`}}>
                            <FeatureCard {...feature} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;