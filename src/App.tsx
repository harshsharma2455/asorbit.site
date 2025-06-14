import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ConfigurationPanel } from './components/core/ConfigurationPanel';
import { DraftQuestionPaperView } from './components/core/DraftQuestionPaperView';
import { FinalQuestionPaperView } from './components/core/FinalQuestionPaperView';
import { DiagramGeneratorModal } from './components/core/DiagramGeneratorModal';
import LoadingSpinner from './components/core/LoadingSpinner'; 
import { GeminiService as GeminiServiceInternal } from './services'; 
import type { 
  QuestionItem, 
  DiagramData, 
  AppView as PaperGeneratorView, 
  PaperConfiguration, 
  PointDef, LineDef, SegmentDef, CircleDef, ArcDef, PolygonDef, FunctionGraphDef, AngleDef, EllipseDef, SemicircleDef, TextDef, GeometricElement,
  QuestionCategory 
} from './types';
import { LightBulbIcon, QUESTION_CONFIG_SECTIONS, API_KEY_ERROR_MESSAGE } from './config'; 
import JXG from 'jsxgraph';

interface PaperGeneratorPageProps {
  geminiService: GeminiServiceInternal;
  setGlobalError: (error: string | null) => void; 
  globalError?: string | null; 
  onNavigate: (page: 'landing' | 'paperGenerator' | 'diagramGenerator') => void;
}

const PaperGeneratorPage: React.FC<PaperGeneratorPageProps> = ({ geminiService, setGlobalError, globalError, onNavigate }) => {
  const [currentView, setCurrentView] = useState<PaperGeneratorView>('config');
  const [paperConfig, setPaperConfig] = useState<PaperConfiguration | null>(null);
  const [draftQuestions, setDraftQuestions] = useState<QuestionItem[]>([]);
  const [finalQuestions, setFinalQuestions] = useState<QuestionItem[]>([]);
  
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState<boolean>(false);
  const [currentQuestionForModal, setCurrentQuestionForModal] = useState<QuestionItem | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const [isLoadingTextGeneration, setIsLoadingTextGeneration] = useState<boolean>(false);
  const [isLoadingInitialDiagrams, setIsLoadingInitialDiagrams] = useState<boolean>(false);
  const [isFinalizingPaper, setIsFinalizingPaper] = useState<boolean>(false);
  
  useEffect(() => {
    if (typeof JXG !== 'undefined' && JXG.Options) {
      (JXG.Options as any).renderer = 'svg';
      (JXG.Options as any).text.display = 'internal';
    }
  }, []);

  const handleConfigurationSubmit = useCallback(async (config: PaperConfiguration) => {
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

    } catch (error) { 
      if (error instanceof Error) {
        if (error.message === API_KEY_ERROR_MESSAGE) {
          setGlobalError(error.message);
        } else {
          setLocalError(`Error during draft text generation: ${error.message}. Please check console or try adjusting configuration.`);
        }
      } else {
        setLocalError("An unknown error occurred while generating the draft question paper text.");
      }
      setDraftQuestions(prev => prev.length > 0 ? prev : initialQuestions); 
    } finally {
      setIsLoadingTextGeneration(false); 
    }

    if (initialQuestions.length > 0 && initialQuestions.some(q => q.isDiagramRecommended && q.isLoadingDiagram)) {
        setIsLoadingInitialDiagrams(true);
        const questionsToProcessForDiagrams = [...initialQuestions];

        for (let i = 0; i < questionsToProcessForDiagrams.length; i++) {
            let question = questionsToProcessForDiagrams[i];
            if (question.isDiagramRecommended && question.isLoadingDiagram) {
                try {
                    const diagramData = await geminiService.generateDiagramDescription(question.diagramOriginalQuestionPrompt);
                    setDraftQuestions(prevQs => prevQs.map(q => 
                        q.id === question.id ? { ...q, diagramData, isLoadingDiagram: false, diagramError: null } : q
                    ));
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

  }, [geminiService, setGlobalError]); 

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

  const handleStartNewPaperFromFinal = useCallback(() => {
     handleBackToConfig(); 
     onNavigate('landing'); 
  }, [handleBackToConfig, onNavigate]);

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
    setDraftQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, isLoadingDiagram: true, diagramError: null, diagramData: null, diagramOriginalQuestionPrompt: prompt } : q
    ));
    try {
      const data = await geminiService.generateDiagramDescription(prompt);
      setDraftQuestions(prev => prev.map(q =>
        q.id === questionId ? { ...q, diagramData: data, isLoadingDiagram: false } : q
      ));
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
    }
  }, [geminiService]);
  
  const handleDeleteQuestion = useCallback((questionId: string) => {
    setDraftQuestions(prev => prev.filter(q => q.id !== questionId));
  }, []);
  
  const handleUpdateQuestionText = useCallback((questionId: string, newText: string) => {
    setDraftQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, text: newText, diagramOriginalQuestionPrompt: newText } : q 
    ));
  }, []);

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
  }, []);

  const handleRegenerateDiagram = useCallback(async (questionId: string) => {
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
    }
  }, [geminiService, draftQuestions]);

  const handleAddCustomQuestionToSection = useCallback(
    async (text: string, category: QuestionCategory, generateDiagram: boolean) => {
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
      if (generateDiagram) {
        try {
          const diagramData = await geminiService.generateDiagramDescription(text);
          setDraftQuestions(prev => prev.map(q =>
            q.id === newQuestionId ? { ...q, diagramData, isLoadingDiagram: false, diagramError: null } : q
          ));
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
        }
      }
    }, [geminiService]
  );

  const getResolvedPointForFinalize = (
    pointRef: string | PointDef | JXG.Point, 
    createdElements: Record<string, JXG.GeometryElement>,
    _board: JXG.Board 
  ): JXG.Point | undefined => {
    if (typeof pointRef === 'string') {
      const resolved = createdElements[pointRef];
      if (resolved && resolved.elType === 'point') return resolved as JXG.Point;
      return undefined;
    }
    if (JXG.isPoint(pointRef)) return pointRef as JXG.Point;
    return undefined;
  };

  const handleFinalizePaper = useCallback(async () => {
    if (!draftQuestions.length) {
      setLocalError("No questions in the draft to finalize.");
      return;
    }
    setIsFinalizingPaper(true);
    setLocalError(null);
    setGlobalError(null);
    
    if (typeof JXG !== 'undefined' && JXG.Options) {
        (JXG.Options as any).renderer = 'svg';
        (JXG.Options as any).text.display = 'internal'; 
    }

    const finalizedQuestionItems: QuestionItem[] = [];
    const initialTempContainerWidth = 450; 
    const initialTempContainerHeight = 300;

    try { 
      for (const question of draftQuestions) {
        let staticImgOrText: string | undefined = undefined;
        let finalDescriptionForTextOnly = question.diagramData?.description; 
        let processingErrorForThisQuestion: string | null = null;
        let tempContainer: HTMLDivElement | null = null;
        let board: JXG.Board | null = null;

        if (question.diagramData && question.diagramData.representationType === 'geometry' && 
            question.diagramData.geometricElements && question.diagramData.geometricElements.length > 0) {
          
          const tempContainerId = `temp-jsxboard-finalize-${question.id}`;
          
          try { 
            let existingContainer = document.getElementById(tempContainerId);
            if (existingContainer) { 
                try { document.body.removeChild(existingContainer); } catch(e){ console.warn(`[Finalize Pre-cleanup] Minor error removing existing temp container ${tempContainerId}`, e); }
            }

            tempContainer = document.createElement('div');
            tempContainer.id = tempContainerId;
            tempContainer.style.width = `${initialTempContainerWidth}px`; 
            tempContainer.style.height = `${initialTempContainerHeight}px`;
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px'; 
            tempContainer.style.visibility = 'hidden'; 
            document.body.appendChild(tempContainer);

            let svgOutput: string | undefined;
            let svgExportMethodUsed = "unknown";

            const viewBoxParts = question.diagramData.viewBox?.split(' ').map(Number);
            const isValidViewBox = viewBoxParts && viewBoxParts.length === 4 && viewBoxParts.every(p => !isNaN(p));
            const initialBoundingBox = isValidViewBox ? viewBoxParts as [number, number, number, number] : [-5, 5, 5, -5];

            const boardAttributes: JXG.BoardAttributes = {
              boundingbox: initialBoundingBox,
              axis: false,
              showCopyright: false,
              showNavigation: false,
              pan: { enabled: false }, 
              zoom: { enabled: false },
              renderer: 'svg', 
            } as any; 

            board = JXG.JSXGraph.initBoard(tempContainerId, boardAttributes); 

            if (board) { 
              board.options.text.cssDefaultStyle = 'font-weight: normal;'; 
              board.options.text.highlightCssDefaultStyle = 'font-weight: normal;';
              board.options.text.cssClass = ''; 
              board.options.text.highlightCssClass = '';
              board.options.text.display = 'internal'; 
              
              const boardOpts = board.options as any;
              if (boardOpts.label) {
                boardOpts.label.cssDefaultStyle = 'font-weight: normal;';
                boardOpts.label.highlightCssDefaultStyle = 'font-weight: normal;';
                boardOpts.label.cssClass = '';
                boardOpts.label.highlightCssClass = '';
                boardOpts.label.autoPosition = false; 
                boardOpts.label.display = 'internal'; 
              }
            }

            if (board && board.renderer && (board.renderer as any).type === 'svg') {
              const createdElements: Record<string, JXG.GeometryElement> = {};
              const allRenderedJsxElements: JXG.GeometryElement[] = [];

              question.diagramData.geometricElements.forEach((elDef, index) => {
                const elId = elDef.id || `${elDef.type}-${index}`;
                const defaultStrokeColor = '#000000'; 
                const defaultFillColor = '#FFFFFF';   
                const defaultAngleColor = '#333333'; 
                const defaultEllipseStrokeColor = '#222222'; 
                const defaultEllipseFillColor = '#FAFAFA';
                const defaultTextColor = '#000000'; 
                
                const baseAttrs: any = { 
                    name: elDef.name || '', 
                    fixed: elDef.fixed ?? false, 
                    visible: elDef.visible ?? true,
                    strokeColor: elDef.strokeColor || elDef.color || (elDef.type === 'angle' ? defaultAngleColor : (elDef.type === 'ellipse' ? defaultEllipseStrokeColor : defaultStrokeColor)),
                    fillColor: elDef.fillColor || elDef.color || (elDef.type === 'ellipse' ? defaultEllipseFillColor : defaultFillColor), 
                    strokeOpacity: elDef.strokeOpacity ?? 1, 
                    fillOpacity: elDef.fillOpacity ?? (['ellipse', 'semicircle', 'circle', 'polygon', 'arc'].includes(elDef.type) ? 0.2 : 0.2), 
                    strokeWidth: elDef.strokeWidth || (elDef.type === 'text' ? 0 : 1.5), 
                    dash: elDef.dash || 0, 
                    label: { 
                        offset: [0,0], 
                        fontSize: 10, 
                        strokeColor: defaultTextColor, 
                        strokeOpacity: 1, 
                        useMathJax: false, 
                        cssClass: '', 
                        highlightCssClass: '', 
                        display: 'internal', 
                    },
                    highlightStrokeColor: elDef.highlightStrokeColor || defaultStrokeColor, 
                    highlightFillColor: elDef.highlightFillColor || defaultFillColor,   
                    highlightFillOpacity: elDef.highlightFillOpacity ?? 0.3,
                };

                if (elDef.type === 'text') { 
                    baseAttrs.strokeColor = elDef.strokeColor || elDef.color || defaultTextColor;
                    baseAttrs.fontSize = elDef.fontSize || 10; 
                }
                
                const specificAttrsFromDef = { ...elDef }; 
                (Object.keys(baseAttrs) as Array<keyof typeof baseAttrs>).forEach(key => delete (specificAttrsFromDef as any)[key]);
                delete (specificAttrsFromDef as any).id; delete (specificAttrsFromDef as any).type;
                delete (specificAttrsFromDef as any).coords; delete (specificAttrsFromDef as any).points; 
                delete (specificAttrsFromDef as any).center; delete (specificAttrsFromDef as any).radius; delete (specificAttrsFromDef as any).radiusPoint; delete (specificAttrsFromDef as any).anglePoint; 
                delete (specificAttrsFromDef as any).vertices; delete (specificAttrsFromDef as any).functionString; delete (specificAttrsFromDef as any).xDomain; 
                delete (specificAttrsFromDef as any).horizontalRadius; delete (specificAttrsFromDef as any).verticalRadius; delete (specificAttrsFromDef as any).text;
                
                let finalLabelConfig = { ...baseAttrs.label };
                if (elDef.label && typeof elDef.label === 'object') {
                    finalLabelConfig = { ...finalLabelConfig, ...elDef.label };
                     if (elDef.label.fontSize) finalLabelConfig.fontSize = elDef.label.fontSize; 
                     finalLabelConfig.display = 'internal'; 
                }

                if (elDef.type === 'point' && (!elDef.label || elDef.label.offset === undefined)) {
                    finalLabelConfig.offset = [2, -3]; 
                }
                if (elDef.type === 'angle' && (!elDef.label || elDef.label.offset === undefined)) {
                    finalLabelConfig.offset = [0,0]; 
                    finalLabelConfig.strokeColor = finalLabelConfig.strokeColor || defaultAngleColor;
                }

                const commonAttrsFinal = { ...baseAttrs, ...specificAttrsFromDef, name: elDef.name || '', label: finalLabelConfig }; 

                let jsxElement: JXG.GeometryElement | undefined;
                try {
                    switch (elDef.type as string) { 
                        case 'point':
                            const pointDef = elDef as PointDef;
                            let parsedCoordsFinalize: [number, number] | null = null;
                            if (Array.isArray(pointDef.coords) && pointDef.coords.length === 2) {
                                const x = pointDef.coords[0]; const y = pointDef.coords[1];
                                if (typeof x === 'number' && !isNaN(x) && typeof y === 'number' && !isNaN(y)) parsedCoordsFinalize = [x, y];
                            }
                            if (parsedCoordsFinalize) jsxElement = board.create('point', parsedCoordsFinalize, { ...commonAttrsFinal, size: pointDef.size || 1.5 }); 
                            break;
                        case 'line': {
                            const p1 = getResolvedPointForFinalize((elDef as LineDef).points[0], createdElements, board);
                            const p2 = getResolvedPointForFinalize((elDef as LineDef).points[1], createdElements, board);
                            if (p1 && p2) jsxElement = board.create('line', [p1, p2], commonAttrsFinal);
                            break;
                        }
                        case 'segment': {
                            const p1 = getResolvedPointForFinalize((elDef as SegmentDef).points[0], createdElements, board);
                            const p2 = getResolvedPointForFinalize((elDef as SegmentDef).points[1], createdElements, board);
                            if (p1 && p2) jsxElement = board.create('segment', [p1, p2], commonAttrsFinal);
                            break;
                        }
                        case 'semicircle': {
                            const p1 = getResolvedPointForFinalize((elDef as SemicircleDef).points[0], createdElements, board);
                            const p2 = getResolvedPointForFinalize((elDef as SemicircleDef).points[1], createdElements, board);
                            if (p1 && p2) jsxElement = board.create('semicircle', [p1, p2], commonAttrsFinal);
                            break;
                        }
                        case 'circle': {
                            const center = getResolvedPointForFinalize((elDef as CircleDef).center, createdElements, board);
                            if (center && typeof (elDef as CircleDef).radius === 'number' && !isNaN((elDef as CircleDef).radius as number)) {
                                jsxElement = board.create('circle', [center, (elDef as CircleDef).radius as number], commonAttrsFinal);
                            }
                            break;
                        }
                        case 'arc': {
                            const center = getResolvedPointForFinalize((elDef as ArcDef).center, createdElements, board);
                            const radiusPt = getResolvedPointForFinalize((elDef as ArcDef).radiusPoint, createdElements, board);
                            const anglePt = getResolvedPointForFinalize((elDef as ArcDef).anglePoint, createdElements, board);
                            if (center && radiusPt && anglePt) jsxElement = board.create('arc', [center, radiusPt, anglePt], commonAttrsFinal);
                            break;
                        }
                        case 'polygon': {
                            const vertices = ((elDef as PolygonDef).vertices)
                                .map(vRef => getResolvedPointForFinalize(vRef, createdElements, board))
                                .filter(v => v !== undefined) as JXG.Point[];
                            if (vertices.length >= 2 && vertices.length === (elDef as PolygonDef).vertices.length) jsxElement = board.create('polygon', vertices, commonAttrsFinal);
                            break;
                        }
                        case 'functiongraph':
                            const fgDef = elDef as FunctionGraphDef;
                            if (fgDef.functionString && fgDef.xDomain && fgDef.xDomain.length === 2 && typeof fgDef.xDomain[0] === 'number' && typeof fgDef.xDomain[1] === 'number') {
                                try {
                                    const func = new Function('x', 'return ' + fgDef.functionString);
                                    jsxElement = board.create('functiongraph', [func, fgDef.xDomain[0], fgDef.xDomain[1]], commonAttrsFinal);
                                } catch (e) { console.error(`[Finalize] Functiongraph error for ${elId}:`, e); }
                            }
                            break;
                        case 'angle': {
                            const angleDef = elDef as AngleDef;
                            const p1 = getResolvedPointForFinalize(angleDef.points[0], createdElements, board);
                            const vertex = getResolvedPointForFinalize(angleDef.points[1], createdElements, board);
                            const p2 = getResolvedPointForFinalize(angleDef.points[2], createdElements, board);
                            if (p1 && vertex && p2) jsxElement = board.create('nonreflexangle', [p1, vertex, p2], { ...commonAttrsFinal, radius: angleDef.radius || 0.5 }); 
                            break;
                        }
                        case 'ellipse': { 
                            const ellipseDef = elDef as EllipseDef;
                            const centerPt = getResolvedPointForFinalize(ellipseDef.center, createdElements, board);
                            if (centerPt && typeof ellipseDef.horizontalRadius === 'number' && typeof ellipseDef.verticalRadius === 'number') {
                                if (Math.abs(ellipseDef.horizontalRadius - ellipseDef.verticalRadius) < 1e-6) { 
                                  jsxElement = board.create('circle', [centerPt, ellipseDef.horizontalRadius], commonAttrsFinal);
                                } else {
                                    const a = ellipseDef.horizontalRadius; const b = ellipseDef.verticalRadius;
                                    let f1CoordX, f1CoordY, f2CoordX, f2CoordY, sumDist;
                                    const fpAttrs = { visible: false, name: '', fixed: true };
                                    if (a >= b) { 
                                        const c = Math.sqrt(a*a - b*b);
                                        f1CoordX = centerPt.X() - c; f1CoordY = centerPt.Y();
                                        f2CoordX = centerPt.X() + c; f2CoordY = centerPt.Y();
                                        sumDist = 2 * a;
                                    } else { 
                                        const c = Math.sqrt(b*b - a*a);
                                        f1CoordX = centerPt.X(); f1CoordY = centerPt.Y() - c;
                                        f2CoordX = centerPt.X(); f2CoordY = centerPt.Y() + c;
                                        sumDist = 2 * b;
                                    }
                                    const f1 = board.create('point', [f1CoordX, f1CoordY], fpAttrs);
                                    const f2 = board.create('point', [f2CoordX, f2CoordY], fpAttrs);
                                    jsxElement = board.create('ellipse', [f1, f2, sumDist], commonAttrsFinal);
                                }
                            }
                            break;
                        }
                        case 'text': {
                            const textDef = elDef as TextDef;
                            let parsedCoordsTextFinalize: [number, number] | null = null;
                            if (Array.isArray(textDef.coords) && textDef.coords.length === 2) {
                                const x = textDef.coords[0]; const y = textDef.coords[1];
                                if (typeof x === 'number' && !isNaN(x) && typeof y === 'number' && !isNaN(y)) parsedCoordsTextFinalize = [x, y];
                            }
                            if (parsedCoordsTextFinalize && textDef.text && typeof textDef.text === 'string') {
                                const finalizedTextColor = textDef.strokeColor || textDef.color || defaultTextColor;
                                const textElementAttributes: any = {
                                    fixed: textDef.fixed ?? false, visible: textDef.visible ?? true,
                                    fontSize: textDef.fontSize || finalLabelConfig.fontSize, 
                                    strokeColor: finalizedTextColor, 
                                    strokeOpacity: 1, useMathJax: textDef.useMathJax ?? false, cssClass: '', highlightCssClass: '',
                                    display: 'internal', anchorX: textDef.anchorX || 'left', anchorY: textDef.anchorY || 'middle', 
                                };
                                if (textDef.highlightStrokeColor) textElementAttributes.highlightStrokeColor = textDef.highlightStrokeColor;
                                if (textElementAttributes.fillColor) delete textElementAttributes.fillColor; 
                                if (textElementAttributes.fillOpacity) delete textElementAttributes.fillOpacity; 
                                jsxElement = board.create('text', [parsedCoordsTextFinalize[0], parsedCoordsTextFinalize[1], textDef.text], textElementAttributes);
                            }
                            break;
                        }
                    }
                } catch (e: any) {
                    console.error(`[Finalize] Error creating element ${elId} (${elDef.type}): ${e.message}`, e.stack);
                }

                if (jsxElement) {
                    allRenderedJsxElements.push(jsxElement);
                    if (elDef.id) createdElements[elDef.id] = jsxElement;
                }
              });
              
              if (allRenderedJsxElements.length > 0) {
                  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY_elBounds = -Infinity; 
                  allRenderedJsxElements.forEach(el => {
                      if (el.visProp.visible && typeof (el as any).bounds === 'function') {
                          const bounds = (el as any).bounds(); 
                          if (bounds && bounds.length === 4 && bounds.every(isFinite)) {
                              minX = Math.min(minX, bounds[0]);         
                              maxY_elBounds = Math.max(maxY_elBounds, bounds[1]); 
                              maxX = Math.max(maxX, bounds[2]);         
                              minY = Math.min(minY, bounds[3]);         
                          }
                      }
                  });

                  if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY_elBounds)) {
                      const contentWidth = maxX - minX; 
                      const contentHeight = maxY_elBounds - minY; 
                      const paddingX = Math.max(contentWidth * 0.15, 0.5); 
                      const paddingY = Math.max(contentHeight * 0.15, 0.5); 
                      
                      const finalLeft = minX - paddingX;
                      const finalTop = maxY_elBounds + paddingY;
                      const finalRight = maxX + paddingX;
                      const finalBottom = minY - paddingY;

                      board.setBoundingBox([finalLeft, finalTop, finalRight, finalBottom], false); 
                  } else {
                      board.zoomElements(allRenderedJsxElements.filter(el => el.visProp.visible));
                  }
              }
              
              const currentBBox = board.getBoundingBox(); 
              const contentNativeWidth = Math.abs(currentBBox[2] - currentBBox[0]);
              const contentNativeHeight = Math.abs(currentBBox[1] - currentBBox[3]);

              let finalCanvasWidth = 400;  
              let finalCanvasHeight = 250; 
              const MAX_PRINT_HEIGHT = 300; 
              const MAX_PRINT_WIDTH = 500;  

              if (contentNativeWidth > 1e-6 && contentNativeHeight > 1e-6) { 
                  const aspectRatio = contentNativeWidth / contentNativeHeight;
                  
                  let canvasW = finalCanvasWidth; 
                  let canvasH = canvasW / aspectRatio;

                  if (canvasH > MAX_PRINT_HEIGHT) { 
                      canvasH = MAX_PRINT_HEIGHT;     
                      canvasW = canvasH * aspectRatio;  
                  }
                  if (canvasW > MAX_PRINT_WIDTH) { 
                      canvasW = MAX_PRINT_WIDTH;      
                      canvasH = canvasW / aspectRatio;  
                  }
                  finalCanvasWidth = Math.max(50, Math.round(canvasW)); 
                  finalCanvasHeight = Math.max(50, Math.round(canvasH)); 
              }

              if(tempContainer) {
                tempContainer.style.width = `${finalCanvasWidth}px`;
                tempContainer.style.height = `${finalCanvasHeight}px`;
              }
              (board.renderer as any).resize(finalCanvasWidth, finalCanvasHeight); 
              board.update(); board.fullUpdate(); 
              await new Promise(resolve => setTimeout(resolve, 200)); 

              if (typeof (board as any).toSVG === 'function') {
                  try {
                      const tempSvgOutput = (board as any).toSVG();
                      if (tempSvgOutput && tempSvgOutput.includes('<svg')) { svgOutput = tempSvgOutput; svgExportMethodUsed = "board.toSVG"; } 
                  } catch (e) { console.warn(`[Finalize WARN - ${question.id}] board.toSVG() error: ${(e as Error).message}.`); }
              }
              if (!svgOutput && board.renderer && typeof (board.renderer as any).dumpToSVG === 'function') {
                  try {
                      const tempSvgOutput = (board.renderer as any).dumpToSVG();
                      if (tempSvgOutput && tempSvgOutput.includes('<svg')) { svgOutput = tempSvgOutput; svgExportMethodUsed = "board.renderer.dumpToSVG"; }
                  } catch (e) { console.warn(`[Finalize WARN - ${question.id}] dumpToSVG() error: ${(e as Error).message}.`); }
              }
              if (!svgOutput && tempContainer) {
                  const svgElement = tempContainer.querySelector('svg');
                  if (svgElement) {
                      try {
                          const defsElement = svgElement.querySelector('defs');
                          if (defsElement) { defsElement.querySelectorAll('filter').forEach(f => f.remove()); }
                          const domSvg = new XMLSerializer().serializeToString(svgElement);
                          if (domSvg && domSvg.includes('<svg')) { svgOutput = domSvg; svgExportMethodUsed = "DOM_XMLSerializer_NoFilters"; }
                      } catch (e) {
                          const basicDomSvg = svgElement.outerHTML;
                          if (basicDomSvg && basicDomSvg.includes('<svg')) { svgOutput = basicDomSvg; svgExportMethodUsed = "DOM_outerHTML_Fallback"; }
                      }
                  }
              }
            
              if (svgOutput) {
                try {
                  let modifiedSvgOutput = svgOutput;
                  try {
                      const parser = new DOMParser();
                      const svgDoc = parser.parseFromString(svgOutput, "image/svg+xml");
                      const svgElement = svgDoc.documentElement;
              
                      if (svgElement && svgElement.nodeName.toLowerCase() === 'svg') {
                          svgElement.setAttribute('width', `${finalCanvasWidth}px`);
                          svgElement.setAttribute('height', `${finalCanvasHeight}px`);
                          modifiedSvgOutput = new XMLSerializer().serializeToString(svgElement);
                      }
                  } catch (domError) { /* Use original */ }

                  staticImgOrText = await new Promise<string>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = finalCanvasWidth; 
                      canvas.height = finalCanvasHeight; 
                      const ctx = canvas.getContext('2d');
                      if (!ctx) { reject(new Error("Failed to get canvas 2D context.")); return; }
                      ctx.fillStyle = 'white'; ctx.fillRect(0, 0, finalCanvasWidth, finalCanvasHeight);
                      ctx.drawImage(img, 0, 0, finalCanvasWidth, finalCanvasHeight);
                      try { resolve(canvas.toDataURL('image/png')); } 
                      catch (canvasError: any) { reject(new Error(`Canvas toDataURL error: ${canvasError.message}`)); }
                    };
                    img.onerror = (errEvent) => {
                      let errMsg = "Unknown image load error";
                      if (errEvent instanceof ErrorEvent && errEvent.error) errMsg = errEvent.error.message || String(errEvent.error);
                      reject(new Error(`Failed to load SVG into Image. Error: ${errMsg}`));
                    };
                    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(modifiedSvgOutput)}`;
                  }).catch(conversionError => {
                      processingErrorForThisQuestion = `Diagram image generation failed (PNG conversion: ${(conversionError as Error).message}).`;
                      return (finalDescriptionForTextOnly ? finalDescriptionForTextOnly + "\n" : "") + processingErrorForThisQuestion;
                  });
                } catch(svgToPngError: any) {
                  processingErrorForThisQuestion = `Diagram image generation failed (PNG setup: ${svgToPngError.message}).`;
                  finalDescriptionForTextOnly = (finalDescriptionForTextOnly ? finalDescriptionForTextOnly + "\n" : "") + processingErrorForThisQuestion;
                  staticImgOrText = finalDescriptionForTextOnly;
                }
              } else { 
                  processingErrorForThisQuestion = "Diagram could not be generated (SVG export failed).";
                  finalDescriptionForTextOnly = (finalDescriptionForTextOnly ? finalDescriptionForTextOnly + "\n" : "") + processingErrorForThisQuestion;
                  staticImgOrText = finalDescriptionForTextOnly;
              }
            } else { 
              processingErrorForThisQuestion = "Diagram rendering setup failed (board/renderer invalid).";
              finalDescriptionForTextOnly = (finalDescriptionForTextOnly ? finalDescriptionForTextOnly + "\n" : "") + processingErrorForThisQuestion;
              staticImgOrText = finalDescriptionForTextOnly;
            }

          } catch (e: any) { 
            const errorMessage = e instanceof Error ? e.message : String(e);
            processingErrorForThisQuestion = `Error generating diagram: ${errorMessage}`;
            finalDescriptionForTextOnly = (finalDescriptionForTextOnly ? finalDescriptionForTextOnly + "\n" : "") + processingErrorForThisQuestion;
            staticImgOrText = finalDescriptionForTextOnly; 
          } finally {
            if (board) {
              try { JXG.JSXGraph.freeBoard(board); } catch (eFree) { console.error(`[Finalize FINALLY ERROR] Error freeing board for ${question.id}:`, eFree); }
            }
            if (tempContainer && tempContainer.parentElement === document.body) {
              try { document.body.removeChild(tempContainer); } catch (eRemove) { console.error(`[Finalize FINALLY ERROR] Error removing temp container for ${question.id}:`, eRemove); }
            }
          }
        } else if (finalDescriptionForTextOnly) { 
           staticImgOrText = finalDescriptionForTextOnly;
        } else { 
           staticImgOrText = "No diagram applicable or provided.";
        }
        
        try {
            finalizedQuestionItems.push({
              ...question,
              diagramData: null, 
              staticDiagramImage: staticImgOrText, 
              isLoadingDiagram: false,
              diagramError: processingErrorForThisQuestion ? { message: processingErrorForThisQuestion } : null,
            });
        } catch (pushError) {
            console.error(`[FinalizePaper CRITICAL PUSH ERROR] Failed to push question ${question.id} to finalizedItems:`, pushError);
            throw pushError; 
        }
      }
    } catch (loopError) { 
        console.error("[FinalizePaper CRITICAL LOOP ERROR] An error occurred during the question finalization loop:", loopError);
        setGlobalError(`A critical error occurred while processing questions. Error: ${(loopError as Error).message}`);
    }

    setFinalQuestions(finalizedQuestionItems);
    setCurrentView('final');
    setIsFinalizingPaper(false);
  }, [geminiService, draftQuestions, setGlobalError]); 

  if (localError && !globalError) { 
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-yellow-50 rounded-xl border border-yellow-200" role="alert">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-gray-200">
          <LightBulbIcon className="w-16 h-16 text-yellow-500 mb-6 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Notice</h1>
          <p className="text-gray-600 mb-6">{localError}</p>
          <button 
              onClick={() => { setLocalError(null); handleBackToConfig(); }} 
              className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
          >
              Go Back to Configuration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {(isLoadingTextGeneration || isFinalizingPaper) && (currentView === 'config' || currentView === 'draft') && (
           <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <LoadingSpinner 
                size="large"
                text={isLoadingTextGeneration ? "Generating your draft question paper text..." : "Finalizing your question paper..."}
              />
              <p className="text-gray-500 mt-4 text-center">
                  {isLoadingTextGeneration ? "The AI is crafting questions." : "Converting diagrams to static images."} This may take some time.
              </p>
          </div>
      )}

      {currentView === 'config' && !isLoadingTextGeneration && !isFinalizingPaper && (
          <ConfigurationPanel 
            onSubmit={handleConfigurationSubmit} 
            isLoading={isLoadingTextGeneration} 
          />
      )}

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
        />
      )}
      
      {currentView === 'draft' && isFinalizingPaper && (
         <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <LoadingSpinner size="large" text="Finalizing your question paper..." />
            <p className="text-gray-500 mt-4 text-center">Converting diagrams to static images. This may take some time.</p>
        </div>
      )}

      {currentView === 'final' && paperConfig && ( 
          <FinalQuestionPaperView
              config={paperConfig}
              questions={finalQuestions}
              isFinalizing={isFinalizingPaper} 
              onBackToDraft={handleBackToDraft}
              onStartNewPaper={handleStartNewPaperFromFinal}
          />
      )}
      
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

export default PaperGeneratorPage;