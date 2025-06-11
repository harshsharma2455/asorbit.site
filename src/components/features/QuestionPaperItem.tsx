import React, { useEffect, useRef } from 'react';
import type { QuestionItem, AppError } from '../../types';
import { DiagramDisplay } from './DiagramDisplay';
import LoadingSpinner from '../core/LoadingSpinner'; // Import new loader
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
    <article aria-labelledby={`question-title-${id}`} className="p-6 bg-white shadow-lg rounded-lg border border-slate-200 space-y-4">
      <header className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <h4 id={`question-title-${id}`} className="text-lg font-semibold text-primary-700 mb-1">
            Q{questionNumber}.
            <span className="ml-2 text-sm font-normal text-slate-500">({category} - {marks} Marks)</span>
          </h4>
          {isEditing && onUpdateText ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={handleTextChange}
                rows={Math.max(3, editText.split('\n').length + 2)} 
                className="w-full p-2 border border-primary-300 rounded-md focus:ring-2 focus:ring-primary-500 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm"
                autoFocus
                placeholder="Enter question text (Markdown for tables, $LaTeX$ for math)..."
              />
              <div className="flex space-x-2">
                <button onClick={handleSaveText} className="px-3 py-1 text-xs bg-accent-500 text-white hover:bg-accent-600 rounded-md transition-colors">Save</button>
                <button onClick={handleCancelEdit} className="px-3 py-1 text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <div
              ref={contentRef}
              className="text-slate-700 text-base leading-relaxed question-content-display"
              dangerouslySetInnerHTML={{ __html: markdownTableToHtml(text) }}
            />
          )}
        </div>
        <div className="flex flex-col space-y-2 flex-shrink-0">
          <button
            onClick={onDeleteClick}
            aria-label={`Delete question ${questionNumber}`}
            title="Delete Question"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
          >
            <TrashIcon />
          </button>
          {onUpdateText && !isEditing && (
             <button
                onClick={() => setIsEditing(true)}
                aria-label={`Edit question ${questionNumber} text`}
                title="Edit Question Text"
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-100 rounded-md transition-colors"
            >
                <EditIcon />
            </button>
          )}
        </div>
      </header>

      <div className="pl-1 space-y-3">
        <div className="relative group diagram-loading-container"> 
            {isLoadingDiagram && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 z-20 rounded-md">
                 <LoadingSpinner size="small" text="Loading Diagram..." />
              </div>
            )}

            {!isLoadingDiagram && diagramData && (
                <DiagramDisplay data={diagramData} originalQuestion={diagramOriginalQuestionPrompt || editText} />
            )}
            {!isLoadingDiagram && diagramError && !diagramData?.errorParsing && ( 
                 <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm min-h-[150px] flex items-center justify-center w-full">
                    <p><span className="font-semibold">Diagram Error:</span> {diagramError.message}</p>
                 </div>
            )}


            {!isLoadingDiagram && (diagramData || diagramError) && (
                <button
                    onClick={() => onDeleteDiagram(id)}
                    title="Delete Diagram"
                    aria-label="Delete diagram for this question"
                    className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-red-100 text-slate-600 hover:text-red-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 z-30"
                >
                    <XCircleIcon className="w-5 h-5" />
                </button>
            )}
            {!isLoadingDiagram && (diagramData || diagramError || (isDiagramRecommended && !diagramData && !diagramError)) && (
                <button
                    onClick={() => onRegenerateDiagram(id)}
                    title="Regenerate Diagram"
                    aria-label="Regenerate diagram for this question"
                    className={`absolute top-2 ${ (diagramData || diagramError) ? 'right-10' : 'right-2' } p-1 bg-white/80 hover:bg-blue-100 text-slate-600 hover:text-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-150 z-30`}
                >
                    <RedoIcon className="w-5 h-5" />
                </button>
            )}
            {!isLoadingDiagram && !diagramData && !diagramError && (
              <div className="min-h-[50px] w-full flex items-center justify-center">
                 {/* This space is intentionally kept for layout consistency if no diagram elements are present,
                     but it's within diagram-loading-container which has its own styling. 
                     The informational messages below handle text feedback.
                 */}
              </div> 
            )}
        </div>

        {!diagramData && !isLoadingDiagram && !diagramError && isDiagramRecommended && (
           <p className="text-sm text-amber-600 italic py-2 px-3 bg-amber-50 border border-amber-200 rounded-md">
             AI recommends a diagram for this question.
           </p>
        )}
         {!diagramData && !isLoadingDiagram && !diagramError && !isDiagramRecommended && (
           <p className="text-sm text-slate-500 italic py-2">No diagram generated yet. You can generate one if needed.</p>
        )}
      </div>

      <footer className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-3 items-center">
        <button
          onClick={onGenerateDiagramClick}
          disabled={isLoadingDiagram}
          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-400 transition-all duration-150 ease-in-out disabled:opacity-70 flex items-center justify-center space-x-2 text-sm"
          title={diagramData && !diagramData.errorParsing ? "Open modal to refine diagram details" : "Open modal to generate diagram"}
        >
          <span>{diagramData && !diagramData.errorParsing ? 'Refine Diagram' : 'Generate Diagram'}</span>
        </button>
      </footer>
    </article>
  );
};