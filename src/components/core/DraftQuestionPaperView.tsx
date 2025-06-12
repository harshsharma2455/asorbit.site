import React, { useState } from 'react';
import type { PaperConfiguration, QuestionItem, QuestionCategory, NotificationFunction } from '../../types';
import { QuestionPaperItem } from '../features/QuestionPaperItem'; 
import LoadingSpinner from './LoadingSpinner'; 
import { BookOpenIcon as BookOpenIconFC , CogIcon as CogIconFC, InfoIcon, PlusIcon, ShapesIcon, QUESTION_CONFIG_SECTIONS } from '../../config';

const BookOpenIcon = BookOpenIconFC;
const CogIcon = CogIconFC;


interface DraftQuestionPaperViewProps {
  config: PaperConfiguration;
  questions: QuestionItem[]; 
  isLoadingInitialPhase: boolean; // This now indicates loading of initial *diagrams* after text
  isFinalizing: boolean; 
  onFinalizePaper: () => void; 
  onBackToConfig: () => void;
  onOpenDiagramModal: (questionId: string) => void;
  onDeleteQuestion: (questionId: string) => void;
  onUpdateQuestionText: (questionId: string, newText: string) => void;
  onDeleteDiagram: (questionId: string) => void; 
  onRegenerateDiagram: (questionId: string) => void; 
  onAddCustomQuestionToSection: (text: string, category: QuestionCategory, generateDiagram: boolean) => Promise<void>;
  addNotification: NotificationFunction;
}

export const DraftQuestionPaperView: React.FC<DraftQuestionPaperViewProps> = ({
  config,
  questions,
  isLoadingInitialPhase, // True when initial diagrams are loading
  isFinalizing,
  onFinalizePaper,
  onBackToConfig,
  onOpenDiagramModal,
  onDeleteQuestion,
  onUpdateQuestionText,
  onDeleteDiagram,
  onRegenerateDiagram,
  onAddCustomQuestionToSection,
  addNotification,
}) => {

  const [addingToSection, setAddingToSection] = useState<QuestionCategory | null>(null);
  const [customTextForSection, setCustomTextForSection] = useState<string>('');
  const [generateDiagramForCustomInSection, setGenerateDiagramForCustomInSection] = useState<boolean>(false);
  const [isSubmittingCustomInSection, setIsSubmittingCustomInSection] = useState<boolean>(false);

  const handleOpenAddForm = (category: QuestionCategory) => {
    setAddingToSection(category);
    setCustomTextForSection('');
    setGenerateDiagramForCustomInSection(false);
    setIsSubmittingCustomInSection(false);
  };

  const handleCloseAddForm = () => {
    setAddingToSection(null);
    setCustomTextForSection('');
    setGenerateDiagramForCustomInSection(false);
    setIsSubmittingCustomInSection(false);
  };

  const handleSaveCustomInSection = async () => {
    if (!addingToSection || !customTextForSection.trim()) return;
    setIsSubmittingCustomInSection(true);
    try {
      await onAddCustomQuestionToSection(
        customTextForSection.trim(),
        addingToSection,
        generateDiagramForCustomInSection
      );
      handleCloseAddForm(); 
    } catch (error) {
      console.error("Error adding custom question in section:", error);
      addNotification({
        type: 'error',
        title: 'Failed to Add Question',
        message: 'An error occurred while adding the custom question.',
        duration: 4000
      });
    } finally {
      setIsSubmittingCustomInSection(false);
    }
  };

   if (isFinalizing) { // Show finalizing spinner regardless of questions.length
    return (
      <div className="w-full flex flex-col items-center justify-center p-10 bg-white shadow-xl rounded-lg border border-slate-200 min-h-[400px]">
        <LoadingSpinner size="large" text="Finalizing paper..." />
        <p className="text-slate-500 mt-2 text-center">Converting diagrams to static images. Please wait.</p>
      </div>
    );
  }

  // This condition is for when text generation failed or returned no questions.
  // isLoadingInitialPhase is false here because text generation is complete (or failed).
  if (!isLoadingInitialPhase && questions.length === 0 && !isFinalizing) {
    return (
      <div className="w-full p-6 md:p-8 bg-white shadow-xl rounded-lg border border-slate-200 space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300 pb-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold text-primary-700 flex items-center">
                    <BookOpenIcon /> <span className="ml-2">Draft Question Paper</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Subject: {config.subject} | Grade: {config.grade} | Time: {config.timeDuration} | Max Marks: {config.totalMarks}
                </p>
            </div>
            <button
            onClick={onBackToConfig}
            disabled={isFinalizing}
            className="mt-3 sm:mt-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 transition-colors text-sm flex items-center space-x-2 disabled:opacity-50"
            aria-label="Go back to configuration screen"
            >
            <CogIcon />
            <span>Reconfigure</span>
            </button>
        </header>
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center min-h-[200px] flex flex-col justify-center items-center">
          {InfoIcon && React.cloneElement(InfoIcon, { className: "w-10 h-10 text-slate-400 mb-2" })}
          <p className="text-slate-600 text-lg mt-2">No Questions Generated</p>
          <p className="text-slate-500">The AI did not return any questions for the provided configuration.</p>
          <p className="text-slate-500 mt-1">You can go back and adjust the settings or try generating again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 md:p-8 bg-white shadow-xl rounded-lg border border-slate-200 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary-700 flex items-center">
            <BookOpenIcon /> <span className="ml-2">Draft Question Paper</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Subject: {config.subject} | Grade: {config.grade} | Time: {config.timeDuration} | Max Marks: {config.totalMarks}
          </p>
          <p className="text-xs text-slate-500">Selected Chapters: {config.chapters.join(', ') || 'All (default)'}</p>
        </div>
        <button
          onClick={onBackToConfig}
          disabled={isLoadingInitialPhase || isFinalizing} // Disable if initial diagrams are loading
          className="mt-3 sm:mt-0 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 transition-colors text-sm flex items-center space-x-2 disabled:opacity-50"
          aria-label="Go back to configuration screen"
        >
          <CogIcon />
          <span>Reconfigure</span>
        </button>
      </header>

      {/* This banner shows when initial diagrams are being auto-generated after text is loaded */}
      {(isLoadingInitialPhase && questions.length > 0 && !isFinalizing) && (
        <div className="p-3 my-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-md text-sm flex items-center space-x-2">
            {InfoIcon && React.cloneElement(InfoIcon, {className: "w-5 h-5 text-primary-500 shrink-0"})}
            <span>Auto-generating recommended diagrams for the questions below. This may take a moment. Questions will update as diagrams are ready.</span>
        </div>
      )}
      
      <div className="space-y-6">
        {QUESTION_CONFIG_SECTIONS.map(sectionConfig => {
          const questionsInCategory = questions.filter(q => q.category === sectionConfig.id);
          // Show section if AI was configured for it OR if there are already questions (e.g. custom)
          if ((config.questionCounts.find(qc => qc.category === sectionConfig.id)?.count || 0) > 0 || questionsInCategory.length > 0) { 
            return (
              <section key={sectionConfig.id} aria-labelledby={`section-title-${sectionConfig.id}`}>
                <div className="flex justify-between items-center mt-4 mb-3 border-b pb-2">
                  <h3 id={`section-title-${sectionConfig.id}`} className="text-xl font-semibold text-primary-600">
                    {sectionConfig.label}
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      (Target: {config.questionCounts.find(qc => qc.category === sectionConfig.id)?.count || 0} questions, {sectionConfig.marks} marks each)
                    </span>
                  </h3>
                  <button
                    onClick={() => addingToSection === sectionConfig.id ? handleCloseAddForm() : handleOpenAddForm(sectionConfig.id)}
                    className="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`Add custom question to ${sectionConfig.label}`}
                    title={`Add custom question to ${sectionConfig.label}`}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {addingToSection === sectionConfig.id && (
                  <div className="my-3 p-4 bg-slate-50 border border-slate-200 rounded-lg shadow space-y-3">
                    <textarea
                      value={customTextForSection}
                      onChange={(e) => setCustomTextForSection(e.target.value)}
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded-md focus:ring-primary-500 focus:border-primary-500 placeholder-slate-400 text-sm"
                      placeholder={`Enter custom question text for ${sectionConfig.label}...`}
                      disabled={isSubmittingCustomInSection}
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`generateDiagramCustom-${sectionConfig.id}`}
                        checked={generateDiagramForCustomInSection}
                        onChange={(e) => setGenerateDiagramForCustomInSection(e.target.checked)}
                        className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                        disabled={isSubmittingCustomInSection}
                      />
                      <label htmlFor={`generateDiagramCustom-${sectionConfig.id}`} className="text-sm text-slate-600 flex items-center">
                        <ShapesIcon /> <span className="ml-1.5">Generate Diagram with AI</span>
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveCustomInSection}
                        disabled={!customTextForSection.trim() || isSubmittingCustomInSection}
                        className="px-3 py-1.5 text-xs bg-green-500 text-white hover:bg-green-600 rounded-md transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isSubmittingCustomInSection && <LoadingSpinner size="small" />} 
                        {!isSubmittingCustomInSection && "Save Question"}
                      </button>
                      <button
                        onClick={handleCloseAddForm}
                        disabled={isSubmittingCustomInSection}
                        className="px-3 py-1.5 text-xs bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {questionsInCategory.length > 0 ? (
                    <div className="space-y-4">
                    {questionsInCategory.map((qItem, index) => (
                        <QuestionPaperItem 
                        key={qItem.id}
                        questionItem={qItem}
                        questionNumber={index + 1} 
                        onGenerateDiagramClick={() => onOpenDiagramModal(qItem.id)}
                        onDeleteClick={() => onDeleteQuestion(qItem.id)}
                        onUpdateText={(newText) => onUpdateQuestionText(qItem.id, newText)}
                        onDeleteDiagram={onDeleteDiagram}
                        onRegenerateDiagram={onRegenerateDiagram}
                        addNotification={addNotification}
                        />
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 italic pl-2">
                        {isLoadingInitialPhase ? `Loading diagrams for this section...` : 
                         (config.questionCounts.find(qc => qc.category === sectionConfig.id)?.count || 0) > 0 ? `No AI questions generated for this section, or diagrams are still loading.` :`No questions in this section.`}
                    </p>
                )}
              </section>
            );
          }
          return null;
        })}
      </div>

      {/* Show finalize button if there are questions and not in critical loading states */}
      {(questions.length > 0 || !isLoadingInitialPhase) && ( 
         <div className="mt-8 pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">Review and edit questions. Generate or update diagrams as needed.</p>
            <button
                onClick={onFinalizePaper}
                disabled={isLoadingInitialPhase || isFinalizing || questions.length === 0}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-accent-500 to-green-600 hover:from-accent-600 hover:to-green-700 text-white font-semibold rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Finalize Question Paper
            </button>
        </div>
      )}
    </div>
  );
};