import React, { useState, useCallback } from 'react';
import { GeminiService } from '../services'; 
import type { DiagramData, AppError } from '../types';
import { DiagramPromptInput } from '../components/features/QuestionInput';
import { DiagramDisplay } from '../components/features/DiagramDisplay';
import LoadingSpinner from '../components/core/LoadingSpinner'; 
import { LightBulbIcon, ShapesIcon, API_KEY_ERROR_MESSAGE, RedoIcon } from '../config';

interface DiagramGeneratorStandalonePageProps {
  geminiService: GeminiService;
  setGlobalError: (error: string | null) => void;
}

const DiagramGeneratorStandalonePage: React.FC<DiagramGeneratorStandalonePageProps> = ({ geminiService, setGlobalError }) => {
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
      }
    } catch (err: any) {
      if (err.message === API_KEY_ERROR_MESSAGE) {
        setGlobalError(API_KEY_ERROR_MESSAGE);
      } else {
        setError({ message: err.message || "An unknown error occurred during diagram generation." });
      }
    } finally {
      setIsLoading(false);
    }
  }, [geminiService, setGlobalError]);

  const handleRegenerate = () => {
    if (currentPrompt) {
      handleGenerateDiagram(currentPrompt);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center space-x-3 mb-4">
          <ShapesIcon /> 
          <span>AI Diagram Generator</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your textual descriptions into 2D diagrams for math and science concepts with advanced AI technology.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <DiagramPromptInput
          onSubmit={handleGenerateDiagram}
          isLoading={isLoading}
          initialValue={currentPrompt}
          submitButtonText="Generate Diagram"
          placeholderText="e.g., A cone of radius 5cm and height 12cm mounted on a hemisphere of the same radius."
          labelText="Enter prompt for diagram generation:"
        />
      </div>
      
      {/* Regenerate Button */}
      {(diagramData || error) && !isLoading && (
         <div className="flex justify-center">
            <button
              onClick={handleRegenerate}
              disabled={isLoading || !currentPrompt}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <RedoIcon className="w-5 h-5" />
              <span>Regenerate Diagram</span>
            </button>
          </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
          <LoadingSpinner size="large" text="Generating Diagram..." />
          <p className="text-gray-500 mt-4">The AI is working its magic. Please wait.</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Error</h3>
              <p className="text-red-700">{error.message}</p>
              {error.details && (
                <details className="mt-3">
                  <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">Show technical details</summary>
                  <pre className="mt-2 text-xs bg-red-50 p-3 rounded border border-red-200 overflow-x-auto whitespace-pre-wrap text-red-700">{error.details}</pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Diagram Display */}
      {diagramData && !isLoading && (
        <div className="space-y-6">
          <DiagramDisplay 
            data={diagramData} 
            originalQuestion={currentPrompt}
            showDownloadButton={true}
          />
        </div>
      )}
      
      {/* Empty State */}
      {!diagramData && !isLoading && !error && (
         <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <LightBulbIcon className="w-16 h-16 text-gray-400 mb-6 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your generated diagram will appear here</h3>
            <p className="text-gray-500">Enter a prompt above and click "Generate Diagram" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default DiagramGeneratorStandalonePage;