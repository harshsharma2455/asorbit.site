import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { PaperConfiguration, PaperQuestionConfiguration, QuestionCategory, CustomQuestionEntry, QuestionTypeConfig, SyllabusChapterDetail } from '../../types';
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 text-primary-700">
          <CogIcon />
          <h2 className="text-2xl font-bold">Paper Configuration</h2>
        </div>
        <p className="text-gray-600 mt-2">Configure your question paper settings and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Subject and Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-colors"
            >
              {SUPPORTED_SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">Grade</label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-colors"
            >
              {SUPPORTED_GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        </div>

        {/* Chapters */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Chapters to Include</label>
          {currentChapterList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 max-h-60 overflow-y-auto custom-scrollbar p-4 bg-gray-50 border border-gray-200 rounded-lg">
              {(currentChapterList as Array<SyllabusChapterDetail | string>).map(chapterOrDetail => {
                const chapterDisplayName = typeof chapterOrDetail === 'string' ? chapterOrDetail : chapterOrDetail.displayName;
                const chapterId = typeof chapterOrDetail === 'string' ? chapterOrDetail : chapterOrDetail.id;
                return (
                  <div key={chapterId} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`chapter-${chapterId.replace(/\s+/g, '-')}`}
                      value={chapterDisplayName}
                      checked={selectedChapters.includes(chapterDisplayName)}
                      onChange={() => handleChapterChange(chapterDisplayName)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor={`chapter-${chapterId.replace(/\s+/g, '-')}`} className="ml-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer">{chapterDisplayName}</label>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-200">Select a subject to see available chapters.</p>
          )}
        </div>

        {/* Time Duration and Total Marks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label id="timeDurationLabel" className="block text-sm font-semibold text-gray-700 mb-2">Time Duration</label>
            <div className="flex items-center space-x-3" role="group" aria-labelledby="timeDurationLabel">
              <div className="flex-1">
                <select
                  id="durationHours"
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value, 10))}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-colors"
                  aria-label="Hours for exam duration"
                >
                  {hourOptions.map(hr => <option key={hr} value={hr}>{hr}</option>)}
                </select>
              </div>
              <span className="text-sm font-medium text-gray-600">hours</span>
              <div className="flex-1">
                <input
                  type="number"
                  id="durationMinutes"
                  value={durationMinutes}
                  onChange={handleMinuteChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-colors"
                  min="0"
                  max="59"
                  step="1"
                  aria-label="Minutes for exam duration"
                  placeholder="min"
                />
              </div>
              <span className="text-sm font-medium text-gray-600">min</span>
            </div>
             {((durationHours * 60) + durationMinutes <= 0) && <p className="text-xs text-red-500 mt-2">Duration must be greater than 0 minutes.</p>}
          </div>
          <div>
            <label htmlFor="totalMarks" className="block text-sm font-semibold text-gray-700 mb-2">Target Total Marks for Paper</label>
            <input
              type="number"
              id="totalMarks"
              value={totalMarksInput}
              onChange={(e) => setTotalMarksInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="e.g., 80"
              min="1"
            />
          </div>
        </div>

        {/* Configure Question Distribution Button */}
         <div className="border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setIsDistributionConfigOpen(!isDistributionConfigOpen)}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 transition-colors flex items-center justify-center space-x-2"
              aria-expanded={isDistributionConfigOpen}
            >
              <CogIcon />
              <span>
                {isDistributionConfigOpen ? 'Hide AI Question Settings (Use Automatic)' : 'Configure AI Questions Manually'}
              </span>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 transition-transform duration-200 ${isDistributionConfigOpen ? 'rotate-180' : ''}`}>
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

        {/* Main Configuration Area */}
        <div className="space-y-8">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Paper Marks Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">Target Total</p>
                    <p className="text-xl font-bold text-gray-900">{targetMarksParsed}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">Custom Questions</p>
                    <p className="text-xl font-bold text-accent-600">{calculatedCustomMarks}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">AI Target</p>
                    <p className="text-xl font-bold text-primary-600">{marksForAIFromConfig}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">AI Configured</p>
                    <p className="text-xl font-bold text-blue-600">{calculatedAIMarks}</p>
                  </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-lg font-semibold">Grand Total: <span className="text-2xl text-gray-900">{grandTotalConfiguredMarks}</span></p>
              </div>
              {marksFeedback.text && (
                  <div className={`mt-4 p-4 rounded-lg flex items-start space-x-3 ${
                      marksFeedback.type === 'error' ? 'bg-red-50 border border-red-200' :
                      marksFeedback.type === 'warning' ? 'bg-orange-50 border border-orange-200' :
                      marksFeedback.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                  }`}>
                      {InfoIcon && React.cloneElement(InfoIcon, { className: `w-5 h-5 ${marksFeedback.color} shrink-0 mt-0.5`})}
                      <span className={`${marksFeedback.color} font-medium text-sm`}>{marksFeedback.text}</span>
                  </div>
              )}
            </div>

            {/* AI Distribution Settings */}
            {isDistributionConfigOpen && (
              <div className="animate-slide-in">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Manual AI Question Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {QUESTION_CONFIG_SECTIONS.map(section => (
                          <div key={section.id} className="space-y-2">
                          <label htmlFor={`count-${section.id}`} className="block text-sm font-medium text-gray-700">
                              {section.label}
                              <span className="text-gray-500 ml-1">({section.marks} marks each)</span>
                          </label>
                          <input
                              type="number"
                              id={`count-${section.id}`}
                              value={questionCounts.find(qc => qc.category === section.id)?.count || 0}
                              onChange={(e) => handleQuestionCountChange(section.id, parseInt(e.target.value, 10))}
                              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              min="0"
                              aria-describedby={`marks-${section.id}`}
                          />
                          <p id={`marks-${section.id}`} className="text-xs text-gray-500">
                              Total: {(questionCounts.find(qc => qc.category === section.id)?.count || 0) * section.marks} marks
                          </p>
                          </div>
                      ))}
                      </div>
                  </div>
              </div>
            )}
             {!isDistributionConfigOpen && targetMarksParsed > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                          <strong>Automatic Mode:</strong> AI question counts are being automatically calculated to meet the "{marksForAIFromConfig} marks for AI questions" target. 
                          To manually control AI question counts, expand the "Configure AI Questions Manually\" section above.
                      </p>
                  </div>
              )}
        </div>

        {/* Add Custom Questions */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Custom Questions (Optional)</h3>
          {!isAddingCustomQuestion ? (
              <button
                  type="button"
                  onClick={handleToggleAddCustomQuestionForm}
                  className="px-6 py-3 bg-accent-100 hover:bg-accent-200 text-accent-700 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-500 transition-colors flex items-center space-x-2"
                  aria-label="Open form to add a new custom question"
              >
                  {PlusCircleIcon}
                  <span>Add Custom Question</span>
              </button>
          ) : (
              <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                  <div>
                      <label htmlFor="customQuestionText" className="block text-sm font-semibold text-gray-700 mb-2">
                          Custom Question Text
                      </label>
                      <textarea
                          id="customQuestionText"
                          value={currentCustomQuestionText}
                          onChange={(e) => setCurrentCustomQuestionText(e.target.value)}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 text-gray-800"
                          placeholder="Type your custom question here..."
                      />
                  </div>
                  <div>
                      <label htmlFor="customQuestionCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                          Question Category & Marks
                      </label>
                      <select
                          id="customQuestionCategory"
                          value={currentCustomQuestionCategory}
                          onChange={(e) => setCurrentCustomQuestionCategory(e.target.value as QuestionCategory)}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-colors"
                          >
                          {QUESTION_CONFIG_SECTIONS.map(section => (
                              <option key={section.id} value={section.id}>
                              {section.label} ({section.marks} Marks)
                              </option>
                          ))}
                      </select>
                  </div>
                  <div className="flex items-center space-x-3">
                      <input
                          type="checkbox"
                          id="generateDiagramForCustomConfig"
                          checked={generateDiagramForCustom}
                          onChange={(e) => setGenerateDiagramForCustom(e.target.checked)}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="generateDiagramForCustomConfig" className="text-sm text-gray-700 flex items-center font-medium">
                          <ShapesIcon /> <span className="ml-2">Generate Diagram with AI</span>
                      </label>
                  </div>
                  <div className="flex space-x-3">
                      <button
                          type="button"
                          onClick={handleSaveCustomQuestion}
                          disabled={!currentCustomQuestionText.trim()}
                          className="px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent-500 transition-colors disabled:opacity-50"
                          aria-label="Save this custom question"
                      >
                          Save Question
                      </button>
                      <button
                          type="button"
                          onClick={handleToggleAddCustomQuestionForm}
                          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 transition-colors"
                          aria-label="Cancel adding custom question"
                      >
                          Cancel
                      </button>
                  </div>
              </div>
          )}

          {customQuestionsList.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-md font-semibold text-gray-700">Your Custom Questions</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {customQuestionsList.map((qItem, index) => {
                  const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === qItem.category);
                  return (
                      <div key={index} className="flex justify-between items-start group p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex-grow pr-4">
                          <p className="text-sm text-gray-800 mb-1">
                              {qItem.text.length > 100 ? `${qItem.text.substring(0,97)}...` : qItem.text}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">{sectionConfig?.label || qItem.category}</span>
                              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">{sectionConfig?.marks || 0} marks</span>
                              {qItem.generateDiagram && <span className="bg-accent-100 text-accent-700 px-2 py-1 rounded">Diagram Requested</span>}
                          </div>
                      </div>
                      <button
                          type="button"
                          onClick={() => handleRemoveCustomQuestion(index)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          aria-label={`Remove custom question: ${qItem.text.substring(0,30)}...`}
                          title="Remove custom question"
                      >
                          <TrashIcon />
                      </button>
                      </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="border-t border-gray-200 pt-8">
          <button
            type="submit"
            disabled={generateButtonDisabledCondition}
            className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold text-lg rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-accent-500 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            aria-label="Generate Draft Question Paper"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                <span>Generating Draft...</span>
              </>
            ) : (
              <>
                <BookOpenIcon />
                <span>Generate Draft Paper</span>
              </>
            )}
          </button>
           {targetMarksParsed <= 0 && <p className="text-xs text-red-500 mt-3 text-center">Target total marks must be greater than 0.</p>}
           {selectedChapters.length === 0 && <p className="text-xs text-red-500 mt-3 text-center">Please select at least one chapter.</p>}
           {((durationHours * 60) + durationMinutes <= 0) && <p className="text-xs text-red-500 mt-3 text-center">Total time duration must be greater than 0 minutes.</p>}
           {showNoQuestionSourceError &&
              <p className="text-xs text-red-500 mt-3 text-center">
                Paper has no questions configured. Please ensure target marks allow for AI questions or add custom questions.
              </p>
           }
           {generateButtonDisabledCondition && marksFeedback.type !== "success" && targetMarksParsed > 0 && selectedChapters.length > 0 && !isLoading &&
              <p className="text-xs text-red-500 mt-3 text-center">
                  Cannot generate: {marksFeedback.text.startsWith("Target for AI Questions:") || marksFeedback.text.startsWith("Manually set AI marks") || marksFeedback.text.includes("not exactly achievable") || marksFeedback.text.includes("do not match target") ? "Please resolve the mark allocation issue highlighted in the summary." : "Please resolve configuration issues highlighted in the summary." }
              </p>
           }
        </div>
      </form>
    </div>
  );
};