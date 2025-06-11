import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../core/LoadingSpinner'; // Import new loader

interface DiagramPromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  initialValue?: string;
  submitButtonText?: string;
  placeholderText?: string;
  labelText?: string;
}

export const DiagramPromptInput: React.FC<DiagramPromptInputProps> = ({ 
  onSubmit, 
  isLoading, 
  initialValue = '', 
  submitButtonText = "Generate Diagram",
  placeholderText = "e.g., Draw a triangle ABC with a point D on BC...",
  labelText = "Enter prompt for diagram generation:"
}) => {
  const [prompt, setPrompt] = useState<string>(initialValue);

  useEffect(() => {
    setPrompt(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="diagram-prompt" className="block text-md font-medium mb-2 text-slate-700">
        {labelText}
      </label>
      <textarea
        id="diagram-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholderText}
        rows={5}
        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-slate-400 text-slate-700 disabled:opacity-70"
        disabled={isLoading}
        aria-describedby="prompt-description"
      />
      <p id="prompt-description" className="text-xs text-slate-500 mt-1">
        You can modify the question text here to refine the prompt specifically for diagram generation.
      </p>
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-accent-500 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <LoadingSpinner size="small" /> // Using new loader, size="small" might be too small for a button. Default might be better. Let's try without text.
        ) : (
          <span>{submitButtonText}</span>
        )}
      </button>
    </form>
  );
};