import React, { useState, useCallback } from 'react';
import { GeminiService } from '../services'; 
import type { DiagramData, AppError, NotificationFunction } from '../types';
import { DiagramPromptInput } from '../components/features/QuestionInput';
import { DiagramDisplay } from '../components/features/DiagramDisplay';
import LoadingSpinner from '../components/core/LoadingSpinner'; 
import { LightBulbIcon, ShapesIcon, API_KEY_ERROR_MESSAGE, RedoIcon } from '../config';

interface DiagramGeneratorStandalonePageProps {
  geminiService: GeminiService;
  setGlobalError: (error: string | null) => void;
  addNotification: NotificationFunction;
}

const DiagramGeneratorStandalonePage: React.FC<DiagramGeneratorStandalonePageProps> = ({ geminiService, setGlobalError, addNotification }) => {
  const [diagramData, setDiagramData] = useState<DiagramData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  const handleGenerateDiagram = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setDiagramData(null);
    setCurrentPrompt(prompt);
    setGlobalError(null);

    try {
      const data = await geminiService.generateDiagramDescription(prompt);
      setDiagramData(data);
      if (data.errorParsing) {
        setError({ message: data.description || "Failed to parse diagram data from AI." });
        addNotification({
          type: 'warning',
          title: 'Diagram Generated with Issues',
          message: 'Diagram was created but with some parsing issues.',
          duration: 4000
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Diagram Generated',
          message: 'Successfully created your diagram!',
          duration: 3000
        });
      }
    } catch (err: any) {
      if (err.message === API_KEY_ERROR_MESSAGE) {
        setGlobalError(API_KEY_ERROR_MESSAGE);
      } else {
        setError({ message: err.message || "An unknown error occurred during diagram generation." });
        addNotification({
          type: 'error',
          title: 'Generation Failed',
          message: err.message || 'An error occurred while generating the diagram.',
          duration: 5000
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [geminiService, setGlobalError, addNotification]);

  const handleRegenerate = () => {
    if (currentPrompt) {
      handleGenerateDiagram(currentPrompt);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 p-4 sm:p-0">
      <div className="text-center border-b border-slate-300 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-primary-700 flex items-center justify-center space-x-2">
          <ShapesIcon /> 
          <span>AI Diagram Generator</span>
        </h1>
        <p className="text-slate-600 mt-2">
          Transform your textual descriptions into 2D diagrams for math and science concepts.
        </p>
      </div>

      {/* DiagramPromptInput is always visible now */}
      <div className="p-6 bg-white shadow-xl rounded-lg border border-slate-200">
        <DiagramPromptInput
          onSubmit={handleGenerateDiagram}
          isLoading={isLoading}
          initialValue={currentPrompt}
          submitButtonText="Generate Diagram"
          placeholderText="e.g., A cone of radius 5cm and height 12cm mounted on a hemisphere of the same radius."
          labelText="Enter prompt for diagram generation:"
        />
      </div>
      
      {(diagramData || error) && !isLoading && (
         <div className="flex justify-center mt-4">
            <button
              onClick={handleRegenerate}
              disabled={isLoading || !currentPrompt}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm"
            >
              <RedoIcon className="w-4 h-4" />
              <span>Regenerate Diagram</span>
            </button>
          </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-10 bg-white shadow-lg rounded-lg border border-slate-200 min-h-[200px]">
          <LoadingSpinner size="large" text="Generating Diagram..." />
          <p className="text-sm text-slate-500 mt-2">The AI is working its magic. Please wait.</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow">
          <h3 className="font-semibold text-lg mb-1">Generation Error</h3>
          <p>{error.message}</p>
          {error.details && <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">{error.details}</pre>}
        </div>
      )}

      {diagramData && !isLoading && (
        <div className="space-y-4">
          <DiagramDisplay 
            data={diagramData} 
            originalQuestion={currentPrompt} 
            addNotification={addNotification}
          />
        </div>
      )}
      
      {!diagramData && !isLoading && !error && (
         <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg text-center min-h-[200px] flex flex-col justify-center items-center">
            <LightBulbIcon className="w-12 h-12 text-primary-400 mb-3" />
            <p className="text-slate-600 text-lg">Your generated diagram will appear here.</p>
            <p className="text-slate-500 text-sm">Enter a prompt above and click "Generate Diagram".</p>
        </div>
      )}
    </div>
  );
};

export default DiagramGeneratorStandalonePage;