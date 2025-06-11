
import React, { useRef, useEffect } from 'react';
import type { QuestionItem } from '../../types';
import { ShapesIcon as ShapesIconFC, DocumentTextIcon } from '../../config';
import { markdownTableToHtml } from '../../utils';

const ShapesIcon = ShapesIconFC; 
const PLACEHOLDER_NO_DIAGRAM_TEXT = "No diagram applicable or provided.";

// Extend window type for MathJax
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

interface FinalQuestionItemDisplayProps {
  questionItem: QuestionItem;
  questionNumber: number;
}

export const FinalQuestionItemDisplay: React.FC<FinalQuestionItemDisplayProps> = ({
  questionItem,
  questionNumber,
}) => {
  const { text, category, marks, staticDiagramImage } = questionItem;
  const contentRef = useRef<HTMLDivElement>(null);

  const isBase64Image = staticDiagramImage && staticDiagramImage.startsWith('data:image/');
  
  // Textual diagram info (like descriptions or errors) will no longer be displayed in final paper
  // const textualDiagramInfoToDisplay = 
  //   (!isBase64Image && staticDiagramImage && staticDiagramImage.trim() !== "" && staticDiagramImage.trim() !== PLACEHOLDER_NO_DIAGRAM_TEXT) 
  //   ? staticDiagramImage 
  //   : null;

  let questionHtmlContent: string;
  try {
    questionHtmlContent = markdownTableToHtml(text);
  } catch (error) {
    console.error(`[FinalQuestionItemDisplay] Error processing markdown for question ${questionNumber} (ID: ${questionItem.id}):`, error);
    questionHtmlContent = `<p class="text-red-500">Error displaying question text. Please check console.</p>`;
  }

  useEffect(() => {
    if (contentRef.current) {
      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        const typeset = () => {
          window.MathJax!.typesetPromise([contentRef.current!])
            .catch((err) => console.error('MathJax typesetPromise failed in FinalDisplay:', err));
        };
        if (window.MathJax.startup?.promise) {
          window.MathJax.startup.promise.then(typeset);
        } else {
          typeset();
        }
      }
    }
  }, [text]); // Re-run when text changes

  return (
    <article aria-labelledby={`final-q-${questionItem.id}`} className="py-3 print:py-2 break-inside-avoid-page">
      <div className="flex justify-between items-start gap-2 print:gap-1">
        <p className="text-sm font-semibold text-slate-800 print:text-xs flex-shrink-0 mr-2 print:mr-1">
          {questionNumber}.
        </p>
        <div ref={contentRef} className="flex-grow mb-1 question-content-display">
          <div
            className="text-slate-700 text-base leading-relaxed print:text-sm print:leading-normal"
            dangerouslySetInnerHTML={{ __html: questionHtmlContent }} 
          />
        </div>
        <p className="text-xs font-medium text-slate-500 print:text-xxs flex-shrink-0 ml-2 print:ml-1">({marks} Marks)</p>
      </div>

      {isBase64Image && (
        <div className="mt-2 mb-3 pl-4 md:pl-6 print:pl-5">
          <img 
            src={staticDiagramImage} 
            alt={`Diagram for question ${questionNumber}`} 
            className="max-w-full h-auto border border-slate-300 rounded-md shadow-sm mx-auto print:max-w-xs print:shadow-none"
          />
        </div>
      )}
      
      {/* The section for textualDiagramInfoToDisplay has been removed */}
      {/* 
        {textualDiagramInfoToDisplay && ( 
          // This block was removed
        )}
      */}
    </article>
  );
};
