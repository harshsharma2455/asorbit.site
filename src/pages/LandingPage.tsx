import React from 'react';
import type { AppPage } from '../MainApp';

const PaperIcon: React.FC<{className?: string}> = ({ className = "w-8 h-8"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const ShapesIconLanding: React.FC<{className?: string}> = ({ className = "w-8 h-8"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

const BoltIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const CogSettingsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a6.759 6.759 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const stats = [
    { label: 'Questions Generated', value: '10,000+', icon: PaperIcon },
    { label: 'Diagrams Created', value: '5,000+', icon: ShapesIconLanding },
    { label: 'Time Saved', value: '500+ hrs', icon: BoltIcon },
    { label: 'Success Rate', value: '99.9%', icon: ChartBarIcon }
  ];

  const features = [
    {
      icon: <BoltIcon className="w-8 h-8 text-primary-500" />,
      title: "AI-Powered Efficiency",
      description: "Leverage cutting-edge AI to generate questions and diagrams in minutes, not hours."
    },
    {
      icon: <CogSettingsIcon className="w-8 h-8 text-accent-500" />,
      title: "Deep Customization",
      description: "Tailor content to specific subjects, grades, chapters, and question types for precise educational materials."
    },
    {
      icon: <EyeIcon className="w-8 h-8 text-blue-500" />,
      title: "Enhanced Visual Learning",
      description: "Create clear, accurate diagrams to aid understanding and engagement in complex topics."
    }
  ];

  const tools = [
    {
      name: "AI Paper Generator",
      description: "Construct comprehensive question papers with varied question types, marks distribution, and syllabus adherence. Add your own custom questions and let AI fill in the rest.",
      icon: <PaperIcon className="w-12 h-12 text-primary-500" />,
      action: () => onNavigate('paperGenerator'),
      buttonText: "Launch Paper Generator",
      gradient: "from-primary-50 to-blue-100",
      borderColor: "border-primary-200"
    },
    {
      name: "AI Diagram Generator",
      description: "Instantly translate textual descriptions into 2D geometric diagrams, function graphs, and other visual representations for mathematics and science problems.",
      icon: <ShapesIconLanding className="w-12 h-12 text-accent-500" />,
      action: () => onNavigate('diagramGenerator'),
      buttonText: "Launch Diagram Tool",
      gradient: "from-accent-50 to-emerald-100",
      borderColor: "border-accent-200"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">ASORBIT</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Empowering Educators with AI: Effortlessly Create Question Papers & Generate Diagrams for Enhanced Learning.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => onNavigate('paperGenerator')}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-xl shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all transform hover:scale-105"
            >
              <PaperIcon className="w-5 h-5 mr-2 transition-transform group-hover:rotate-[-5deg]" />
              Try Paper Generator
            </button>
            <button
              onClick={() => onNavigate('diagramGenerator')}
              className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-accent-600 rounded-xl shadow-lg hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all transform hover:scale-105"
            >
              <ShapesIconLanding className="w-5 h-5 mr-2 transition-transform group-hover:rotate-[5deg]" />
              Try Diagram Generator
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <IconComponent className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why ASORBIT? Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose ASORBIT?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline your teaching workflow and create engaging educational content with intelligent tools.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow text-center">
              <div className="flex justify-center items-center w-16 h-16 bg-gray-50 rounded-xl mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Our Tools Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Explore Our Tools</h2>
          <p className="text-lg text-gray-600">Powerful AI assistants designed for educators.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool) => (
            <div key={tool.name} className={`bg-white p-8 rounded-xl shadow-lg border-2 ${tool.borderColor} hover:shadow-xl transition-all hover:scale-105`}>
              <div className="flex justify-center mb-6">{tool.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">{tool.name}</h3>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">{tool.description}</p>
              <button
                onClick={tool.action}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gray-900 rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                {tool.buttonText}
                <ArrowRightIcon className="ml-2" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple & Intuitive Process</h2>
          <p className="text-lg text-gray-600">Get started in just a few easy steps.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: 1, title: "Configure & Prompt", description: "Define your requirements for papers or describe the diagram you need.", color: "primary" },
            { step: 2, title: "AI Generation", description: "Let ASORBIT's AI craft questions or visualize diagrams based on your input.", color: "accent" },
            { step: 3, title: "Review & Refine", description: "Edit generated content, regenerate diagrams, and finalize your materials.", color: "blue" }
          ].map(item => (
            <div key={item.step} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center">
              <div className={`flex items-center justify-center w-12 h-12 bg-${item.color}-100 rounded-full mx-auto mb-6`}>
                <span className={`text-xl font-bold text-${item.color}-600`}>{item.step}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Experience the power of AI in education. Start creating smarter, faster, and more effectively with ASORBIT.
          </p>
          <button
            onClick={() => onNavigate('paperGenerator')}
            className="px-10 py-4 text-lg font-semibold bg-white text-primary-600 rounded-xl shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 focus:ring-offset-primary-700 transition-all transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;