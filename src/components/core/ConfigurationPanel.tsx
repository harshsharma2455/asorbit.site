import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { PaperConfiguration, PaperQuestionConfiguration, QuestionCategory, CustomQuestionEntry, QuestionTypeConfig, SyllabusChapterDetail } from '../../types';
import Card from '../ui/Card';
import InteractiveButton from '../ui/InteractiveButton';
import ProgressBar from '../ui/ProgressBar';
import Tooltip from '../ui/Tooltip';
import {
  CBSE_MATH_SYLLABUS_DETAILED,
  CBSE_SCIENCE_10_CHAPTERS,
  SUPPORTED_GRADES,
  SUPPORTED_SUBJECTS,
  QUESTION_CONFIG_SECTIONS,
  CogIcon as CogIconFC,
  BookOpenIcon,
  PlusCircleIcon as PlusCircleIconNode,
  TrashIcon as TrashIconFC,
  InfoIcon,
  ShapesIcon,
} from '../../config';

const TrashIcon = TrashIconFC;
const PlusCircleIcon = PlusCircleIconNode;
const CogIcon = CogIconFC;

interface ConfigurationPanelProps {
  onSubmit: (config: PaperConfiguration) => void;
  isLoading: boolean;
}

const initialQuestionCounts: PaperQuestionConfiguration[] = QUESTION_CONFIG_SECTIONS.map(section => ({
  category: section.id,
  count: 0,
}));

const DEFAULT_CUSTOM_QUESTION_CATEGORY: QuestionCategory = 'ShortAnswer3';

// Helper function to calculate exact AI counts using Dynamic Programming
function calculateExactAiCountsDP(
    marksToFill: number,
    sections: QuestionTypeConfig[]
): { counts: Record<QuestionCategory, number>, achievedMarks: number } {
    const baseCounts = sections.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {} as Record<QuestionCategory, number>);
    if (marksToFill <= 0) {
        return { counts: baseCounts, achievedMarks: 0 };
    }

    const initialCountsForDP = sections.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {} as Record<QuestionCategory, number>);

    let dp = Array(marksToFill + 1).fill(null).map((_, index) => {
        if (index === 0) {
            return {
                counts: { ...initialCountsForDP },
                numQuestionTypesUsed: 0,
                totalQuestions: 0,
                possible: true
            };
        }
        return {
            counts: { ...initialCountsForDP },
            numQuestionTypesUsed: 0,
            totalQuestions: Infinity,
            possible: false
        };
    });

    const relevantSections = sections.filter(s => s.marks > 0).sort((a,b) => a.id.localeCompare(b.id));

    for (let m = 1; m <= marksToFill; m++) {
        for (const section of relevantSections) {
            if (m >= section.marks) {
                const prevSumState = dp[m - section.marks];
                if (prevSumState.possible) {
                    const newCounts = { ...prevSumState.counts };
                    newCounts[section.id]++;

                    const newTotalQuestions = prevSumState.totalQuestions + 1;
                    let newNumQuestionTypesUsed = 0;
                    for (const catId in newCounts) {
                        if (newCounts[catId as QuestionCategory] > 0) {
                            newNumQuestionTypesUsed++;
                        }
                    }

                    if (!dp[m].possible) {
                        dp[m] = {
                            counts: newCounts,
                            numQuestionTypesUsed: newNumQuestionTypesUsed,
                            totalQuestions: newTotalQuestions,
                            possible: true
                        };
                    } else {
                        if (newNumQuestionTypesUsed > dp[m].numQuestionTypesUsed) {
                            dp[m] = { counts: newCounts, numQuestionTypesUsed: newNumQuestionTypesUsed, totalQuestions: newTotalQuestions, possible: true };
                        } else if (newNumQuestionTypesUsed === dp[m].numQuestionTypesUsed) {
                            if (newTotalQuestions < dp[m].totalQuestions) {
                                dp[m] = { counts: newCounts, numQuestionTypesUsed: newNumQuestionTypesUsed, totalQuestions: newTotalQuestions, possible: true };
                            }
                        }
                    }
                }
            }
        }
    }

    if (dp[marksToFill].possible) {
        return { counts: dp[marksToFill].counts, achievedMarks: marksToFill };
    }

    for (let m = marksToFill - 1; m >= 0; m--) {
        if (dp[m].possible) {
            return { counts: dp[m].counts, achievedMarks: m };
        }
    }

    return { counts: baseCounts, achievedMarks: 0 };
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ onSubmit, isLoading }) => {
  const [subject, setSubject] = useState<string>(SUPPORTED_SUBJECTS[0].id);
  const [grade, setGrade] = useState<string>(SUPPORTED_GRADES[0].id);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);

  const [durationHours, setDurationHours] = useState<number>(2);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);

  const [totalMarksInput, setTotalMarksInput] = useState<string>('80');
  const [questionCounts, setQuestionCounts] = useState<PaperQuestionConfiguration[]>(initialQuestionCounts);

  const [isAddingCustomQuestion, setIsAddingCustomQuestion] = useState<boolean>(false);
  const [currentCustomQuestionText, setCurrentCustomQuestionText] = useState<string>('');
  const [currentCustomQuestionCategory, setCurrentCustomQuestionCategory] = useState<QuestionCategory>(DEFAULT_CUSTOM_QUESTION_CATEGORY);
  const [generateDiagramForCustom, setGenerateDiagramForCustom] = useState<boolean>(false);
  const [customQuestionsList, setCustomQuestionsList] = useState<CustomQuestionEntry[]>([]);

  const [isDistributionConfigOpen, setIsDistributionConfigOpen] = useState<boolean>(false);
  const [marksForAIFromConfig, setMarksForAIFromConfig] = useState<number>(0);
  const [isAIMarksTargetAchievable, setIsAIMarksTargetAchievable] = useState<boolean>(true);

  const calculatedCustomMarks = useMemo(() => {
    return customQuestionsList.reduce((acc, qItem) => {
      const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === qItem.category);
      return acc + (sectionConfig ? sectionConfig.marks : 0);
    }, 0);
  }, [customQuestionsList]);

  const targetMarksParsed = useMemo(() => {
    const parsed = parseInt(totalMarksInput, 10);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  }, [totalMarksInput]);

  useEffect(() => {
    const currentTargetMarks = parseInt(totalMarksInput, 10);
    if (isNaN(currentTargetMarks) || currentTargetMarks <= 0) {
        setQuestionCounts(initialQuestionCounts.map(qc => ({ ...qc, count: 0 })));
        setMarksForAIFromConfig(0);
        setIsAIMarksTargetAchievable(true);
        return;
    }

    const currentCustomMarks = customQuestionsList.reduce((acc, q) => acc + (QUESTION_CONFIG_SECTIONS.find(s => s.id === q.category)?.marks || 0), 0);
    const calculatedMarksForAI = Math.max(0, currentTargetMarks - currentCustomMarks);
    setMarksForAIFromConfig(calculatedMarksForAI);

    const timerId = setTimeout(() => {
        if (!isDistributionConfigOpen) {
            const { counts: newAiCounts, achievedMarks } = calculateExactAiCountsDP(calculatedMarksForAI, QUESTION_CONFIG_SECTIONS);
            
            const newQsCounts = QUESTION_CONFIG_SECTIONS.map(section => ({
                category: section.id,
                count: newAiCounts[section.id] || 0,
            }));

            setQuestionCounts(prevCounts => {
              if (JSON.stringify(newQsCounts) !== JSON.stringify(prevCounts)) {
                return newQsCounts;
              }
              return prevCounts;
            });
            setIsAIMarksTargetAchievable(achievedMarks === calculatedMarksForAI || calculatedMarksForAI === 0);

        } else {
            setIsAIMarksTargetAchievable(true);
        }
    }, 0);

    return () => clearTimeout(timerId);
  }, [totalMarksInput, customQuestionsList, isDistributionConfigOpen]);

  const handleQuestionCountChange = (category: QuestionCategory, count: number) => {
    setQuestionCounts(prev =>
      prev.map(qc => qc.category === category ? { ...qc, count: Math.max(0, count) } : qc)
    );
  };

  const calculatedAIMarks = useMemo(() => {
    return questionCounts.reduce((acc, qc) => {
        const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === qc.category);
        return acc + (qc.count * (sectionConfig?.marks || 0));
    }, 0);
  }, [questionCounts]);

  const grandTotalConfiguredMarks = useMemo(() => {
    return calculatedAIMarks + calculatedCustomMarks;
  }, [calculatedAIMarks, calculatedCustomMarks]);

  const configurationProgress = useMemo(() => {
    if (targetMarksParsed === 0) return 0;
    return Math.min(100, (grandTotalConfiguredMarks / targetMarksParsed) * 100);
  }, [grandTotalConfiguredMarks, targetMarksParsed]);

  const marksFeedback = useMemo(() => {
    if (targetMarksParsed === 0) {
        return { text: "Please set a target total marks value.", color: "text-amber-600", type: "info" };
    }

    if (!isDistributionConfigOpen) {
        if (!isAIMarksTargetAchievable && marksForAIFromConfig > 0) {
            return {
                text: `Target for AI Questions: ${marksForAIFromConfig}. Current configuration achieved: ${calculatedAIMarks}. The target AI marks (${marksForAIFromConfig}) is not exactly achievable with the available question types. Please adjust Total Marks or Custom Questions.`,
                color: "text-red-600",
                type: "error"
            };
        }
        if (grandTotalConfiguredMarks !== targetMarksParsed && marksForAIFromConfig > 0 && isAIMarksTargetAchievable) { 
             return {
                text: `System aiming for ${targetMarksParsed} total. Automatically configured: ${grandTotalConfiguredMarks}. There might be a slight mismatch due to rounding or complex scenarios.`,
                color: "text-orange-600",
                type: "warning"
            };
        }
         return { text: `System automatically configured AI questions to meet target. Total: ${grandTotalConfiguredMarks}.`, color: "text-green-600", type: "success" };

    } else {
        const aiMarksDifference = marksForAIFromConfig - calculatedAIMarks;
        if (aiMarksDifference !== 0) {
            return {
                text: `Target for AI Questions (after custom): ${marksForAIFromConfig} marks. You've configured ${calculatedAIMarks} marks for AI. Please adjust AI question counts by ${aiMarksDifference > 0 ? '+' : ''}${aiMarksDifference} marks.`,
                color: "text-orange-600",
                type: "warning"
            };
        }
        if (grandTotalConfiguredMarks !== targetMarksParsed) {
             return {
                text: `Total configured marks (${grandTotalConfiguredMarks}) do not match target (${targetMarksParsed}). Please check custom questions or AI mark allocation.`,
                color: "text-red-600",
                type: "error"
            };
        }
        return { text: "AI Question counts manually set and match the required AI marks. Total configured marks match target.", color: "text-green-600", type: "success" };
    }
  }, [targetMarksParsed, grandTotalConfiguredMarks, calculatedAIMarks, calculatedCustomMarks, isDistributionConfigOpen, marksForAIFromConfig, isAIMarksTargetAchievable]);

  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    setSelectedChapters([]);
  };

  const currentChapterList = useMemo((): SyllabusChapterDetail[] | string[] => {
    if (subject === 'maths') return CBSE_MATH_SYLLABUS_DETAILED;
    if (subject === 'science') return CBSE_SCIENCE_10_CHAPTERS;
    return [];
  }, [subject]);

  const handleChapterChange = (chapterDisplayName: string) => {
    setSelectedChapters(prev =>
      prev.includes(chapterDisplayName) ? prev.filter(c => c !== chapterDisplayName) : [...prev, chapterDisplayName]
    );
  };

  const handleSaveCustomQuestion = () => {
    if (currentCustomQuestionText.trim()) {
      setCustomQuestionsList(prev => [
        ...prev,
        {
          text: currentCustomQuestionText.trim(),
          category: currentCustomQuestionCategory,
          generateDiagram: generateDiagramForCustom,
        }
      ]);
      setCurrentCustomQuestionText('');
      setCurrentCustomQuestionCategory(DEFAULT_CUSTOM_QUESTION_CATEGORY);
      setGenerateDiagramForCustom(false);
      setIsAddingCustomQuestion(false);
    }
  };

  const handleToggleAddCustomQuestionForm = () => {
    if (isAddingCustomQuestion) {
        setCurrentCustomQuestionText('');
        setCurrentCustomQuestionCategory(DEFAULT_CUSTOM_QUESTION_CATEGORY);
        setGenerateDiagramForCustom(false);
    }
    setIsAddingCustomQuestion(!isAddingCustomQuestion);
  };

  const handleRemoveCustomQuestion = (indexToRemove: number) => {
    setCustomQuestionsList(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (targetMarksParsed <= 0) {
        alert("Please enter a valid positive target total marks value.");
        return;
    }
    if (selectedChapters.length === 0) {
        alert("Please select at least one chapter.");
        return;
    }

    const totalDurationInMinutes = (durationHours * 60) + durationMinutes;
    if (totalDurationInMinutes <= 0) {
        alert("Please set a time duration greater than 0 minutes.");
        return;
    }

    if (!isDistributionConfigOpen && (!isAIMarksTargetAchievable && marksForAIFromConfig > 0)) {
        alert(`Configuration Error: Target AI marks (${marksForAIFromConfig}) not achieved by automatic distribution (${calculatedAIMarks}). Please adjust Total Marks or Custom Questions, or try manual configuration.`);
        return;
    }
    if (isDistributionConfigOpen && (marksForAIFromConfig !== calculatedAIMarks)) {
        alert(`Configuration Error: Manually set AI marks (${calculatedAIMarks}) do not match the required AI marks after custom questions (${marksForAIFromConfig}). Please adjust.`);
        return;
    }
     if (grandTotalConfiguredMarks !== targetMarksParsed) {
        let alertMsg = `Configuration Error: Grand total configured marks (${grandTotalConfiguredMarks}) do not match target marks (${targetMarksParsed}).`;
        if (!isDistributionConfigOpen && !isAIMarksTargetAchievable && marksForAIFromConfig > 0) {
            alertMsg += ` This might be because the automatic AI distribution could not precisely meet its sub-target of ${marksForAIFromConfig} marks (achieved ${calculatedAIMarks}). Try adjusting total marks, custom questions, or use manual AI configuration.`;
        } else {
            alertMsg += ` Please review configuration.`;
        }
        alert(alertMsg);
        return;
    }
    if (calculatedAIMarks <= 0 && calculatedCustomMarks <= 0 && targetMarksParsed > 0) {
        alert("Please configure questions. The paper currently has 0 marks assigned from AI or custom questions, but target marks are greater than 0.");
        return;
    }

    let formattedTimeDuration = '';
    if (durationHours > 0) {
      formattedTimeDuration += `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
    }
    if (durationMinutes > 0) {
      if (formattedTimeDuration) formattedTimeDuration += ' ';
      formattedTimeDuration += `${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`;
    }
    if (!formattedTimeDuration) {
        formattedTimeDuration = '0 minutes';
    }

    const config: PaperConfiguration = {
      subject,
      grade,
      chapters: selectedChapters,
      timeDuration: formattedTimeDuration,
      totalMarks: targetMarksParsed,
      questionCounts: questionCounts, 
      customQuestions: customQuestionsList,
    };
    onSubmit(config);
  };

  const generateButtonDisabledCondition = useMemo(() => {
    if (isLoading || targetMarksParsed <= 0 || selectedChapters.length === 0 || ((durationHours * 60) + durationMinutes <= 0)) {
        return true;
    }
    
    if (!isDistributionConfigOpen && (!isAIMarksTargetAchievable && marksForAIFromConfig > 0)) {
        return true;
    }
    
    if (isDistributionConfigOpen && (marksForAIFromConfig !== calculatedAIMarks)) {
        return true;
    }
    
    if (grandTotalConfiguredMarks !== targetMarksParsed) {
        return true;
    }

    if (targetMarksParsed > 0 && calculatedAIMarks <= 0 && calculatedCustomMarks <= 0) {
        return true;
    }
    return false;
  }, [isLoading, targetMarksParsed, selectedChapters, durationHours, durationMinutes, isDistributionConfigOpen, isAIMarksTargetAchievable, marksForAIFromConfig, calculatedAIMarks, grandTotalConfiguredMarks, calculatedCustomMarks]);

  const showNoQuestionSourceError = targetMarksParsed > 0 &&
    !isLoading &&
    (calculatedAIMarks <= 0 && customQuestionsList.length === 0) &&
    (marksFeedback.type === "error" || (isDistributionConfigOpen && marksForAIFromConfig > 0 && calculatedAIMarks === 0));

  const hourOptions = Array.from({ length: 6 }, (_, i) => i);

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = 0;
    }
    value = Math.max(0, Math.min(59, value));
    setDurationMinutes(value);
  };

  return (
    <Card variant="elevated" padding="lg" className="animate-fade-in-up">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3 text-primary-700 border-b border-slate-300 pb-6">
          <div className="p-3 bg-primary-100 rounded-xl">
            <CogIcon />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Paper Configuration</h2>
            <p className="text-slate-600 mt-1">Set up your intelligent question paper parameters</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-700">Configuration Progress</span>
            <span className="text-sm text-slate-500">{Math.round(configurationProgress)}% Complete</span>
          </div>
          <ProgressBar 
            progress={configurationProgress} 
            variant="gradient" 
            size="md"
          />
        </div>

        {/* Subject and Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-semibold text-slate-700">Subject</label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white shadow-sm"
            >
              {SUPPORTED_SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="grade" className="block text-sm font-semibold text-slate-700">Grade</label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white shadow-sm"
            >
              {SUPPORTED_GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Chapters to Include</label>
          {currentChapterList.length > 0 ? (
            <Card variant="glass" padding="md">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {(currentChapterList as Array<SyllabusChapterDetail | string>).map(chapterOrDetail => {
                  const chapterDisplayName = typeof chapterOrDetail === 'string' ? chapterOrDetail : chapterOrDetail.displayName;
                  const chapterId = typeof chapterOrDetail === 'string' ? chapterOrDetail : chapterOrDetail.id;
                  const isSelected = selectedChapters.includes(chapterDisplayName);
                  
                  return (
                    <label 
                      key={chapterId} 
                      className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-primary-100 border-2 border-primary-300' 
                          : 'bg-white border-2 border-slate-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={chapterDisplayName}
                        checked={isSelected}
                        onChange={() => handleChapterChange(chapterDisplayName)}
                        className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      />
                      <span className={`ml-3 text-sm ${isSelected ? 'text-primary-700 font-medium' : 'text-slate-600'}`}>
                        {chapterDisplayName}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card variant="glass" padding="md" className="text-center">
              <p className="text-slate-500 italic">Select a subject to see available chapters.</p>
            </Card>
          )}
        </div>

        {/* Time Duration and Total Marks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Time Duration</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value, 10))}
                  className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white"
                >
                  {hourOptions.map(hr => <option key={hr} value={hr}>{hr}</option>)}
                </select>
                <span className="text-xs text-slate-500 mt-1 block">hours</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={handleMinuteChange}
                  className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white"
                  min="0"
                  max="59"
                  step="1"
                  placeholder="min"
                />
                <span className="text-xs text-slate-500 mt-1 block">minutes</span>
              </div>
            </div>
            {((durationHours * 60) + durationMinutes <= 0) && 
              <p className="text-xs text-red-500 mt-1">Duration must be greater than 0 minutes.</p>
            }
          </div>
          
          <div className="space-y-2">
            <label htmlFor="totalMarks" className="block text-sm font-semibold text-slate-700">Target Total Marks</label>
            <input
              type="number"
              id="totalMarks"
              value={totalMarksInput}
              onChange={(e) => setTotalMarksInput(e.target.value)}
              className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white"
              placeholder="e.g., 80"
              min="1"
            />
          </div>
        </div>

        {/* Configure Question Distribution Button */}
        <Card variant="glass" padding="md">
          <InteractiveButton
            onClick={() => setIsDistributionConfigOpen(!isDistributionConfigOpen)}
            variant="outline"
            className="w-full justify-between"
            icon={
              <svg 
                className={`w-5 h-5 transition-transform duration-200 ${isDistributionConfigOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            }
            iconPosition="right"
          >
            <span className="flex items-center space-x-2">
              <CogIcon />
              <span>
                {isDistributionConfigOpen ? 'Hide AI Question Settings (Use Automatic)' : 'Configure AI Questions Manually'}
              </span>
            </span>
          </InteractiveButton>
        </Card>

        {/* Main Configuration Area */}
        <div className="space-y-6">
          {/* Summary */}
          <Card variant="glass" padding="md">
            <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Paper Marks Summary</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-primary-600">{targetMarksParsed}</div>
                <div className="text-xs text-slate-500">Target Total</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-accent-600">{calculatedCustomMarks}</div>
                <div className="text-xs text-slate-500">Custom Questions</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-blue-600">{marksForAIFromConfig}</div>
                <div className="text-xs text-slate-500">Target AI</div>
              </div>
              <div className="text-center p-3 bg-white rounded-xl border border-slate-200">
                <div className="text-2xl font-bold text-slate-700">{grandTotalConfiguredMarks}</div>
                <div className="text-xs text-slate-500">Configured Total</div>
              </div>
            </div>

            {marksFeedback.text && (
              <div className={`p-4 rounded-xl ${
                marksFeedback.type === 'error' ? 'bg-red-50 border border-red-200' :
                marksFeedback.type === 'warning' ? 'bg-orange-50 border border-orange-200' :
                marksFeedback.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <p className={`${marksFeedback.color} font-medium flex items-start space-x-2`}>
                  {InfoIcon && React.cloneElement(InfoIcon, { className: `w-5 h-5 ${marksFeedback.color} shrink-0 mt-0.5`})}
                  <span>{marksFeedback.text}</span>
                </p>
              </div>
            )}
          </Card>

          {/* AI Distribution Settings */}
          {isDistributionConfigOpen && (
            <Card variant="default" padding="md" className="animate-fade-in-down">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Manual AI Question Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUESTION_CONFIG_SECTIONS.map(section => (
                  <div key={section.id} className="space-y-2">
                    <label className="block text-sm font-medium text-slate-600">
                      {section.label} ({section.marks} marks each)
                    </label>
                    <input
                      type="number"
                      value={questionCounts.find(qc => qc.category === section.id)?.count || 0}
                      onChange={(e) => handleQuestionCountChange(section.id, parseInt(e.target.value, 10))}
                      className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500"
                      min="0"
                    />
                    <p className="text-xs text-slate-500">
                      Total marks: {(questionCounts.find(qc => qc.category === section.id)?.count || 0) * section.marks}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {!isDistributionConfigOpen && targetMarksParsed > 0 && (
            <Card variant="glass" padding="sm">
              <p className="text-sm text-slate-600 italic text-center">
                AI question counts are being automatically calculated to meet the "{marksForAIFromConfig} marks for AI questions" target.
                Expand manual configuration above to take control.
              </p>
            </Card>
          )}
        </div>

        {/* Custom Questions */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-700 flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Custom Questions</span>
            </h3>
            
            {!isAddingCustomQuestion && (
              <InteractiveButton
                onClick={handleToggleAddCustomQuestionForm}
                variant="accent"
                size="sm"
                icon={PlusCircleIcon}
              >
                Add Custom Question
              </InteractiveButton>
            )}
          </div>

          {isAddingCustomQuestion && (
            <Card variant="glass" padding="md" className="mb-4 animate-scale-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Custom Question Text:
                  </label>
                  <textarea
                    value={currentCustomQuestionText}
                    onChange={(e) => setCurrentCustomQuestionText(e.target.value)}
                    rows={3}
                    className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 placeholder-slate-400 resize-none"
                    placeholder="Type your custom question here..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">
                      Question Category & Marks:
                    </label>
                    <select
                      value={currentCustomQuestionCategory}
                      onChange={(e) => setCurrentCustomQuestionCategory(e.target.value as QuestionCategory)}
                      className="interactive-input w-full p-3 border-2 border-slate-200 rounded-xl focus:border-primary-500 bg-white"
                    >
                      {QUESTION_CONFIG_SECTIONS.map(section => (
                        <option key={section.id} value={section.id}>
                          {section.label} ({section.marks} Marks)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      id="generateDiagramForCustomConfig"
                      checked={generateDiagramForCustom}
                      onChange={(e) => setGenerateDiagramForCustom(e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="generateDiagramForCustomConfig" className="text-sm text-slate-600 flex items-center">
                      <ShapesIcon /> <span className="ml-2">Generate Diagram with AI</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <InteractiveButton
                    onClick={handleSaveCustomQuestion}
                    disabled={!currentCustomQuestionText.trim()}
                    variant="accent"
                    size="sm"
                  >
                    Save Question
                  </InteractiveButton>
                  <InteractiveButton
                    onClick={handleToggleAddCustomQuestionForm}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </InteractiveButton>
                </div>
              </div>
            </Card>
          )}

          {customQuestionsList.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-slate-600">Your Custom Questions:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customQuestionsList.map((qItem, index) => {
                  const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === qItem.category);
                  return (
                    <Card key={index} variant="glass" padding="sm" className="group">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow pr-3">
                          <p className="text-sm text-slate-700 mb-2">
                            {qItem.text.length > 100 ? `${qItem.text.substring(0,97)}...` : qItem.text}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                              {sectionConfig?.label || qItem.category}
                            </span>
                            <span className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded-full">
                              {sectionConfig?.marks || 0} marks
                            </span>
                            {qItem.generateDiagram && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                Diagram Requested
                              </span>
                            )}
                          </div>
                        </div>
                        <Tooltip content="Remove question">
                          <button
                            onClick={() => handleRemoveCustomQuestion(index)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <TrashIcon />
                          </button>
                        </Tooltip>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {customQuestionsList.length === 0 && !isAddingCustomQuestion && (
            <Card variant="glass" padding="md" className="text-center">
              <p className="text-slate-500">No custom questions added yet. Click "Add Custom Question" to get started.</p>
            </Card>
          )}
        </Card>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-300">
          <InteractiveButton
            type="submit"
            disabled={generateButtonDisabledCondition}
            loading={isLoading}
            variant="primary"
            size="xl"
            className="w-full"
            icon={<BookOpenIcon />}
          >
            {isLoading ? 'Generating Draft...' : 'Generate Draft Paper'}
          </InteractiveButton>
          
          {/* Error Messages */}
          <div className="mt-4 space-y-2">
            {targetMarksParsed <= 0 && (
              <p className="text-xs text-red-500 text-center">Target total marks must be greater than 0.</p>
            )}
            {selectedChapters.length === 0 && (
              <p className="text-xs text-red-500 text-center">Please select at least one chapter.</p>
            )}
            {((durationHours * 60) + durationMinutes <= 0) && (
              <p className="text-xs text-red-500 text-center">Total time duration must be greater than 0 minutes.</p>
            )}
            {showNoQuestionSourceError && (
              <p className="text-xs text-red-500 text-center">
                Paper has no questions configured. Please ensure target marks allow for AI questions or add custom questions.
              </p>
            )}
            {generateButtonDisabledCondition && marksFeedback.type !== "success" && targetMarksParsed > 0 && selectedChapters.length > 0 && !isLoading && (
              <p className="text-xs text-red-500 text-center">
                Cannot generate: Please resolve the configuration issues highlighted above.
              </p>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};