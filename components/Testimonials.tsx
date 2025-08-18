import React, { useState, useEffect, useRef } from 'react';
import type { Testimonial } from '../types';

const testimonialData: Testimonial[] = [
    {
        quote: "Asorbit transformed our data processing pipeline, cutting down manual work by 90%. Their team is brilliant and the results speak for themselves.",
        name: "Jane Doe",
        role: "COO",
        company: "Innovate Inc.",
        avatarUrl: "https://i.pravatar.cc/100?u=jane",
    },
    {
        quote: "The AI-driven analytics platform they built for us has given us insights we never thought possible. We're now making smarter decisions, faster.",
        name: "John Smith",
        role: "Head of Analytics",
        company: "DataDriven Corp.",
        avatarUrl: "https://i.pravatar.cc/100?u=john",
    },
     {
        quote: "From the initial consultation to final deployment, the process was seamless. Asorbit's professionalism and expertise are second to none.",
        name: "Emily White",
        role: "CEO",
        company: "Future Forward",
        avatarUrl: "https://i.pravatar.cc/100?u=emily",
    },
];

const TestimonialCard: React.FC<Testimonial> = ({ quote, name, role, company, avatarUrl }) => (
    <figure className="p-8 bg-white/60 rounded-xl border border-[var(--border-primary)] backdrop-blur-sm shadow-[var(--shadow-custom)]">
        <blockquote className="text-lg text-slate-700">
            <p>“{quote}”</p>
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-4">
            <img className="h-12 w-12 rounded-full object-cover" src={avatarUrl} alt={name} />
            <div>
                <div className="font-semibold text-slate-900">{name}</div>
                <div className="text-[var(--text-secondary)] text-sm">{role}, {company}</div>
            </div>
        </figcaption>
    </figure>
);

const Testimonials: React.FC = () => {
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
        <section id="testimonials" className="py-24 sm:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Trusted by Industry Leaders</h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">
                        See how we've helped businesses like yours achieve remarkable results.
                    </p>
                </div>
                <div ref={containerRef} className="mt-20 max-w-5xl mx-auto grid gap-8 lg:grid-cols-1">
                    {testimonialData.map((testimonial, index) => (
                        <div key={testimonial.name} className={isVisible ? 'animate-fadeInUp' : 'opacity-0'} style={{ animationDelay: `${index * 150}ms`}}>
                            <TestimonialCard {...testimonial} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;