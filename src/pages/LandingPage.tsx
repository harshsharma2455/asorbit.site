import React from 'react';
import type { AppPage } from '../MainApp';
import AsorbitLogoActual from '../components/layout/AsorbitLogoActual';

// --- Re-usable Icons (can be moved to a constants file if used elsewhere) ---
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.07A7.5 7.5 0 0 1 12 6.75v8.55a7.5 7.5 0 0 1-5.457-2.23Z" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 ml-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);


interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
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
      icon: <EyeIcon className="w-8 h-8 text-yellow-500" />,
      title: "Enhanced Visual Learning",
      description: "Create clear, accurate diagrams to aid understanding and engagement in complex topics."
    }
  ];

  const tools = [
    {
      name: "AI Paper Generator",
      description: "Construct comprehensive question papers with varied question types, marks distribution, and syllabus adherence. Add your own custom questions and let AI fill in the rest.",
      icon: <PaperIcon className="w-10 h-10 text-primary-500" />,
      action: () => onNavigate('paperGenerator'),
      buttonText: "Launch Paper Generator",
      gradient: "from-primary-50 to-blue-100",
      borderColor: "border-primary-500"
    },
    {
      name: "AI Diagram Generator",
      description: "Instantly translate textual descriptions into 2D geometric diagrams, function graphs, and other visual representations for mathematics and science problems.",
      icon: <ShapesIconLanding className="w-10 h-10 text-accent-500" />,
      action: () => onNavigate('diagramGenerator'),
      buttonText: "Launch Diagram Tool",
      gradient: "from-accent-50 to-emerald-100",
      borderColor: "border-accent-500"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-100 via-primary-50 to-slate-50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="w-[100px] h-[100px] sm:w-[128px] sm:h-[128px] overflow-hidden">
              <AsorbitLogoActual className="transform scale-[0.83333] sm:scale-[1.066666] origin-top-left" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-700 mb-6">
            Welcome to <span className="text-accent-600">ASORBIT</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 mb-10 max-w-2xl mx-auto">
            Empowering Educators with AI: Effortlessly Create Question Papers & Generate Diagrams.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => onNavigate('paperGenerator')}
              className="group inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-primary-600 rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
              aria-label="Try AI Question Paper Generator"
            >
              <PaperIcon className="w-5 h-5 mr-2 transition-transform group-hover:rotate-[-5deg]" />
              Try Paper Generator
            </button>
            <button
              onClick={() => onNavigate('diagramGenerator')}
              className="group inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-accent-600 rounded-lg shadow-md hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
              aria-label="Try AI Diagram Generator"
            >
              <ShapesIconLanding className="w-5 h-5 mr-2 transition-transform group-hover:rotate-[5deg]" />
              Try Diagram Generator
            </button>
          </div>
        </div>
      </section>

      {/* Why ASORBIT? Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Why Choose ASORBIT?</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
              Streamline your teaching workflow and create engaging educational content with intelligent tools.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-slate-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center items-center w-16 h-16 bg-white rounded-full mx-auto mb-5 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Our Tools Section */}
      <section className="py-16 sm:py-20 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Explore Our Tools</h2>
            <p className="mt-4 text-lg text-slate-600">Powerful AI assistants designed for educators.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <div key={tool.name} className={`flex flex-col bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow border-t-4 ${tool.borderColor}`}>
                <div className="flex justify-center mb-5">{tool.icon}</div>
                <h3 className="text-2xl font-semibold text-slate-700 mb-3 text-center">{tool.name}</h3>
                <p className="text-slate-600 text-sm mb-6 flex-grow text-center">{tool.description}</p>
                <button
                  onClick={tool.action}
                  className="mt-auto w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-slate-700 rounded-lg shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
                >
                  {tool.buttonText}
                  <ArrowRightIcon />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">Simple & Intuitive Process</h2>
            <p className="mt-4 text-lg text-slate-600">Get started in just a few easy steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: 1, title: "Configure & Prompt", description: "Define your requirements for papers or describe the diagram you need.", iconBg: "bg-primary-100", iconColor:"text-primary-600" },
              { step: 2, title: "AI Generation", description: "Let ASORBIT's AI craft questions or visualize diagrams based on your input.", iconBg: "bg-accent-100", iconColor:"text-accent-600" },
              { step: 3, title: "Review & Refine", description: "Edit generated content, regenerate diagrams, and finalize your materials.", iconBg: "bg-yellow-100", iconColor:"text-yellow-600" }
            ].map(item => (
              <div key={item.step} className="p-6">
                <div className={`flex items-center justify-center w-12 h-12 ${item.iconBg} rounded-full mx-auto mb-4`}>
                  <span className={`text-xl font-bold ${item.iconColor}`}>{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary-700 to-accent-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-lg text-primary-100 mb-8">
            Experience the power of AI in education. Start creating smarter, faster, and more effectively with ASORBIT.
          </p>
          <button
            onClick={() => onNavigate('paperGenerator')} // Or a preferred tool
            className="px-10 py-4 text-lg font-semibold bg-white text-primary-600 rounded-lg shadow-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 focus:ring-offset-primary-700 transition-transform transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;