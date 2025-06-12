import React, { useEffect, useState } from 'react';
import type { AppPage } from '../MainApp';
import AsorbitLogoActual from '../components/layout/AsorbitLogoActual';

// Enhanced Icons with animations
const PaperIcon: React.FC<{className?: string}> = ({ className = "w-8 h-8"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} transition-transform duration-300 group-hover:scale-110`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const ShapesIconLanding: React.FC<{className?: string}> = ({ className = "w-8 h-8"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} transition-transform duration-300 group-hover:rotate-12`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

const BoltIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} transition-all duration-300`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const CogSettingsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} transition-transform duration-300 group-hover:rotate-180`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.07A7.5 7.5 0 0 1 12 6.75v8.55a7.5 7.5 0 0 1-5.457-2.23Z" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} transition-all duration-300`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 ml-2" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} transition-transform duration-300 group-hover:translate-x-1`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const SparkleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} animate-pulse`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
  addNotification: (notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, addNotification }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    addNotification({
      type: 'info',
      title: 'Welcome to ASORBIT!',
      message: 'Explore our AI-powered educational tools to revolutionize your teaching experience.',
      duration: 4000
    });

    // Cycle through features
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [addNotification]);

  const features = [
    {
      icon: <BoltIcon className="w-8 h-8 text-primary-500" />,
      title: "AI-Powered Efficiency",
      description: "Leverage cutting-edge AI to generate questions and diagrams in minutes, not hours.",
      gradient: "from-primary-500 to-blue-600"
    },
    {
      icon: <CogSettingsIcon className="w-8 h-8 text-accent-500" />,
      title: "Deep Customization",
      description: "Tailor content to specific subjects, grades, chapters, and question types for precise educational materials.",
      gradient: "from-accent-500 to-green-600"
    },
    {
      icon: <EyeIcon className="w-8 h-8 text-yellow-500" />,
      title: "Enhanced Visual Learning",
      description: "Create clear, accurate diagrams to aid understanding and engagement in complex topics.",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  const tools = [
    {
      name: "AI Paper Generator",
      description: "Construct comprehensive question papers with varied question types, marks distribution, and syllabus adherence. Add your own custom questions and let AI fill in the rest.",
      icon: <PaperIcon className="w-12 h-12 text-primary-500" />,
      action: () => {
        onNavigate('paperGenerator');
        addNotification({
          type: 'success',
          title: 'Paper Generator Launched',
          message: 'Start creating intelligent question papers with AI assistance.',
          duration: 3000
        });
      },
      buttonText: "Launch Paper Generator",
      gradient: "from-primary-50 to-blue-100",
      borderColor: "border-primary-500",
      bgGradient: "from-primary-500 to-blue-600"
    },
    {
      name: "AI Diagram Generator",
      description: "Instantly translate textual descriptions into 2D geometric diagrams, function graphs, and other visual representations for mathematics and science problems.",
      icon: <ShapesIconLanding className="w-12 h-12 text-accent-500" />,
      action: () => {
        onNavigate('diagramGenerator');
        addNotification({
          type: 'success',
          title: 'Diagram Generator Launched',
          message: 'Transform your ideas into visual diagrams with AI.',
          duration: 3000
        });
      },
      buttonText: "Launch Diagram Tool",
      gradient: "from-accent-50 to-emerald-100",
      borderColor: "border-accent-500",
      bgGradient: "from-accent-500 to-emerald-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Questions Generated", icon: "📝" },
    { number: "5K+", label: "Diagrams Created", icon: "📊" },
    { number: "1K+", label: "Educators Served", icon: "👨‍🏫" },
    { number: "99%", label: "Satisfaction Rate", icon: "⭐" }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-accent-600">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-8 animate-bounce-gentle">
              <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] overflow-hidden">
                <AsorbitLogoActual className="transform scale-[1] sm:scale-[1.25] origin-center" />
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 text-shadow">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-accent-300 to-yellow-300 bg-clip-text text-transparent animate-pulse">
                ASORBIT
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed">
              Empowering Educators with AI
            </p>
            
            <p className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Effortlessly Create Question Papers & Generate Diagrams with Intelligent Assistance
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
              <button
                onClick={() => {
                  onNavigate('paperGenerator');
                  addNotification({
                    type: 'success',
                    title: 'Getting Started',
                    message: 'Welcome to the Paper Generator! Let\'s create something amazing.',
                    duration: 3000
                  });
                }}
                className="group interactive-button button-glow bg-white text-primary-600 px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <PaperIcon className="w-6 h-6" />
                  <span>Try Paper Generator</span>
                  <SparkleIcon />
                </span>
              </button>
              
              <button
                onClick={() => {
                  onNavigate('diagramGenerator');
                  addNotification({
                    type: 'success',
                    title: 'Getting Started',
                    message: 'Welcome to the Diagram Generator! Let\'s visualize your ideas.',
                    duration: 3000
                  });
                }}
                className="group interactive-button bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 text-lg font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <ShapesIconLanding className="w-6 h-6" />
                  <span>Try Diagram Generator</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="glass-effect rounded-2xl p-6 text-center animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 to-blue-50"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
              Why Choose <span className="gradient-text">ASORBIT</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Streamline your teaching workflow and create engaging educational content with intelligent tools.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`interactive-card p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-t-4 ${
                  currentFeature === index ? 'border-primary-500 animate-pulse-glow' : 'border-transparent'
                } animate-fade-in-up`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className={`flex justify-center items-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mx-auto mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-4 text-center">{feature.title}</h3>
                <p className="text-slate-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-br from-slate-100 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
              Explore Our <span className="gradient-text">AI Tools</span>
            </h2>
            <p className="text-xl text-slate-600">Powerful AI assistants designed for modern educators.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {tools.map((tool, index) => (
              <div 
                key={tool.name} 
                className="group interactive-card bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up"
                style={{animationDelay: `${index * 0.3}s`}}
              >
                <div className={`h-2 bg-gradient-to-r ${tool.bgGradient}`}></div>
                
                <div className="p-8">
                  <div className="flex justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110">
                    {tool.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-700 mb-4 text-center">{tool.name}</h3>
                  <p className="text-slate-600 text-center mb-8 leading-relaxed">{tool.description}</p>
                  
                  <button
                    onClick={tool.action}
                    className={`w-full interactive-button button-glow bg-gradient-to-r ${tool.bgGradient} text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>{tool.buttonText}</span>
                      <ArrowRightIcon className="w-5 h-5" />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
              Simple & <span className="gradient-text">Intuitive</span> Process
            </h2>
            <p className="text-xl text-slate-600">Get started in just a few easy steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: 1, 
                title: "Configure & Prompt", 
                description: "Define your requirements for papers or describe the diagram you need.", 
                iconBg: "bg-gradient-to-r from-primary-500 to-blue-600", 
                iconColor:"text-white",
                icon: "⚙️"
              },
              { 
                step: 2, 
                title: "AI Generation", 
                description: "Let ASORBIT's AI craft questions or visualize diagrams based on your input.", 
                iconBg: "bg-gradient-to-r from-accent-500 to-green-600", 
                iconColor:"text-white",
                icon: "🤖"
              },
              { 
                step: 3, 
                title: "Review & Refine", 
                description: "Edit generated content, regenerate diagrams, and finalize your materials.", 
                iconBg: "bg-gradient-to-r from-yellow-500 to-orange-600", 
                iconColor:"text-white",
                icon: "✨"
              }
            ].map((item, index) => (
              <div 
                key={item.step} 
                className="text-center p-8 animate-fade-in-up"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className={`relative flex items-center justify-center w-20 h-20 ${item.iconBg} rounded-3xl mx-auto mb-6 shadow-xl transform transition-all duration-300 hover:scale-110 hover:rotate-6`}>
                  <span className="text-3xl">{item.icon}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-slate-700">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-r from-primary-700 via-purple-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-shadow">
              Ready to Transform Your <span className="bg-gradient-to-r from-accent-300 to-yellow-300 bg-clip-text text-transparent">Workflow</span>?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Experience the power of AI in education. Start creating smarter, faster, and more effectively with ASORBIT.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button
                onClick={() => {
                  onNavigate('paperGenerator');
                  addNotification({
                    type: 'success',
                    title: 'Welcome Aboard!',
                    message: 'Let\'s start creating amazing educational content together.',
                    duration: 4000
                  });
                }}
                className="group interactive-button button-glow bg-white text-primary-600 px-10 py-4 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center space-x-3">
                  <span>Get Started Now</span>
                  <SparkleIcon className="w-5 h-5" />
                </span>
              </button>
              
              <button
                onClick={() => {
                  addNotification({
                    type: 'info',
                    title: 'Learn More',
                    message: 'Explore our features above to discover what ASORBIT can do for you.',
                    duration: 3000
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group interactive-button bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <span>Learn More</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;