import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Project } from '../types';
import type { View } from '../App';

export const projectData: Project[] = [
    {
        id: 1,
        title: "Personalized Chatbots",
        description: "I build and deploy intelligent, conversational AI chatbots that provide instant, 24/7 support and personalized customer interactions.",
        imageUrl: "https://images.unsplash.com/photo-1589254065909-b7086229d086?q=80&w=1587&auto=format&fit=crop",
        tags: ["Conversational AI", "Customer Support", "Personalization"],
        detailedDescription: "My custom-built chatbots go beyond simple FAQ responses. They are designed to understand user intent, maintain context throughout conversations, and perform complex tasks. By integrating with your existing databases and APIs, they can provide personalized recommendations, book appointments, process orders, and escalate issues to human agents seamlessly. This creates a frictionless customer experience that boosts satisfaction and loyalty.",
        keyFeatures: [
            "Natural Language Understanding (NLU)",
            "Multi-turn conversation management",
            "Omnichannel support (web, mobile, social)",
            "API integration with CRM and other business systems",
            "Advanced sentiment analysis",
        ],
        results: "Achieved a 40% reduction in customer support tickets and increased user engagement by 25% for my clients.",
    },
    {
        id: 2,
        title: "Intelligent Lead Management",
        description: "Automate lead qualification and nurturing. My AI systems analyze interactions to score leads and assign them to the right sales reps.",
        imageUrl: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1587&auto=format&fit=crop",
        tags: ["Lead Generation", "Sales Automation", "CRM Integration"],
        detailedDescription: "Stop wasting time on unqualified leads. My AI-powered lead management system automatically analyzes incoming leads from various channels, scores them based on their likelihood to convert, and nurtures them with personalized communication. It ensures your sales team always focuses on the most promising opportunities, dramatically improving conversion rates and sales efficiency.",
        keyFeatures: [
            "Automated lead scoring and prioritization",
            "Behavioral analysis from user interactions",
            "Personalized email nurturing sequences",
            "Seamless integration with Salesforce, HubSpot, and more",
            "Real-time alerts for sales representatives",
        ],
        results: "Increased sales-qualified leads by 300% and reduced the sales cycle by 20% for a leading B2B SaaS company.",
    },
    {
        id: 3,
        title: "Automated Customer Support System",
        description: "A comprehensive AI solution that handles support tickets, answers FAQs, and escalates complex issues, reducing response times by over 70%.",
        imageUrl: "https://images.unsplash.com/photo-1558021211-6514f395939a?q=80&w=1665&auto=format&fit=crop",
        tags: ["Customer Service", "Automation", "Zendesk API"],
        detailedDescription: "Empower your support team and delight your customers with my automated support system. It intelligently triages incoming support tickets, provides instant answers to common questions using a sophisticated knowledge base, and smartly escalates complex issues to the right human agent with all the necessary context. This ensures faster resolution times and frees up your team to handle high-value interactions.",
        keyFeatures: [
            "AI-powered ticket categorization and routing",
            "24/7 instant responses for common queries",
            "Knowledge base integration for self-service",
            "Smart escalation to human agents",
            "Performance analytics and reporting dashboard",
        ],
        results: "Reduced first-response time by over 70% and improved customer satisfaction scores (CSAT) by 15 points.",
    },
     {
        id: 4,
        title: "Dynamic Pricing Engine",
        description: "An AI-powered pricing engine that analyzes market data, competitor pricing, and demand to optimize prices in real-time, maximizing revenue.",
        imageUrl: "https://images.unsplash.com/photo-1579621970795-87f54f597CEA?q=80&w=1740&auto=format&fit=crop",
        tags: ["E-commerce", "Machine Learning", "Pricing Strategy"],
        detailedDescription: "Stay ahead of the market with an AI that sets the perfect price at the perfect time. My dynamic pricing engine continuously analyzes thousands of data points—including competitor activity, demand fluctuations, inventory levels, and customer behavior—to adjust your prices in real-time. This automated strategy helps you maximize revenue and profit margins without manual intervention.",
        keyFeatures: [
            "Real-time market and competitor analysis",
            "Demand forecasting using machine learning",
            "Customizable pricing rules and constraints",
            "A/B testing for different pricing strategies",
            "Full automation for e-commerce platforms",
        ],
        results: "Increased overall revenue by 18% and profit margins by 12% for a major online retailer.",
    },
    {
        id: 5,
        title: "Supply Chain Optimization",
        description: "Predictive analytics to forecast demand, manage inventory, and optimize logistics, reducing costs and improving delivery times.",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-06924211a1d2?q=80&w=1740&auto=format&fit=crop",
        tags: ["Logistics", "Predictive Analytics", "Inventory Management"],
        detailedDescription: "Build a resilient and efficient supply chain with AI. My solution uses predictive analytics to generate highly accurate demand forecasts, automate inventory replenishment, and optimize delivery routes. By anticipating disruptions and identifying inefficiencies, I help you reduce operational costs, minimize stockouts, and ensure your products get to your customers faster.",
        keyFeatures: [
            "AI-driven demand forecasting",
            "Automated inventory management and reordering",
            "Optimal routing and logistics planning",
            "Supplier performance monitoring",
            "Risk detection and mitigation",
        ],
        results: "Reduced inventory holding costs by 22% and improved on-time delivery rates to 98.5%.",
    },
    {
        id: 6,
        title: "AI-Powered Content Generation",
        description: "Automated creation of marketing copy, product descriptions, and social media content tailored to your brand's voice and audience.",
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1673&auto=format&fit=crop",
        tags: ["Content Marketing", "NLP", "SEO"],
        detailedDescription: "Scale your content marketing efforts effortlessly. My generative AI platform learns your brand's unique voice and tone to create high-quality, original content for any channel. From engaging blog posts and SEO-optimized product descriptions to catchy social media updates, my AI can produce compelling copy in seconds, allowing your marketing team to focus on strategy and creativity.",
        keyFeatures: [
            "Custom brand voice and style training",
            "Generation of various content types (blogs, ads, social)",
            "Built-in SEO optimization tools",
            "Plagiarism and originality checks",
            "Multi-language content creation",
        ],
        results: "Increased content production by 500% while reducing content creation costs by 60%.",
    }
];

export const ProjectCard: React.FC<Project & { onClick?: () => void }> = ({ title, description, imageUrl, tags, onClick }) => (
    <div onClick={onClick} className={`bg-white/60 group rounded-2xl overflow-hidden border border-[var(--border-primary)] backdrop-blur-sm transition-all duration-300 hover:border-indigo-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-custom-lg)] shadow-[var(--shadow-custom)] text-left w-full h-full flex flex-col ${onClick ? 'cursor-pointer' : ''}`}>
        <div className="aspect-video overflow-hidden">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-[var(--text-secondary)] mb-4 flex-grow">{description}</p>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const LeftArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const RightArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

// Helper to get number of visible slides based on window width
const getNumVisible = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
};

interface ProjectsProps {
    onNavigate: (view: View) => void;
}

const Projects: React.FC<ProjectsProps> = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [numVisible, setNumVisible] = useState(3);
    const [currentIndex, setCurrentIndex] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(true);

    // Create a memoized list of projects with clones for infinite scroll effect
    const extendedProjects = useMemo(() => {
        if (projectData.length <= numVisible) {
            return projectData;
        }
        const startClones = projectData.slice(0, numVisible);
        const endClones = projectData.slice(-numVisible);
        return [...endClones, ...projectData, ...startClones];
    }, [numVisible]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const newNumVisible = getNumVisible();
            setNumVisible(newNumVisible);
            setIsTransitioning(false); // Jump without animation
            setCurrentIndex(newNumVisible);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };
    
    // Effect for handling the "loop" by jumping without transition
    useEffect(() => {
        if (projectData.length <= numVisible) return;
        
        // After jumping, re-enable transitions for the next user/auto slide
        if (!isTransitioning) {
            const timer = setTimeout(() => setIsTransitioning(true), 50);
            return () => clearTimeout(timer);
        }

        // When we reach the cloned slides at the end
        if (currentIndex === projectData.length + numVisible) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(numVisible);
            }, 500); // Must match CSS transition duration
            return () => clearTimeout(timer);
        }
        
        // When we reach the cloned slides at the beginning
        if (currentIndex === numVisible - 1) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(projectData.length + numVisible - 1);
            }, 500); // Must match CSS transition duration
            return () => clearTimeout(timer);
        }

    }, [currentIndex, numVisible, isTransitioning]);

    // Effect for auto-sliding
    useEffect(() => {
        if (projectData.length <= numVisible || !isTransitioning) return;

        resetTimeout();
        timeoutRef.current = setTimeout(
            () => setCurrentIndex(prev => prev + 1),
            2000
        );

        return () => resetTimeout();
    }, [currentIndex, numVisible, isTransitioning]);


    const handleNavClick = (direction: 'prev' | 'next') => {
        if (projectData.length <= numVisible) return;
        resetTimeout();
        setIsTransitioning(true);
        setCurrentIndex(prev => direction === 'next' ? prev + 1 : prev - 1);
    };
    
    // Intersection observer for initial fade-in animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = containerRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <section id="projects" className="py-24 sm:py-32 bg-white/50 border-t border-[var(--border-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">From Concept to Reality: My Work</h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">
                        Explore a selection of bespoke AI solutions I've delivered to drive growth and efficiency.
                    </p>
                </div>
                
                <div ref={containerRef} className={`mt-20 max-w-5xl mx-auto relative ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                    <div className="overflow-hidden">
                        <div
                            className="flex"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / numVisible)}%)`,
                                transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
                            }}
                        >
                            {extendedProjects.map((project, index) => (
                                <div 
                                    key={`${project.id}-${index}`} 
                                    className="flex-shrink-0 px-4 h-full"
                                    style={{ flexBasis: `${100 / numVisible}%` }}
                                >
                                    <ProjectCard {...project} onClick={() => onNavigate('projectsPage')} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {projectData.length > numVisible && (
                        <>
                            <button
                                onClick={() => handleNavClick('prev')}
                                className="absolute top-1/2 -left-0 md:-left-6 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600 transition-all duration-200 hover:scale-110"
                                aria-label="Previous project"
                            >
                                <LeftArrowIcon />
                            </button>
                            <button
                                onClick={() => handleNavClick('next')}
                                className="absolute top-1/2 -right-0 md:-right-6 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-indigo-600 transition-all duration-200 hover:scale-110"
                                aria-label="Next project"
                            >
                                <RightArrowIcon />
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-16 text-center">
                     <button 
                        onClick={() => onNavigate('projectsPage')}
                        className="bg-indigo-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-[var(--shadow-custom-lg)]"
                    >
                        See All Projects
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Projects;