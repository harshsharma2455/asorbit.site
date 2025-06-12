import React, { useEffect, useRef, useState } from 'react';
import type { QuestionItem, AppError, NotificationFunction } from '../../types';
import { DiagramDisplay } from './DiagramDisplay';
import LoadingSpinner from '../core/LoadingSpinner';
import Card from '../ui/Card';
import InteractiveButton from '../ui/InteractiveButton';
import Tooltip from '../ui/Tooltip';
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
  addNotification: NotificationFunction;
}

export const QuestionPaperItem: React.FC<QuestionPaperItemProps> = ({
  questionItem,
  questionNumber,
  onGenerateDiagramClick,
  onDeleteClick,
  onUpdateText, 
  onDeleteDiagram,
  onRegenerateDiagram,
  addNotification,
}) => {
  const { id, text, category, marks, diagramData, isLoadingDiagram, diagramError, diagramOriginalQuestionPrompt, isDiagramRecommended } = questionItem;

  const [editText, setEditText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
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
    <Card 
      variant="elevated" 
      padding="none" 
      className="overflow-hidden animate-fade-in-up border-l-4 border-l-primary-500"
      hoverable
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 px-6 py-4 border-b border-slate-200">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-grow">
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="text-xl font-bold text-primary-700 flex items-center space-x-2">
                <span className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {questionNumber}
                </span>
                <span>Question {questionNumber}</span>
              </h4>
              
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  {category}
                </span>
                <span className="px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                  {marks} Marks
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Tooltip content="Collapse/Expand">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200"
              >
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </Tooltip>
            
            {onUpdateText && !isEditing && (
              <Tooltip content="Edit Question">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200"
                >
                  <EditIcon />
                </button>
              </Tooltip>
            )}
            
            <Tooltip content="Delete Question">
              <button
                onClick={onDeleteClick}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
              >
                <TrashIcon />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Question Text */}
          <div className="space-y-4">
            {isEditing && onUpdateText ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Edit Question Text:
                </label>
                <textarea
                  value={editText}
                  onChange={handleTextChange}
                  rows={Math.max(3, editText.split('\n').length + 2)} 
                  className="interactive-input w-full p-4 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-slate-50 text-slate-800 placeholder-slate-400 resize-none"
                  autoFocus
                  placeholder="Enter question text (Markdown for tables, $LaTeX$ for math)..."
                />
                <div className="flex space-x-3">
                  <InteractiveButton 
                    onClick={handleSaveText} 
                    variant="primary" 
                    size="sm"
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>}
                  >
                    Save Changes
                  </InteractiveButton>
                  <InteractiveButton 
                    onClick={handleCancelEdit} 
                    variant="outline" 
                    size="sm"
                  >
                    Cancel
                  </InteractiveButton>
                </div>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <div
                  ref={contentRef}
                  className="text-slate-700 text-base leading-relaxed question-content-display bg-slate-50 p-4 rounded-xl border border-slate-200"
                  dangerouslySetInnerHTML={{ __html: markdownTableToHtml(text) }}
                />
              </div>
            )}
          </div>

          {/* Diagram Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold text-slate-700 flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Diagram</span>
              </h5>
              
              {(diagramData || diagramError) && !isLoadingDiagram && (
                <div className="flex space-x-2">
                  <Tooltip content="Regenerate Diagram">
                    <button
                      onClick={() => onRegenerateDiagram(id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                    >
                      <RedoIcon className="w-4 h-4" />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Delete Diagram">
                    <button
                      onClick={() => onDeleteDiagram(id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>

            <div className="relative">
              {isLoadingDiagram && (
                <div className="diagram-loading-container">
                  <LoadingSpinner size="medium" text="Generating Diagram..." variant="default" />
                </div>
              )}

              {!isLoadingDiagram && diagramData && (
                <div className="animate-fade-in">
                  <DiagramDisplay 
                    data={diagramData} 
                    originalQuestion={diagramOriginalQuestionPrompt || editText} 
                    addNotification={addNotification}
                  />
                </div>
              )}

              {!isLoadingDiagram && diagramError && !diagramData?.errorParsing && (
                <Card variant="default" className="border-red-200 bg-red-50">
                  <div className="flex items-center space-x-3 text-red-700">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold">Diagram Generation Failed</p>
                      <p className="text-sm">{diagramError.message}</p>
                    </div>
                  </div>
                </Card>
              )}

              {!isLoadingDiagram && !diagramData && !diagramError && (
                <Card variant="glass" className="text-center py-8">
                  <div className="space-y-3">
                    <svg className="w-12 h-12 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {isDiagramRecommended ? (
                      <div>
                        <p className="text-amber-600 font-medium">AI recommends a diagram for this question</p>
                        <p className="text-slate-500 text-sm">Click below to generate one</p>
                      </div>
                    ) : (
                      <p className="text-slate-500">No diagram generated yet</p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
            <InteractiveButton
              onClick={onGenerateDiagramClick}
              disabled={isLoadingDiagram}
              loading={isLoadingDiagram}
              variant="primary"
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>}
            >
              {diagramData && !diagramData.errorParsing ? 'Refine Diagram' : 'Generate Diagram'}
            </InteractiveButton>
            
            {isDiagramRecommended && !diagramData && (
              <span className="inline-flex items-center px-3 py-2 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Recommended
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuestionPaperItem;