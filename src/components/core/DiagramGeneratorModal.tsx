
import React, { useState, useEffect, useRef } from 'react';
import type { QuestionItem, AppError } from '../../types';
import { DiagramPromptInput } from '../features/QuestionInput';
import { ShapesIcon } from '../../config';

interface DiagramGeneratorModalProps {
  questionItem: QuestionItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, questionId: string) => Promise<void>;
}

export const DiagramGeneratorModal: React.FC<DiagramGeneratorModalProps> = ({
  questionItem,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [prompt, setPrompt] = useState(questionItem.diagramOriginalQuestionPrompt || questionItem.text);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPrompt(questionItem.diagramOriginalQuestionPrompt || questionItem.text);
      setIsGenerating(false);
      setGenerationError(null);
      // Focus management for accessibility
      modalContentRef.current?.focus();
    }
  }, [isOpen, questionItem]);
  
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);


  const handleSubmitPrompt = async (currentPrompt: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      await onSubmit(currentPrompt, questionItem.id);
      // Optionally close modal on success, or let user close.
      // For now, keep it open to show success or error, main page will update.
      // Let's assume onSubmit handles updating the main state, no need to show success message here unless desired.
      // For simplicity, we'll let the main app reflect the change.
      // If there's no error, we can close it.
      // However, onSubmit is async and doesn't return error status directly to here easily.
      // We'll rely on the global state change for UI feedback.
      // If error occurs, it will be set in questionItem.diagramError by parent.
      // This modal's role is primarily to get the prompt and initiate.
    } catch (e: any) {
      setGenerationError(e.message || "An unexpected error occurred during submission.");
    } finally {
      setIsGenerating(false);
      // Design decision: close modal after submission attempt, or keep open?
      // Keeping it open allows user to retry with a modified prompt if it failed.
      // Closing it makes user go back to main screen to see result.
      // Let's keep it open for now, error is handled locally, success updates parent.
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-slate-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagram-modal-title"
      onClick={onClose} // Close if backdrop is clicked
    >
      <div 
        ref={modalContentRef}
        tabIndex={-1} // Make it focusable
        className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-lg space-y-6 transform transition-all duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <header className="flex justify-between items-center">
          <h2 id="diagram-modal-title" className="text-2xl font-semibold text-primary-700 flex items-center">
            <ShapesIcon />
            <span className="ml-2">Generate Diagram</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close diagram generation modal"
            className="p-1 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </header>
        
        <div className="text-sm text-slate-600">
          <p>For question: <strong className="font-medium">"{questionItem.text}"</strong></p>
        </div>

        <DiagramPromptInput
            onSubmit={handleSubmitPrompt}
            isLoading={isGenerating || questionItem.isLoadingDiagram} // Reflect both local and parent loading state
            initialValue={prompt}
            submitButtonText={isGenerating ? "Generating..." : "Generate Diagram"}
            placeholderText="e.g., A cone of radius 5cm and height 12cm..."
            labelText="Edit prompt for diagram (if needed):"
        />

        {generationError && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            <p><span className="font-semibold">Error:</span> {generationError}</p>
          </div>
        )}
        
        {/* Shows the diagram-specific error from the questionItem if it exists and wasn't a local modal error */}
        {questionItem.diagramError && !generationError && (
             <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-md text-sm">
                <p><span className="font-semibold">Last attempt failed:</span> {questionItem.diagramError.message}</p>
                <p>You can try modifying the prompt and generating again.</p>
            </div>
        )}
        {questionItem.diagramData && !questionItem.isLoadingDiagram && !questionItem.diagramError && !generationError && (
            <div className="p-3 bg-green-50 border border-green-300 text-green-700 rounded-md text-sm">
                <p><span className="font-semibold">Diagram updated!</span> You can close this modal to see it, or generate again with a new prompt.</p>
            </div>
        )}

      </div>
    </div>
  );
};
