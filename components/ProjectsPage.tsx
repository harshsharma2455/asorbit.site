import React, { useState } from 'react';
import { projectData } from './Projects';
import type { View } from '../App';

interface ProjectsPageProps {
    onNavigate: (view: View) => void;
}

const CheckIcon: React.FC = () => (
    <svg className="h-6 w-6 text-indigo-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const DropdownArrowIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <svg className={`h-6 w-6 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
);

const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
    const [selectedProjectId, setSelectedProjectId] = useState(projectData[0]?.id || null);
    const [isProjectListOpen, setIsProjectListOpen] = useState(false);

    const selectedProject = projectData.find(p => p.id === selectedProjectId);

    const handleProjectSelect = (id: number) => {
        setSelectedProjectId(id);
        setIsProjectListOpen(false); // Close dropdown on mobile after selection
    };

    return (
        <div key="projects-page" className="animate-fadeInUp pt-28 sm:pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                    {/* Sidebar for Desktop */}
                    <aside className="hidden md:flex flex-col w-72 md:sticky md:top-28 md:self-start bg-white/80 backdrop-blur-lg p-6 rounded-2xl border border-[var(--border-primary)] shadow-[var(--shadow-custom-lg)]">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex-shrink-0">My Projects</h2>
                        <nav className="flex-grow overflow-y-auto pr-2 -mr-4 space-y-1.5">
                            {projectData.map(project => (
                                <button
                                    key={project.id}
                                    onClick={() => handleProjectSelect(project.id)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                                        selectedProject?.id === project.id
                                            ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {project.title}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 w-full md:w-auto">
                        {selectedProject ? (
                            <article>
                                {/* Mobile Project Selector Dropdown */}
                                <div className="md:hidden mb-6 relative">
                                    <button
                                        onClick={() => setIsProjectListOpen(!isProjectListOpen)}
                                        className="w-full flex items-center justify-between text-left p-4 bg-white/80 border border-slate-200 rounded-lg shadow-sm"
                                        aria-haspopup="true"
                                        aria-expanded={isProjectListOpen}
                                    >
                                        <span className="text-xl font-bold text-slate-800">{selectedProject.title}</span>
                                        <DropdownArrowIcon isOpen={isProjectListOpen} />
                                    </button>
                                    {isProjectListOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 animate-fadeInUp" style={{ animationDuration: '300ms' }}>
                                            <nav className="p-2 max-h-60 overflow-y-auto">
                                                {projectData.map(project => (
                                                    <button
                                                        key={project.id}
                                                        onClick={() => handleProjectSelect(project.id)}
                                                        className={`w-full text-left px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                                                            selectedProject?.id === project.id
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : 'text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        {project.title}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Desktop Title */}
                                <h1 className="hidden md:block text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{selectedProject.title}</h1>
                                
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedProject.tags.map(tag => (
                                        <span key={tag} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="aspect-video w-full rounded-xl overflow-hidden my-8 shadow-[var(--shadow-custom-lg)] border border-slate-200">
                                    <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
                                </div>
                                
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {selectedProject.detailedDescription}
                                </p>

                                <div className="mt-10 pt-8 border-t border-slate-200">
                                    <h2 className="text-2xl font-semibold text-slate-900 mb-5">Key Features</h2>
                                    <ul className="space-y-3">
                                        {selectedProject.keyFeatures.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckIcon/>
                                                <span className="text-slate-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="mt-10 pt-8 border-t border-slate-200">
                                    <h2 className="text-2xl font-semibold text-slate-900 mb-5">Results</h2>
                                     <div className="bg-indigo-50 border-l-4 border-indigo-300 p-5 rounded-r-lg">
                                        <p className="text-slate-700 italic">{selectedProject.results}</p>
                                    </div>
                                </div>
                            </article>
                        ) : (
                             <div className="flex items-center justify-center h-full min-h-[50vh] p-4 text-center">
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-500">Select a project</h2>
                                    <p className="text-slate-400 mt-2">Choose a project from the menu to see the details.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProjectsPage;