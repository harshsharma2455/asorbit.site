import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ConfigurationPanel } from './components/core/ConfigurationPanel';
import { DraftQuestionPaperView } from './components/core/DraftQuestionPaperView';
import { FinalQuestionPaperView } from './components/core/FinalQuestionPaperView';
import { DiagramGeneratorModal } from './components/core/DiagramGeneratorModal';
import { DoubtSolverPanel } from './components/features/DoubtSolverPanel';
import LoadingSpinner from './components/core/LoadingSpinner'; 
import { GeminiService as GeminiServiceInternal } from './services'; 
import type { 
  QuestionItem, 
  DiagramData, 
  AppView as PaperGeneratorView, 
  PaperConfiguration, 
  QuestionCategory,
  NotificationFunction,
  DoubtQuery,
  DoubtSolution
} from './types';
import { LightBulbIcon, QUESTION_CONFIG_SECTIONS, API_KEY_ERROR_MESSAGE } from './config'; 
import JXG from 'jsxgraph';

interface NewEducationalAppProps {
  geminiService: GeminiServiceInternal;
  setGlobalError: (error: string | null) => void; 
  globalError?: string | null; 
  onNavigate: (page: 'landing' | 'paperGenerator' | 'diagramGenerator' | 'doubtSolver' | 'dashboard') => void;
  addNotification: NotificationFunction;
  // Future auth props
  isAuthenticated?: boolean;
  userSubscription?: 'free' | 'premium' | 'pro';
  onAuthRequired?: () => void;
}

const NewEducationalApp: React.FC<NewEducationalAppProps> = ({ 
  geminiService, 
  setGlobalError, 
  globalError, 
  onNavigate, 
  addNotification,
  isAuthenticated = false,
  userSubscription = 'free',
  onAuthRequired
}) => {
  const [currentView, setCurrentView] = useState<PaperGeneratorView | 'doubtSolver' | 'dashboard'>('dashboard');
  const [paperConfig, setPaperConfig] = useState<PaperConfiguration | null>(null);
  const [draftQuestions, setDraftQuestions] = useState<QuestionItem[]>([]);
  const [finalQuestions, setFinalQuestions] = useState<QuestionItem[]>([]);
  
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState<boolean>(false);
  const [currentQuestionForModal, setCurrentQuestionForModal] = useState<QuestionItem | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const [isLoadingTextGeneration, setIsLoadingTextGeneration] = useState<boolean>(false);
  const [isLoadingInitialDiagrams, setIsLoadingInitialDiagrams] = useState<boolean>(false);
  const [isFinalizingPaper, setIsFinalizingPaper] = useState<boolean>(false);

  // Doubt solver state
  const [doubtQueries, setDoubtQueries] = useState<DoubtQuery[]>([]);
  const [isLoadingDoubtSolution, setIsLoadingDoubtSolution] = useState<boolean>(false);
  
  // Usage tracking for subscription limits
  const [usageStats, setUsageStats] = useState({
    questionsGenerated: 0,
    diagramsCreated: 0,
    doubtsResolved: 0,
    papersCreated: 0
  });

  useEffect(() => {
    if (typeof JXG !== 'undefined' && JXG.Options) {
      (JXG.Options as any).renderer = 'svg';
      (JXG.Options as any).text.display = 'internal';
    }
  }, []);

  // Subscription limits
  const getSubscriptionLimits = useMemo(() => {
    switch (userSubscription) {
      case 'free':
        return {
          questionsPerDay: 10,
          diagramsPerDay: 5,
          doubtsPerDay: 3,
          papersPerDay: 2,
          features: ['basic_questions', 'simple_diagrams']
        };
      case 'premium':
        return {
          questionsPerDay: 50,
          diagramsPerDay: 25,
          doubtsPerDay: 15,
          papersPerDay: 10,
          features: ['advanced_questions', 'complex_diagrams', 'detailed_solutions', 'export_options']
        };
      case 'pro':
        return {
          questionsPerDay: -1, // unlimited
          diagramsPerDay: -1,
          doubtsPerDay: -1,
          papersPerDay: -1,
          features: ['all_features', 'priority_support', 'custom_templates', 'bulk_operations']
        };
      default:
        return getSubscriptionLimits();
    }
  }, [userSubscription]);

  const checkUsageLimit = useCallback((type: 'questions' | 'diagrams' | 'doubts' | 'papers') => {
    const limits = getSubscriptionLimits;
    const currentUsage = usageStats;
    
    switch (type) {
      case 'questions':
        return limits.questionsPerDay === -1 || currentUsage.questionsGenerated < limits.questionsPerDay;
      case 'diagrams':
        return limits.diagramsPerDay === -1 || currentUsage.diagramsCreated < limits.diagramsPerDay;
      case 'doubts':
        return limits.doubtsPerDay === -1 || currentUsage.doubtsResolved < limits.doubtsPerDay;
      case 'papers':
        return limits.papersPerDay === -1 || currentUsage.papersCreated < limits.papersPerDay;
      default:
        return false;
    }
  }, [getSubscriptionLimits, usageStats]);

  const incrementUsage = useCallback((type: 'questions' | 'diagrams' | 'doubts' | 'papers', count: number = 1) => {
    setUsageStats(prev => ({
      ...prev,
      [`${type}Generated`]: prev[`${type}Generated` as keyof typeof prev] + count
    }));
  }, []);

  const handleConfigurationSubmit = useCallback(async (config: PaperConfiguration) => {
    if (!checkUsageLimit('papers')) {
      addNotification({
        type: 'warning',
        title: 'Usage Limit Reached',
        message: `You've reached your daily limit for paper generation. ${userSubscription === 'free' ? 'Upgrade to Premium for more!' : 'Try again tomorrow.'}`,
        duration: 6000
      });
      if (onAuthRequired && userSubscription === 'free') {
        onAuthRequired();
      }
      return;
    }

    setPaperConfig(config);
    setIsLoadingTextGeneration(true);
    setIsLoadingInitialDiagrams(false);
    setLocalError(null); 
    setGlobalError(null); 
    setDraftQuestions([]); 

    let initialQuestions: QuestionItem[] = [];

    try {
      const aiGeneratedQuestions = await geminiService.generateDraftQuestionPaper(config);
      
      const customQuestionItems: QuestionItem[] = (config.customQuestions || []).map(customQ => {
        const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === customQ.category);
        const marks = sectionConfig ? sectionConfig.marks : 3; 

        return {
          id: crypto.randomUUID(),
          text: customQ.text,
          category: customQ.category,
          marks: marks,
          isDiagramRecommended: customQ.generateDiagram || false, 
          diagramData: null,
          isLoadingDiagram: customQ.generateDiagram || false, 
          diagramError: null,
          diagramOriginalQuestionPrompt: customQ.text, 
        };
      });
      
      initialQuestions = [...aiGeneratedQuestions, ...customQuestionItems];
      setDraftQuestions(initialQuestions); 
      setCurrentView('draft'); 

      // Track usage
      incrementUsage('questions', initialQuestions.length);
      incrementUsage('papers', 1);

      addNotification({
        type: 'success',
        title: 'Draft Generated',
        message: `Successfully generated ${initialQuestions.length} questions for your paper.`,
        duration: 4000
      });

    } catch (error) { 
      if (error instanceof Error) {
        if (error.message === API_KEY_ERROR_MESSAGE) {
          setGlobalError(error.message);
        } else {
          setLocalError(`Error during draft text generation: ${error.message}. Please check console or try adjusting configuration.`);
          addNotification({
            type: 'error',
            title: 'Generation Failed',
            message: error.message,
            duration: 6000
          });
        }
      } else {
        setLocalError("An unknown error occurred while generating the draft question paper text.");
        addNotification({
          type: 'error',
          title: 'Unknown Error',
          message: 'An unexpected error occurred during generation.',
          duration: 6000
        });
      }
      setDraftQuestions(prev => prev.length > 0 ? prev : initialQuestions); 
    } finally {
      setIsLoadingTextGeneration(false); 
    }

    // Auto-generate diagrams for recommended questions
    if (initialQuestions.length > 0 && initialQuestions.some(q => q.isDiagramRecommended && q.isLoadingDiagram)) {
        setIsLoadingInitialDiagrams(true);
        const questionsToProcessForDiagrams = [...initialQuestions];

        for (let i = 0; i < questionsToProcessForDiagrams.length; i++) {
            let question = questionsToProcessForDiagrams[i];
            if (question.isDiagramRecommended && question.isLoadingDiagram) {
                if (!checkUsageLimit('diagrams')) {
                  addNotification({
                    type: 'warning',
                    title: 'Diagram Limit Reached',
                    message: 'Some diagrams were skipped due to usage limits.',
                    duration: 4000
                  });
                  break;
                }

                try {
                    const diagramData = await geminiService.generateDiagramDescription(question.diagramOriginalQuestionPrompt);
                    setDraftQuestions(prevQs => prevQs.map(q => 
                        q.id === question.id ? { ...q, diagramData, isLoadingDiagram: false, diagramError: null } : q
                    ));
                    incrementUsage('diagrams', 1);
                } catch (diagError: any) {
                    const errorMsg = diagError.message || 'Auto-diagram generation failed';
                    const errorDiagramData: DiagramData = {
                        diagramTitle: "Error During Diagram Generation", elements: [], geometricElements: [],
                        description: `Failed to generate diagram: ${errorMsg}`,
                        representationType: 'text_only', errorParsing: true, 
                    };
                    setDraftQuestions(prevQs => prevQs.map(q => 
                        q.id === question.id ? { ...q, diagramData: errorDiagramData, diagramError: { message: errorMsg }, isLoadingDiagram: false } : q
                    ));
                }
            }
        }
        setIsLoadingInitialDiagrams(false);
    }

  }, [geminiService, setGlobalError, addNotification, checkUsageLimit, incrementUsage, userSubscription, onAuthRequired]); 

  const handleBackToConfig = useCallback(() => {
    setCurrentView('config');
    setPaperConfig(null);
    setDraftQuestions([]);
    setFinalQuestions([]);
    setLocalError(null); 
    setGlobalError(null);
    setIsLoadingTextGeneration(false);
    setIsLoadingInitialDiagrams(false);
  }, [setGlobalError]);
  
  const handleBackToDraft = useCallback(() => {
    setCurrentView('draft');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentView('dashboard');
    setPaperConfig(null);
    setDraftQuestions([]);
    setFinalQuestions([]);
    setLocalError(null);
    setGlobalError(null);
  }, [setGlobalError]);

  const openDiagramModal = useCallback((questionId: string) => {
    const question = draftQuestions.find(q => q.id === questionId);
    if (question) {
      setCurrentQuestionForModal(question);
      setIsDiagramModalOpen(true);
    }
  }, [draftQuestions]);

  const closeDiagramModal = useCallback(() => {
    setIsDiagramModalOpen(false);
    setCurrentQuestionForModal(null);
  }, []);

  const handleGenerateDiagramForQuestion = useCallback(async (prompt: string, questionId: string) => {
    if (!checkUsageLimit('diagrams')) {
      addNotification({
        type: 'warning',
        title: 'Diagram Limit Reached',
        message: `You've reached your daily limit for diagram generation. ${userSubscription === 'free' ? 'Upgrade to Premium for more!' : 'Try again tomorrow.'}`,
        duration: 6000
      });
      return;
    }

    setDraftQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, isLoadingDiagram: true, diagramError: null, diagramData: null, diagramOriginalQuestionPrompt: prompt } : q
    ));
    try {
      const data = await geminiService.generateDiagramDescription(prompt);
      setDraftQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, diagramData: data, isLoadingDiagram: false } : q
      ));
      incrementUsage('diagrams', 1);
      addNotification({
        type: 'success',
        title: 'Diagram Generated',
        message: 'Successfully created diagram for your question.',
        duration: 3000
      });
    } catch (err) {
      let message = 'An unknown error occurred during diagram generation.';
      if (err instanceof Error) {
        message = `Failed to generate diagram: ${err.message}`;
      }
      const errorDiagramData: DiagramData = { 
        diagramTitle: "Error Generating Diagram", elements: [], geometricElements: [],
        description: message, representationType: 'text_only', errorParsing: true,
      };
      setDraftQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, diagramError: { message }, diagramData: errorDiagramData, isLoadingDiagram: false } : q
      ));
      addNotification({
        type: 'error',
        title: 'Diagram Generation Failed',
        message: message,
        duration: 5000
      });
    }
  }, [geminiService, addNotification, checkUsageLimit, incrementUsage, userSubscription]);

  // Doubt solving functionality
  const handleSubmitDoubt = useCallback(async (doubtText: string, subject?: string, attachedImage?: string) => {
    if (!checkUsageLimit('doubts')) {
      addNotification({
        type: 'warning',
        title: 'Doubt Limit Reached',
        message: `You've reached your daily limit for doubt resolution. ${userSubscription === 'free' ? 'Upgrade to Premium for more!' : 'Try again tomorrow.'}`,
        duration: 6000
      });
      if (onAuthRequired && userSubscription === 'free') {
        onAuthRequired();
      }
      return;
    }

    const newDoubtId = crypto.randomUUID();
    const newDoubt: DoubtQuery = {
      id: newDoubtId,
      question: doubtText,
      subject: subject || 'General',
      timestamp: new Date(),
      status: 'pending',
      attachedImage
    };

    setDoubtQueries(prev => [newDoubt, ...prev]);
    setIsLoadingDoubtSolution(true);

    try {
      const solution = await geminiService.solveDoubt(doubtText, subject, attachedImage);
      
      setDoubtQueries(prev => prev.map(doubt => 
        doubt.id === newDoubtId 
          ? { ...doubt, solution, status: 'resolved' }
          : doubt
      ));

      incrementUsage('doubts', 1);

      addNotification({
        type: 'success',
        title: 'Doubt Resolved',
        message: 'Your doubt has been successfully resolved!',
        duration: 4000
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resolve doubt';
      
      setDoubtQueries(prev => prev.map(doubt => 
        doubt.id === newDoubtId 
          ? { ...doubt, status: 'failed', solution: { explanation: errorMessage, steps: [], relatedConcepts: [] } }
          : doubt
      ));

      addNotification({
        type: 'error',
        title: 'Doubt Resolution Failed',
        message: errorMessage,
        duration: 5000
      });
    } finally {
      setIsLoadingDoubtSolution(false);
    }
  }, [geminiService, addNotification, checkUsageLimit, incrementUsage, userSubscription, onAuthRequired]);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setDraftQuestions(prev => prev.filter(q => q.id !== questionId));
    addNotification({
      type: 'info',
      title: 'Question Deleted',
      message: 'Question has been removed from your paper.',
      duration: 3000
    });
  }, [addNotification]);
  
  const handleUpdateQuestionText = useCallback((questionId: string, newText: string) => {
    setDraftQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, text: newText, diagramOriginalQuestionPrompt: newText } : q 
    ));
    addNotification({
      type: 'success',
      title: 'Question Updated',
      message: 'Question text has been successfully updated.',
      duration: 3000
    });
  }, [addNotification]);

  const handleDeleteDiagram = useCallback((questionId: string) => {
    setDraftQuestions(prev => prev.map(q =>
      q.id === questionId ? { 
        ...q, 
        diagramData: null, 
        diagramError: null, 
        isLoadingDiagram: false,
        isDiagramRecommended: false, 
      } : q
    ));
    addNotification({
      type: 'info',
      title: 'Diagram Removed',
      message: 'Diagram has been deleted from the question.',
      duration: 3000
    });
  }, [addNotification]);

  const handleRegenerateDiagram = useCallback(async (questionId: string) => {
    if (!checkUsageLimit('diagrams')) {
      addNotification({
        type: 'warning',
        title: 'Diagram Limit Reached',
        message: 'Cannot regenerate diagram due to usage limits.',
        duration: 4000
      });
      return;
    }

    const questionToRegenerate = draftQuestions.find(q => q.id === questionId);
    if (!questionToRegenerate) return;
    const promptForRegeneration = questionToRegenerate.diagramOriginalQuestionPrompt || questionToRegenerate.text;
    setDraftQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, isLoadingDiagram: true, diagramError: null, diagramData: null, isDiagramRecommended: true } : q
    ));
    try {
      const data = await geminiService.generateDiagramDescription(promptForRegeneration);
      setDraftQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, diagramData: data, isLoadingDiagram: false } : q
      ));
      incrementUsage('diagrams', 1);
      addNotification({
        type: 'success',
        title: 'Diagram Regenerated',
        message: 'Successfully created a new diagram for your question.',
        duration: 3000
      });
    } catch (err) {
      let message = 'An unknown error occurred during diagram regeneration.';
      if (err instanceof Error) message = `Failed to regenerate diagram: ${err.message}`;
      const errorDiagramData: DiagramData = {
        diagramTitle: "Error Regenerating Diagram", elements: [], geometricElements: [],
        description: message, representationType: 'text_only', errorParsing: true,
      };
      setDraftQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, diagramError: { message }, diagramData: errorDiagramData, isLoadingDiagram: false } : q
      ));
      addNotification({
        type: 'error',
        title: 'Regeneration Failed',
        message: message,
        duration: 5000
      });
    }
  }, [geminiService, draftQuestions, addNotification, checkUsageLimit, incrementUsage]);

  const handleAddCustomQuestionToSection = useCallback(
    async (text: string, category: QuestionCategory, generateDiagram: boolean) => {
      if (!checkUsageLimit('questions')) {
        addNotification({
          type: 'warning',
          title: 'Question Limit Reached',
          message: 'Cannot add more questions due to usage limits.',
          duration: 4000
        });
        return;
      }

      const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === category);
      const marks = sectionConfig ? sectionConfig.marks : 3;
      const newQuestionId = crypto.randomUUID();
      const newQuestion: QuestionItem = {
        id: newQuestionId, text, category, marks,
        isDiagramRecommended: generateDiagram, diagramData: null,
        isLoadingDiagram: generateDiagram, diagramError: null,
        diagramOriginalQuestionPrompt: text,
      };
      setDraftQuestions(prev => [...prev, newQuestion]);
      
      incrementUsage('questions', 1);
      
      addNotification({
        type: 'success',
        title: 'Question Added',
        message: 'Custom question has been added to your paper.',
        duration: 3000
      });

      if (generateDiagram && checkUsageLimit('diagrams')) {
        try {
          const diagramData = await geminiService.generateDiagramDescription(text);
          setDraftQuestions(prev => prev.map(q =>
            q.id === newQuestionId ? { ...q, diagramData, isLoadingDiagram: false, diagramError: null } : q
          ));
          incrementUsage('diagrams', 1);
          addNotification({
            type: 'success',
            title: 'Diagram Generated',
            message: 'Diagram has been created for your custom question.',
            duration: 3000
          });
        } catch (diagError: any) {
          const errorMsg = diagError.message || 'Custom question diagram generation failed';
          const errorDiagramData: DiagramData = {
            diagramTitle: "Error During Custom Diagram Generation", elements: [], geometricElements: [],
            description: `Failed to generate diagram: ${errorMsg}`,
            representationType: 'text_only', errorParsing: true,
          };
          setDraftQuestions(prev => prev.map(q =>
            q.id === newQuestionId ? { ...q, diagramData: errorDiagramData, diagramError: { message: errorMsg }, isLoadingDiagram: false } : q
          ));
          addNotification({
            type: 'warning',
            title: 'Diagram Generation Failed',
            message: 'Question added but diagram generation failed.',
            duration: 4000
          });
        }
      }
    }, [geminiService, addNotification, checkUsageLimit, incrementUsage]
  );

  // Finalize paper logic (simplified for brevity)
  const handleFinalizePaper = useCallback(async () => {
    if (!draftQuestions.length) {
      setLocalError("No questions in the draft to finalize.");
      return;
    }
    setIsFinalizingPaper(true);
    setLocalError(null);
    setGlobalError(null);
    
    addNotification({
      type: 'info',
      title: 'Finalizing Paper',
      message: 'Converting diagrams to static images. This may take a moment...',
      duration: 4000
    });

    // Simplified finalization - in real implementation, convert diagrams to static images
    const finalizedQuestions = draftQuestions.map(q => ({
      ...q,
      staticDiagramImage: q.diagramData ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzMzNzNkYyIvPjwvc3ZnPg==' : undefined
    }));

    setFinalQuestions(finalizedQuestions);
    setCurrentView('final');
    setIsFinalizingPaper(false);
    
    addNotification({
      type: 'success',
      title: 'Paper Finalized',
      message: `Successfully finalized your question paper with ${finalizedQuestions.length} questions.`,
      duration: 4000
    });
  }, [draftQuestions, setGlobalError, addNotification]);

  if (localError && !globalError) { 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-yellow-50 text-yellow-700" role="alert">
        <LightBulbIcon className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="text-3xl font-bold mb-4">Application Notice</h1>
        <p className="text-lg">{localError}</p>
        <button 
            onClick={() => { setLocalError(null); handleBackToDashboard(); }} 
            className="mt-6 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md transition-colors"
        >
            Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col space-y-8">
      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <div className="space-y-8">
          {/* Usage Stats Card */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Your Usage Today</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{usageStats.questionsGenerated}</div>
                <div className="text-sm opacity-90">Questions Generated</div>
                <div className="text-xs opacity-75">
                  {getSubscriptionLimits.questionsPerDay === -1 ? 'Unlimited' : `${getSubscriptionLimits.questionsPerDay - usageStats.questionsGenerated} left`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{usageStats.diagramsCreated}</div>
                <div className="text-sm opacity-90">Diagrams Created</div>
                <div className="text-xs opacity-75">
                  {getSubscriptionLimits.diagramsPerDay === -1 ? 'Unlimited' : `${getSubscriptionLimits.diagramsPerDay - usageStats.diagramsCreated} left`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{usageStats.doubtsResolved}</div>
                <div className="text-sm opacity-90">Doubts Resolved</div>
                <div className="text-xs opacity-75">
                  {getSubscriptionLimits.doubtsPerDay === -1 ? 'Unlimited' : `${getSubscriptionLimits.doubtsPerDay - usageStats.doubtsResolved} left`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{usageStats.papersCreated}</div>
                <div className="text-sm opacity-90">Papers Created</div>
                <div className="text-xs opacity-75">
                  {getSubscriptionLimits.papersPerDay === -1 ? 'Unlimited' : `${getSubscriptionLimits.papersPerDay - usageStats.papersCreated} left`}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => setCurrentView('config')}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-primary-500"
            >
              <div className="text-primary-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Create Question Paper</h3>
              <p className="text-slate-600">Generate comprehensive question papers with AI assistance</p>
            </button>

            <button
              onClick={() => setCurrentView('doubtSolver')}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-accent-500"
            >
              <div className="text-accent-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Solve Doubts</h3>
              <p className="text-slate-600">Get instant solutions to your academic questions</p>
            </button>

            <button
              onClick={() => onNavigate('diagramGenerator')}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-l-4 border-yellow-500"
            >
              <div className="text-yellow-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Generate Diagrams</h3>
              <p className="text-slate-600">Create visual diagrams from text descriptions</p>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-700 mb-4">Recent Doubts</h3>
            {doubtQueries.length > 0 ? (
              <div className="space-y-3">
                {doubtQueries.slice(0, 3).map(doubt => (
                  <div key={doubt.id} className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <p className="text-slate-700 font-medium">{doubt.question.substring(0, 100)}...</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doubt.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        doubt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {doubt.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{doubt.timestamp.toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No doubts resolved yet. Start by asking a question!</p>
            )}
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      {currentView === 'config' && !isLoadingTextGeneration && !isFinalizingPaper && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-800">Create Question Paper</h1>
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
          <ConfigurationPanel 
            onSubmit={handleConfigurationSubmit} 
            isLoading={isLoadingTextGeneration} 
          />
        </div>
      )}

      {/* Doubt Solver Panel */}
      {currentView === 'doubtSolver' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-800">Doubt Solver</h1>
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
          <DoubtSolverPanel
            onSubmitDoubt={handleSubmitDoubt}
            doubtQueries={doubtQueries}
            isLoading={isLoadingDoubtSolution}
            usageLimit={getSubscriptionLimits.doubtsPerDay}
            currentUsage={usageStats.doubtsResolved}
            userSubscription={userSubscription}
            onUpgradeRequired={onAuthRequired}
          />
        </div>
      )}

      {/* Loading States */}
      {(isLoadingTextGeneration || isFinalizingPaper) && (currentView === 'config' || currentView === 'draft') && (
           <div className="w-full flex flex-col items-center justify-center p-10 bg-white shadow-xl rounded-lg border border-slate-200 min-h-[400px]">
              <LoadingSpinner 
                size="large"
                text={isLoadingTextGeneration ? "Generating your draft question paper text..." : "Finalizing your question paper..."}
              />
              <p className="text-slate-500 mt-2 text-center">
                  {isLoadingTextGeneration ? "The AI is crafting questions." : "Converting diagrams to static images."} This may take some time.
              </p>
          </div>
      )}

      {/* Draft View */}
      {currentView === 'draft' && paperConfig && !isFinalizingPaper && !isLoadingTextGeneration && ( 
        <DraftQuestionPaperView
          config={paperConfig}
          questions={draftQuestions}
          isLoadingInitialPhase={isLoadingInitialDiagrams} 
          isFinalizing={isFinalizingPaper}
          onFinalizePaper={handleFinalizePaper}
          onBackToConfig={handleBackToConfig}
          onOpenDiagramModal={openDiagramModal}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestionText={handleUpdateQuestionText}
          onDeleteDiagram={handleDeleteDiagram}
          onRegenerateDiagram={handleRegenerateDiagram}
          onAddCustomQuestionToSection={handleAddCustomQuestionToSection}
          addNotification={addNotification}
        />
      )}

      {/* Final View */}
      {currentView === 'final' && paperConfig && ( 
          <FinalQuestionPaperView
              config={paperConfig}
              questions={finalQuestions}
              isFinalizing={isFinalizingPaper} 
              onBackToDraft={handleBackToDraft}
              onStartNewPaper={handleBackToDashboard}
          />
      )}
      
      {/* Diagram Modal */}
      {isDiagramModalOpen && currentQuestionForModal && currentView === 'draft' && (
        <DiagramGeneratorModal
          questionItem={currentQuestionForModal}
          isOpen={isDiagramModalOpen}
          onClose={closeDiagramModal}
          onSubmit={handleGenerateDiagramForQuestion}
        />
      )}
    </div>
  );
};

export default NewEducationalApp;