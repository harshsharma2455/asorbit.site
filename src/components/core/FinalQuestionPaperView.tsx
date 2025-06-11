import React from 'react';
import type { PaperConfiguration, QuestionItem, QuestionTypeConfig } from '../../types';
import { FinalQuestionItemDisplay } from '../features/FinalQuestionItemDisplay';
import LoadingSpinner from './LoadingSpinner'; // Import new loader
import { BookOpenIcon, CogIcon, FileEarmarkPlusFillIcon, QUESTION_CONFIG_SECTIONS } from '../../config'; 

interface FinalQuestionPaperViewProps {
  config: PaperConfiguration;
  questions: QuestionItem[];
  isFinalizing: boolean; 
  onBackToDraft: () => void;
  onStartNewPaper: () => void;
}

export const FinalQuestionPaperView: React.FC<FinalQuestionPaperViewProps> = ({
  config,
  questions,
  isFinalizing,
  onBackToDraft,
  onStartNewPaper,
}) => {
  const handlePrint = () => {
    window.print();
  };

  if (isFinalizing) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-10 bg-white shadow-xl rounded-lg border border-slate-200 min-h-[400px]">
        <LoadingSpinner size="large" text="Finalizing your question paper..." />
        <p className="text-slate-500 mt-2 text-center">Converting diagrams to static images. This may take a moment.</p>
      </div>
    );
  }
  
  if (!config || (!isFinalizing && questions.length === 0) ) {
     return (
      <div className="w-full p-6 md:p-8 bg-white shadow-xl rounded-lg border border-slate-200 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-primary-700">Final Question Paper</h2>
        <p className="text-slate-600">No question paper data available to display.</p>
        <p className="text-slate-500">Please configure and generate a draft first, then finalize it. Ensure questions were generated or added.</p>
        <button
          onClick={onStartNewPaper}
          className="mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400 transition-colors"
        >
          Start New Paper
        </button>
      </div>
     );
  }

  let globalQuestionNumber = 1;

  return (
    <div className="w-full p-4 md:p-8 bg-white shadow-2xl rounded-lg border border-slate-200 print:shadow-none print:border-none print:p-0">
      <header className="mb-8 print:mb-6">
        <h1 className="text-3xl font-bold text-center text-primary-800 mb-2 print:text-2xl">
          {config.subject} - Grade {config.grade}
        </h1>
        <h2 className="text-xl font-semibold text-center text-slate-700 mb-4 print:text-lg">
          Question Paper
        </h2>
        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-b border-slate-300 py-2 px-1 print:text-xs">
          <span>Time Allowed: {config.timeDuration}</span>
          <span>Maximum Marks: {config.totalMarks}</span>
        </div>
        <div className="mt-4 print:mt-2">
          <h3 className="text-md font-semibold text-slate-700 mb-1 print:text-sm">General Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-slate-600 space-y-0.5 print:text-xs">
            <li>All questions are compulsory.</li>
            <li>Marks for each question are indicated against it.</li>
            <li>Write neatly and legibly.</li>
            {/* Consider adding instructions from config if available */}
          </ol>
        </div>
      </header>

      <main>
        {QUESTION_CONFIG_SECTIONS.map(sectionConfig => {
          try {
            const questionsInSection = questions.filter(
              q => q.category === sectionConfig.id
            );

            if (questionsInSection.length > 0) {
              return (
                <section key={sectionConfig.id} aria-labelledby={`section-title-${sectionConfig.id}`} className="mb-6 print:mb-4">
                  <h3 id={`section-title-${sectionConfig.id}`} className="text-lg font-bold text-primary-700 mt-4 mb-2 border-b-2 border-primary-200 pb-1 print:text-base print:mt-3 print:mb-1.5">
                    {sectionConfig.label}
                  </h3>
                  <div className="space-y-1">
                    {questionsInSection.map((qItem) => (
                      <FinalQuestionItemDisplay
                        key={qItem.id}
                        questionItem={qItem}
                        questionNumber={globalQuestionNumber++}
                      />
                    ))}
                  </div>
                </section>
              );
            }
            return null;
          } catch (error) {
            console.error(`[FinalQuestionPaperView] Error rendering section ${sectionConfig.id}:`, error);
            return (
              <section key={`error-${sectionConfig.id}`} className="mb-6 print:mb-4">
                <h3 className="text-lg font-bold text-red-600 mt-4 mb-2 border-b-2 border-red-200 pb-1 print:text-base">
                  Error Rendering: {sectionConfig.label}
                </h3>
                <p className="text-red-500 text-sm">An error occurred while trying to display this section. Please check the console.</p>
              </section>
            );
          }
        })}
      </main>

      <footer className="mt-8 pt-4 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
        <div className="flex gap-2">
          <button
            onClick={onBackToDraft}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 transition-colors text-sm flex items-center space-x-2"
          >
            <CogIcon />
            <span>Back to Draft</span>
          </button>
          <button
            onClick={onStartNewPaper}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 transition-colors text-sm flex items-center space-x-2"
          >
            <FileEarmarkPlusFillIcon className="w-5 h-5" />
            <span>Start New Paper</span>
          </button>
        </div>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-400 transition-colors text-sm flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.092 1.126.138A2.5 2.5 0 0 1 18.5 8.862v5.276a2.5 2.5 0 0 1-2.374 2.474c-.373.046-.75.092-1.126.138V20.25c0 .966-.784 1.75-1.75 1.75h-6.5A1.75 1.75 0 0 1 5 20.25v-3.552c-.377-.046-.752-.092-1.126-.138A2.5 2.5 0 0 1 1.5 14.138V8.862a2.5 2.5 0 0 1 2.374-2.474c.373-.046.75-.092 1.126-.138V2.75ZM6.5 18.5v-4c0-.414.336-.75.75-.75h5.5a.75.75 0 0 1 .75.75v4h-7ZM6.5 6.5v-3h7v3h-7Z" clipRule="evenodd" />
            <path d="M8.5 15a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Z" />
          </svg>
          <span>Print Paper</span>
        </button>
      </footer>
    </div>
  );
};