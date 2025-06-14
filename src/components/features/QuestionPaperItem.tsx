import React, { useEffect, useRef } from 'react';
import type { QuestionItem, AppError } from '../../types';
import { DiagramDisplay } from './DiagramDisplay';
import LoadingSpinner from '../core/LoadingSpinner';
import { TrashIcon, RedoIcon, XCircleIcon } from '../../config'; 
import { markdownTableToHtml } from '../../utils';

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
    </svg>
);

declare global {
  interface Window {
    MathJax?: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      startup?: {
        promise: Promise<void>;
      };
    };
  }
}

interface QuestionPaperItemProps {
  questionItem: QuestionItem;
  questionNumber: number;
  onGenerateDiagramClick: () => void; 
  onDeleteClick: () => void; 
  onUpdateText?: (newText: string) => void; 
  onDeleteDiagram: (questionId: string) => void; 
  onRegenerateDiagram: (questionId: string) => void; 
}

export const QuestionPaperItem: React.FC<QuestionPaperItemProps> = ({
  questionItem,
  questionNumber,
  onGenerateDiagramClick,
  onDeleteClick,
  onUpdateText, 
  onDeleteDiagram,
  onRegenerateDiagram,
}) => {
  const { id, text, category, marks, diagramData, isLoadingDiagram, diagramError, diagramOriginalQuestionPrompt, isDiagramRecommended } = questionItem;

  const [editText, setEditText] = React.useState(text);
  const [isEditing, setIsEditing] = React.useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEditing) {
        setEditText(text);
    }
  }, [text, isEditing]);

  useEffect(() => {
    if (contentRef.current && !isEditing) { 
      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        const typeset = () => {
          window.MathJax!.typesetPromise([contentRef.current!])
            .catch((err) => console.error('MathJax typesetPromise failed:', err));
        };
        if (window.MathJax.startup?.promise) {
          window.MathJax.startup.promise.then(typeset);
        } else {
          typeset();
        }
      }
    }
  }, [text, isEditing]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  const handleSaveText = () => {
    if (onUpdateText && editText.trim() !== text) { 
      onUpdateText(editText.trim());
    }
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditText(text); 
    setIsEditing(false);
  };

  return (
    <article aria-labelledby={`question-title-${id}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <header className="flex justify-between items-start gap-4 mb-6">
          <div className="flex-grow">
            <h4 id={`question-title-${id}`} className="text-lg font-semibold text-gray-900 mb-2">
              Q{questionNumber}.
              <span className="ml-2 text-sm font-normal text-gray-500">({category} - {marks} Marks)</span>
            </h4>
            {isEditing && onUpdateText ? (
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={handleTextChange}
                  rows={Math.max(3, editText.split('\n').length + 2)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-gray-800 placeholder-gray-400"
                  autoFocus
                  placeholder="Enter question text (Markdown for tables, $LaTeX$ for math)..."
                />
                <div className="flex space-x-2">
                  <button onClick={handleSaveText} className="px-4 py-2 bg-accent-600 text-white hover:bg-accent-700 rounded-lg transition-colors font-medium">Save</button>
                  <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg transition-colors font-medium">Cancel</button>
                </div>
              </div>
            ) : (
              <div
                ref={contentRef}
                className="text-gray-700 leading-relaxed question-content-display"
                dangerouslySetInnerHTML={{ __html: markdownTableToHtml(text) }}
              />
            )}
          </div>
          <div className="flex flex-col space-y-2 flex-shrink-0">
            <button
              onClick={onDeleteClick}
              aria-label={`Delete question ${questionNumber}`}
              title="Delete Question"
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon />
            </button>
            {onUpdateText && !isEditing && (
               <button
                  onClick={() => setIsEditing(true)}
                  aria-label={`Edit question ${questionNumber} text`}
                  title="Edit Question Text"
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                  <EditIcon />
              </button>
            )}
          </div>
        </header>

        {/* Diagram Section - Only show if there's diagram content or loading */}
        {(isLoadingDiagram || diagramData || diagramError) && (
          <div className="relative group mb-6">
            {/* Loading State */}
            {isLoadingDiagram && (
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <LoadingSpinner size="small" text="Loading Diagram..." />
              </div>
            )}

            {/* Diagram Display */}
            {!isLoadingDiagram && diagramData && (
                <DiagramDisplay data={diagramData} originalQuestion={diagramOriginalQuestionPrompt || editText} />
            )}

            {/* Error State */}
            {!isLoadingDiagram && diagramError && !diagramData?.errorParsing && ( 
                 <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                    <p><span className="font-semibold">Diagram Error:</span> {diagramError.message}</p>
                 </div>
            )}

            {/* Action Buttons */}
            {!isLoadingDiagram && (diagramData || diagramError) && (
                <>
                  <button
                      onClick={() => onDeleteDiagram(id)}
                      title="Delete Diagram"
                      aria-label="Delete diagram for this question"
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 z-30 border border-gray-200"
                  >
                      <XCircleIcon className="w-4 h-4" />
                  </button>
                  <button
                      onClick={() => onRegenerateDiagram(id)}
                      title="Regenerate Diagram"
                      aria-label="Regenerate diagram for this question"
                      className="absolute top-2 right-12 p-2 bg-white/90 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 z-30 border border-gray-200"
                  >
                      <RedoIcon className="w-4 h-4" />
                  </button>
                </>
            )}
          </div>
        )}

        {/* Status Messages */}
        {!diagramData && !isLoadingDiagram && !diagramError && isDiagramRecommended && (
           <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg mb-6">
             <p className="text-sm font-medium">AI recommends a diagram for this question.</p>
           </div>
        )}

        {!diagramData && !isLoadingDiagram && !diagramError && !isDiagramRecommended && (
           <div className="p-4 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg mb-6">
             <p className="text-sm">No diagram generated yet. You can generate one if needed.</p>
           </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onGenerateDiagramClick}
          disabled={isLoadingDiagram}
          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-all duration-150 ease-in-out disabled:opacity-70 flex items-center justify-center space-x-2"
          title={diagramData && !diagramData.errorParsing ? "Open modal to refine diagram details" : "Open modal to generate diagram"}
        >
          <span>{diagramData && !diagramData.errorParsing ? 'Refine Diagram' : 'Generate Diagram'}</span>
        </button>
      </div>
    </article>
  );
};