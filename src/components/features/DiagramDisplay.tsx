
import React, { useEffect, useRef, useId, useState } from 'react';
import type { DiagramData, DiagramElement, RepresentationType, GeometricElement, PointDef, AngleDef, EllipseDef, SemicircleDef, LineDef, SegmentDef, TextDef, CircleDef, ArcDef, PolygonDef, FunctionGraphDef } from '../../types';
import { DocumentTextIcon, ShapesIcon } from '../../config'; 
import JXG from 'jsxgraph'; 

// SVG Renderer (kept for potential fallback or non-geometric diagrams)
const renderElementSVG = (element: DiagramElement, index: number): React.ReactNode => {
  const commonProps = {
    key: `${element.id}-${index}`,
    fill: element.color || (element.type === 'text' ? 'currentColor' : '#d1fae5'), // accent-100 for light fill
    stroke: element.color || '#2563eb', // primary-600 for stroke
    strokeWidth: (element as any).strokeWidth || (element.type === 'line' ? 2 : 1.5),
  };
  
  const labelCommonProps = {
    fontSize: "10px",
    fill: "rgb(71, 85, 105)", // slate-600 for labels
    textAnchor: "middle" as const,
  };

  switch (element.type) {
    case 'circle':
      return (
        <g key={commonProps.key}>
          <circle
            cx={element.x}
            cy={element.y}
            r={element.radius}
            {...commonProps}
          />
          {element.label && (
            <text x={element.x} y={element.y + element.radius + 12} {...labelCommonProps}>
              {element.label}
            </text>
          )}
        </g>
      );
    case 'rectangle':
      return (
        <g key={commonProps.key}>
          <rect
            x={element.x - element.width / 2} 
            y={element.y - element.height / 2}
            width={element.width}
            height={element.height}
            rx={4} 
            {...commonProps}
          />
          {element.label && (
            <text x={element.x} y={element.y + element.height / 2 + 12} {...labelCommonProps}>
              {element.label}
            </text>
          )}
        </g>
      );
    case 'line':
      return (
         <g key={commonProps.key}>
          <line
            x1={element.x1}
            y1={element.y1}
            x2={element.x2}
            y2={element.y2}
            {...commonProps}
          />
           {element.label && (
            <text 
              x={element.labelX || (element.x1 + element.x2) / 2} 
              y={(element.labelY || (element.y1 + element.y2) / 2) - 5} 
              {...labelCommonProps}
              fill={element.color || "rgb(59, 130, 246)"} // primary-500 for line labels
            >
              {element.label}
            </text>
          )}
        </g>
      );
    case 'text':
      return (
        <text
          key={commonProps.key}
          x={element.x}
          y={element.y}
          fontSize={element.fontSize || 12}
          fill={element.color || 'rgb(51, 65, 85)'} // slate-700
          textAnchor={element.anchor || 'middle'}
        >
          {element.text}
          {element.label && ` (${element.label})`}
        </text>
      );
    default:
      return null;
  }
};


export const DiagramDisplay: React.FC<{ data: DiagramData; originalQuestion: string; }> = ({ data, originalQuestion }) => {
  const defaultViewBoxSVG = "0 0 300 200";
  const jsxGraphBoardRef = useRef<JXG.Board | null>(null);
  const jsxGraphContainerId = useId() + '-jsxgraph-board'; 
  const [jsxError, setJsxError] = useState<string | null>(null);
  const [isBoardReady, setIsBoardReady] = useState<boolean>(false); 

  useEffect(() => {
    setIsBoardReady(false); 

    if (data.representationType === 'geometry' && data.geometricElements) {
      let currentJsxError: string | null = null;
      setJsxError(null); 
      const allRenderedJsxElements: JXG.GeometryElement[] = [];
      const createdElements: Record<string, JXG.GeometryElement> = {};

      if (jsxGraphBoardRef.current) {
        try {
            if (typeof JXG !== 'undefined' && JXG.JSXGraph) {
                JXG.JSXGraph.freeBoard(jsxGraphBoardRef.current);
            }
        } catch (e) {
            console.error("[DiagramDisplay] Error freeing existing board in useEffect before new init:", e);
        }
        jsxGraphBoardRef.current = null;
      }

      const boardContainer = document.getElementById(jsxGraphContainerId);
      if (!boardContainer) {
        console.error("JSXGraph container not found in the DOM.");
        currentJsxError = "JSXGraph container not found in the DOM.";
        setJsxError(currentJsxError);
        return;
      }
      boardContainer.innerHTML = ''; 

      try {
        if (typeof JXG === 'undefined' || !JXG.JSXGraph) {
            throw new Error("JSXGraph library (JXG or JXG.JSXGraph) is not available.");
        }
        const defaultGraphBoundingBox: [number, number, number, number] = [-10, 10, 10, -10];
        const defaultShapeBoundingBox: [number, number, number, number] = [-5, 5, 5, -5];
        
        let determinedBoundingBox: [number, number, number, number];
        if (data.viewBox) {
          const parts = data.viewBox.split(' ').map(Number);
          if (parts.length === 4 && parts.every(p => typeof p === 'number' && !isNaN(p))) {
            determinedBoundingBox = parts as [number, number, number, number];
          } else {
            console.warn(`Invalid viewBox format: "${data.viewBox}", using default bounding box.`);
            determinedBoundingBox = data.geometricElements && data.geometricElements.some(el => el.type === 'functiongraph') 
                                    ? defaultGraphBoundingBox 
                                    : defaultShapeBoundingBox;
          }
        } else {
          determinedBoundingBox = data.geometricElements && data.geometricElements.some(el => el.type === 'functiongraph') 
                                  ? defaultGraphBoundingBox 
                                  : defaultShapeBoundingBox;
        }
        
        const board = JXG.JSXGraph.initBoard(jsxGraphContainerId, {
          boundingbox: determinedBoundingBox,
          axis: false, 
          showCopyright: false,
          showNavigation: true,
          pan: {enabled: true, needShift: false},
          zoom: {factorX: 1.25, factorY: 1.25, wheel: true, needShift: false},
          grid: false, 
          renderer: 'svg', // Explicitly set renderer for reliability
          defaultAxes: { 
            x: { 
              strokeColor: '#94a3b8', 
              ticks: { 
                  strokeColor: '#cbd5e1' 
              }
            },
            y: { 
              strokeColor: '#94a3b8', 
              ticks: { 
                  strokeColor: '#cbd5e1' 
              }
            }
          }
        } as unknown as JXG.BoardAttributes); 
        
        if (board) {
            jsxGraphBoardRef.current = board; 
            if (board.options && board.options.text) {
              (board.options.text as any).display = 'internal';
            }
        } else {
            throw new Error("JXG.JSXGraph.initBoard returned null or undefined.");
        }
        
        const getResolvedPoint = (pointRef: string | PointDef | JXG.Point): JXG.Point | undefined => {
          if (typeof pointRef === 'string') {
            const resolved = createdElements[pointRef];
            if (resolved && resolved.elType === 'point') return resolved as JXG.Point;
            console.warn(`[DiagramDisplay] Point ID "${pointRef}" could not be resolved. Available point IDs at this time: [${Object.keys(createdElements).filter(k => createdElements[k]?.elType === 'point').join(', ')}]. All created element IDs: [${Object.keys(createdElements).join(', ')}]`);
            currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Failed to find point reference: '${pointRef}'. Some elements might not render correctly.`;
            return undefined;
          }
          if (JXG.isPoint(pointRef)) return pointRef as JXG.Point; 
          if (typeof pointRef === 'object' && (pointRef as PointDef).type === 'point') { 
             console.warn(`[DiagramDisplay] Direct PointDef object used as a reference instead of an ID for point: ${ (pointRef as PointDef).id || 'unknown_inline_point_ref'}. This point should be defined separately in geometricElements.`);
             currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Unsupported inline point definition used as reference: '${(pointRef as PointDef).id || 'unknown_inline_point_ref'}'. Define points separately.`;
          }
          return undefined; 
        };

        const createGeometricElement = (elDef: GeometricElement, pass: 'points' | 'others'): JXG.GeometryElement | undefined => {
            const elId = elDef.id || `${elDef.type}-${pass === 'points' ? 'pointpass' : 'otherpass'}-${Math.random().toString(36).substring(2,7)}`;
            const defaultStrokeColor = '#1d4ed8'; 
            const defaultFillColor = '#d1fae5';   
            const defaultAngleColor = '#ef4444'; 
            const defaultEllipseStrokeColor = '#6b7280'; 
            const defaultEllipseFillColor = '#d1d5db';
            const defaultTextColor = '#334155';
            
            const commonAttrs: any = { 
              name: elDef.name || '', 
              fixed: elDef.fixed ?? false,
              visible: elDef.visible ?? true,
              strokeColor: elDef.strokeColor || elDef.color || (elDef.type === 'angle' ? defaultAngleColor : (elDef.type === 'ellipse' ? defaultEllipseStrokeColor : (elDef.type === 'text' ? defaultTextColor : defaultStrokeColor))),
              fillColor: elDef.fillColor || elDef.color || (elDef.type === 'ellipse' ? defaultEllipseFillColor : defaultFillColor), 
              strokeOpacity: elDef.strokeOpacity ?? (elDef.type === 'text' ? 1 : 0.9),
              fillOpacity: elDef.fillOpacity ?? (elDef.type === 'ellipse' || elDef.type === 'semicircle' || elDef.type === 'circle' || elDef.type === 'polygon' || elDef.type === 'arc' ? 0.4 : 0.4),
              strokeWidth: elDef.strokeWidth || (elDef.type === 'ellipse' ? 1.5 : (elDef.type === 'text' ? 0 : 2)),
              dash: elDef.dash || 0, 
              label: { 
                  offset: elDef.label?.offset || [5,5], 
                  fontSize: elDef.label?.fontSize || 12, 
                  strokeColor: elDef.label?.color || (elDef.type === 'angle' ? defaultAngleColor : defaultTextColor), 
                  useMathJax: elDef.label?.useMathJax ?? false,
                  cssClass: 'text-slate-700 jsxgraph-label', 
                  highlightCssClass: 'text-primary-600 jsxgraph-label-highlight',
                  display: 'internal', // Ensure labels are also SVG for export
               },
              highlightStrokeColor: elDef.highlightStrokeColor || '#60a5fa', 
              highlightFillColor: elDef.highlightFillColor || '#34d399',   
              highlightFillOpacity: elDef.highlightFillOpacity ?? 0.5,
              ...elDef, 
            };
            delete commonAttrs.id; delete commonAttrs.type; delete commonAttrs.coords; delete commonAttrs.points; 
            delete commonAttrs.center; delete commonAttrs.radius; delete commonAttrs.radiusPoint; delete commonAttrs.anglePoint; 
            delete commonAttrs.vertices; delete commonAttrs.functionString; delete commonAttrs.xDomain; 
            delete commonAttrs.horizontalRadius; delete commonAttrs.verticalRadius; delete commonAttrs.text;

            let jsxElement: JXG.GeometryElement | undefined;

            try {
                switch (elDef.type as string) {
                  case 'point':
                    if (pass !== 'points') return undefined; 
                    const pointDef = elDef as PointDef;
                    let parsedCoords: [number, number] | null = null;
                    if (Array.isArray(pointDef.coords) && pointDef.coords.length === 2) {
                        let x_val = pointDef.coords[0];
                        let y_val = pointDef.coords[1];
                        if (typeof x_val === 'string') x_val = parseFloat(x_val as string);
                        if (typeof y_val === 'string') y_val = parseFloat(y_val as string);
                        
                        if (typeof x_val === 'number' && !isNaN(x_val) && typeof y_val === 'number' && !isNaN(y_val)) {
                            parsedCoords = [x_val, y_val];
                        }
                    }
                    if (!parsedCoords) {
                      console.error(`[DiagramDisplay] Invalid or non-numeric coordinates for point '${elId}':`, pointDef.coords);
                      currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped point '${elId}': Invalid/non-numeric coordinates (${JSON.stringify(pointDef.coords)}).`;
                    } else {
                      jsxElement = board.create('point', parsedCoords, { ...commonAttrs, size: pointDef.size || 3 });
                    }
                    break;
                  case 'line': {
                    if (pass !== 'others') return undefined;
                    const lineDef = elDef as LineDef;
                    const p1 = getResolvedPoint(lineDef.points[0]); const p2 = getResolvedPoint(lineDef.points[1]);
                    if (p1 && p2) jsxElement = board.create('line', [p1, p2], commonAttrs);
                    else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped line '${elId}': Missing point definitions.`;
                    break;
                  }
                  case 'segment': {
                    if (pass !== 'others') return undefined;
                    const segmentDef = elDef as SegmentDef;
                    const p1 = getResolvedPoint(segmentDef.points[0]); const p2 = getResolvedPoint(segmentDef.points[1]);
                    if (p1 && p2) jsxElement = board.create('segment', [p1, p2], commonAttrs);
                    else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped segment '${elId}': Missing point definitions.`;
                    break;
                  }
                  case 'semicircle': {
                    if (pass !== 'others') return undefined;
                    const semicircleDef = elDef as SemicircleDef;
                    const p1 = getResolvedPoint(semicircleDef.points[0]); const p2 = getResolvedPoint(semicircleDef.points[1]);
                    if (p1 && p2) jsxElement = board.create('semicircle', [p1, p2], commonAttrs);
                    else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped semicircle '${elId}': Missing point definitions.`;
                    break;
                  }
                  case 'circle': {
                    if (pass !== 'others') return undefined;
                    const circleDef = elDef as CircleDef;
                    const center = getResolvedPoint(circleDef.center);
                    if (center && typeof circleDef.radius === 'number' && !isNaN(circleDef.radius)) jsxElement = board.create('circle', [center, circleDef.radius as number], commonAttrs);
                    else if (!center) currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped circle '${elId}': Missing center point.`;
                    else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped circle '${elId}': Invalid radius (${circleDef.radius}).`;
                    break;
                  }
                  case 'arc': {
                      if (pass !== 'others') return undefined;
                      const arcDef = elDef as ArcDef;
                      const center = getResolvedPoint(arcDef.center);
                      const radiusPoint = getResolvedPoint(arcDef.radiusPoint);
                      const anglePoint = getResolvedPoint(arcDef.anglePoint);
                      if (center && radiusPoint && anglePoint) jsxElement = board.create('arc', [center, radiusPoint, anglePoint], commonAttrs);
                      else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped arc '${elId}': Missing point definitions for center, radiusPoint, or anglePoint.`;
                      break;
                  }
                  case 'polygon': {
                    if (pass !== 'others') return undefined;
                    const polygonDef = elDef as PolygonDef;
                    const vertices: JXG.Point[] = []; let allVerticesFound = true;
                    for (const vRef of polygonDef.vertices) {
                      const v = getResolvedPoint(vRef);
                      if (v) vertices.push(v); else { allVerticesFound = false; break; }
                    }
                    if (allVerticesFound && vertices.length >= 2) jsxElement = board.create('polygon', vertices, commonAttrs);
                    else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped polygon '${elId}': Not enough valid vertices (found ${vertices.length}, need >=2).`;
                    break;
                  }
                  case 'functiongraph': {
                    if (pass !== 'others') return undefined;
                    const funcGraphDef = elDef as FunctionGraphDef;
                    if (!Array.isArray(funcGraphDef.xDomain) || funcGraphDef.xDomain.length !== 2 || typeof funcGraphDef.xDomain[0] !== 'number' || typeof funcGraphDef.xDomain[1] !== 'number' || isNaN(funcGraphDef.xDomain[0]) || isNaN(funcGraphDef.xDomain[1])) {
                       currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped function graph '${elId}': Invalid xDomain. Expected [number, number], got ${JSON.stringify(funcGraphDef.xDomain)}.`;
                    } else if (!funcGraphDef.functionString || typeof funcGraphDef.functionString !== 'string') {
                       currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped function graph '${elId}': Missing or invalid functionString.`;
                    } else {
                      try {
                        const func = new Function('x', 'return ' + funcGraphDef.functionString);
                        jsxElement = board.create('functiongraph', [func, funcGraphDef.xDomain[0], funcGraphDef.xDomain[1]], commonAttrs);
                      } catch (e: any) {
                        console.error(`[DiagramDisplay] Error creating function from string for '${elId}': ${funcGraphDef.functionString}`, e);
                        currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped function graph '${elId}': Invalid function string. ${e.message}`;
                      }
                    }
                    break;
                  }
                  case 'angle': {
                    if (pass !== 'others') return undefined;
                    const angleDef = elDef as AngleDef;
                    const p1 = getResolvedPoint(angleDef.points[0]); const vertex = getResolvedPoint(angleDef.points[1]); const p2 = getResolvedPoint(angleDef.points[2]);
                    if (p1 && vertex && p2) jsxElement = board.create('nonreflexangle', [p1, vertex, p2], { ...commonAttrs, radius: angleDef.radius || 1 });
                    else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped angle '${elId}': Missing point definitions.`;
                    break;
                  }
                  case 'ellipse': {
                    if (pass !== 'others') return undefined;
                    const ellipseDef = elDef as EllipseDef;
                    const centerPt = getResolvedPoint(ellipseDef.center);
                    if (!centerPt) { currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped ellipse '${elId}': Center point '${ellipseDef.center}' not found or invalid.`; break; }
                    if (typeof ellipseDef.horizontalRadius !== 'number' || isNaN(ellipseDef.horizontalRadius) || typeof ellipseDef.verticalRadius !== 'number' || isNaN(ellipseDef.verticalRadius)) { currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped ellipse '${elId}': Invalid or non-numeric radii. hR=${ellipseDef.horizontalRadius}, vR=${ellipseDef.verticalRadius}.`; break; }
                    if (ellipseDef.horizontalRadius <= 0 || ellipseDef.verticalRadius <= 0) { currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped ellipse '${elId}': Radii must be positive. hR=${ellipseDef.horizontalRadius}, vR=${ellipseDef.verticalRadius}.`; break; }
                    const a = ellipseDef.horizontalRadius; const b = ellipseDef.verticalRadius;
                    let focus1: JXG.Point, focus2: JXG.Point, sumOfDistances: number;
                    const focusPointAttributes = { visible: false, name: '', fixed: true };
                    if (Math.abs(a - b) < 1e-9) { focus1 = centerPt; focus2 = centerPt; sumOfDistances = 2 * a; } 
                    else if (a > b) { const cSquared = a * a - b * b; if (cSquared < 0 || isNaN(cSquared)) { currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped ellipse '${elId}': Focus calculation error (a>b). a=${a}, b=${b}.`; break; } const c = Math.sqrt(cSquared); focus1 = board.create('point', [() => centerPt.X() - c, () => centerPt.Y()], { ...focusPointAttributes, id: elId + '_f1' }); focus2 = board.create('point', [() => centerPt.X() + c, () => centerPt.Y()], { ...focusPointAttributes, id: elId + '_f2' }); sumOfDistances = 2 * a; } 
                    else { const cSquared = b * b - a * a; if (cSquared < 0 || isNaN(cSquared)) { currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped ellipse '${elId}': Focus calculation error (b>a). a=${a}, b=${b}.`; break; } const c = Math.sqrt(cSquared); focus1 = board.create('point', [() => centerPt.X(), () => centerPt.Y() - c], { ...focusPointAttributes, id: elId + '_f1' }); focus2 = board.create('point', [() => centerPt.X(), () => centerPt.Y() + c], { ...focusPointAttributes, id: elId + '_f2' }); sumOfDistances = 2 * b; }
                    if (focus1 && focus2 && !isNaN(sumOfDistances) && isFinite(sumOfDistances)) jsxElement = board.create('ellipse', [focus1, focus2, sumOfDistances], commonAttrs);
                    else currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped ellipse '${elId}': Invalid foci or sumOfDistances (sum=${sumOfDistances}).`;
                    break;
                  }
                  case 'text': {
                    if (pass !== 'others') return undefined; 
                    const textDef = elDef as TextDef;
                    let parsedCoords: [number, number] | null = null;
                    if (Array.isArray(textDef.coords) && textDef.coords.length === 2) {
                        let x_val_text = textDef.coords[0];
                        let y_val_text = textDef.coords[1];
                        if (typeof x_val_text === 'string') x_val_text = parseFloat(x_val_text as string);
                        if (typeof y_val_text === 'string') y_val_text = parseFloat(y_val_text as string);

                        if (typeof x_val_text === 'number' && !isNaN(x_val_text) && typeof y_val_text === 'number' && !isNaN(y_val_text)) {
                           parsedCoords = [x_val_text, y_val_text];
                        }
                    }
                    if (!parsedCoords) { currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped text '${elId}': Invalid/non-numeric coordinates (${JSON.stringify(textDef.coords)}).`; } 
                    else if (!textDef.text || typeof textDef.text !== 'string') { currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Skipped text '${elId}': Missing or invalid text content.`; } 
                    else {
                      const textAttributes: any = { ...commonAttrs, fontSize: textDef.fontSize || 12, anchorX: textDef.anchorX || 'left', anchorY: textDef.anchorY || 'middle', useMathJax: textDef.useMathJax ?? false };
                      delete textAttributes.fillColor; delete textAttributes.fillOpacity; delete textAttributes.strokeWidth; delete textAttributes.label;
                      jsxElement = board.create('text', [parsedCoords[0], parsedCoords[1], textDef.text], textAttributes);
                    }
                    break;
                  }
                  case 'sector':
                    console.warn(`[DiagramDisplay] Encountered unsupported 'sector' type for element '${elId}'. It will be skipped. AI should use 'arc' with fill properties.`);
                    currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Unsupported element type 'sector' for '${elId}'. Skipped.`;
                    break;
                  default:
                    if (pass === 'others') { 
                        console.warn("[DiagramDisplay] Unknown geometric element type:", (elDef as any).type, "for element ID:", elId);
                        currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Unknown geometric element type: ${(elDef as any).type}`;
                    }
                }
            } catch (e: any) {
                 console.error(`[DiagramDisplay] Error creating JSXGraph element ${elId} of type ${elDef.type}:`, e);
                 currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Error rendering ${elDef.type} '${elId}': ${e.message}`;
            }
            return jsxElement;
        };
        
        data.geometricElements.forEach((elDef) => {
            if (elDef.type === 'point') {
                const jsxElement = createGeometricElement(elDef, 'points');
                if (jsxElement) {
                    allRenderedJsxElements.push(jsxElement);
                    if (elDef.id) {
                        if (createdElements[elDef.id]) {
                            console.warn(`[DiagramDisplay] Duplicate point ID found: '${elDef.id}'. Overwriting the previous element.`);
                            currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Warning: Duplicate ID '${elDef.id}' detected.`;
                        }
                        createdElements[elDef.id] = jsxElement;
                    }
                }
            }
        });

        data.geometricElements.forEach((elDef) => {
            if (elDef.type !== 'point') {
                const jsxElement = createGeometricElement(elDef, 'others');
                if (jsxElement) {
                    allRenderedJsxElements.push(jsxElement);
                     if (elDef.id) {
                        if (createdElements[elDef.id]) { 
                            console.warn(`[DiagramDisplay] Duplicate element ID (non-point) found: '${elDef.id}'. Overwriting.`);
                             currentJsxError = (currentJsxError ? currentJsxError + "\n" : "") + `Warning: Duplicate ID '${elDef.id}' for non-point element.`;
                        }
                        createdElements[elDef.id] = jsxElement;
                    }
                }
            }
        });
        
        if (currentJsxError) {
            setJsxError(currentJsxError); 
            console.error("[DiagramDisplay] JSXGraph Rendering Issues Log:\n", currentJsxError); 
        }

        if (allRenderedJsxElements.length > 0) {
          board.zoomElements(allRenderedJsxElements); 
        }

        board.unsuspendUpdate(); 
        if (jsxGraphBoardRef.current) { 
             setIsBoardReady(true); 
        }

      } catch (e: any) {
        console.error("[DiagramDisplay] JSXGraph library general error:", e);
        setJsxError(`JSXGraph setup error: ${e.message || 'Failed to initialize or render geometry.'}`);
        setIsBoardReady(false);
      }
    } else {
        setIsBoardReady(false); 
    }

    return () => {
      if (jsxGraphBoardRef.current) {
        try {
            if (typeof JXG !== 'undefined' && JXG.JSXGraph) {
                 JXG.JSXGraph.freeBoard(jsxGraphBoardRef.current);
            }
        } catch (e) {
            console.error("[DiagramDisplay] Error freeing board in useEffect cleanup:", e);
        }
        jsxGraphBoardRef.current = null;
      }
      setIsBoardReady(false); 
    };
  }, [data.representationType, data.geometricElements, data.viewBox, jsxGraphContainerId]); 
  
  const getTitleForRepresentation = (type: RepresentationType) => {
    switch(type) {
      case 'svg': return "Generated Conceptual Diagram";
      case 'geometry': return "Generated Geometric Diagram / Graph";
      case 'text_only': return "Textual Representation"; 
      default: return "Generated Representation";
    }
  };

  const processSvgStringForDownload = (svgString: string, board: JXG.Board, targetWidth: number = 800): {processedString: string, width: number, height: number} => {
    try {
        if (!svgString || svgString.trim() === "" || !svgString.includes("<svg")) {
            console.error("Input SVG string is empty or invalid for processing.");
            throw new Error("Input SVG string is empty or invalid for download processing.");
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, "image/svg+xml");
        const svgNode = doc.documentElement;

        if (svgNode.nodeName.toLowerCase() !== 'svg' || doc.getElementsByTagName("parsererror").length > 0) {
            console.error("Parsed SVG string is not a valid SVG document for download processing.", svgString);
            throw new Error("Invalid SVG content after parsing for download.");
        }

        svgNode.querySelectorAll('defs filter').forEach(filter => filter.remove());
        svgNode.querySelectorAll('[clip-path]').forEach(el => el.removeAttribute('clip-path'));


        let finalViewBoxStr: string;
        let finalAspectRatio: number;
        const defaultVBoxWidth = 600;
        const defaultVBoxHeight = 450;

        const boardCanvasWidth = board.canvasWidth;
        const boardCanvasHeight = board.canvasHeight;

        if (boardCanvasWidth > 0 && boardCanvasHeight > 0) {
            finalViewBoxStr = `0 0 ${boardCanvasWidth} ${boardCanvasHeight}`;
            finalAspectRatio = boardCanvasWidth / boardCanvasHeight;
        } else {
            const boardBox = board.getBoundingBox(); 
            const bbWidth = boardBox[2] - boardBox[0];
            const bbHeight = boardBox[1] - boardBox[3];
            if (isFinite(bbWidth) && isFinite(bbHeight) && bbWidth > 1e-6 && bbHeight > 1e-6) {
                finalViewBoxStr = `${boardBox[0]} ${boardBox[3]} ${bbWidth} ${bbHeight}`; 
                finalAspectRatio = bbWidth / bbHeight;
                console.warn("[SVG Process] Using board.getBoundingBox() for viewBox as fallback because canvas dimensions were invalid:", finalViewBoxStr);
            } else {
                finalViewBoxStr = `0 0 ${defaultVBoxWidth} ${defaultVBoxHeight}`;
                finalAspectRatio = defaultVBoxWidth / defaultVBoxHeight;
                console.error("[SVG Process] Critical: Could not determine valid viewBox from canvas or getBoundingBox. Using default:", finalViewBoxStr);
            }
        }

        const displayWidth = targetWidth;
        const displayHeight = Math.round(displayWidth / (finalAspectRatio || (defaultVBoxWidth / defaultVBoxHeight)));

        svgNode.setAttribute('width', displayWidth.toString() + 'px');
        svgNode.setAttribute('height', displayHeight.toString() + 'px');
        svgNode.setAttribute('viewBox', finalViewBoxStr);
        
        if (!svgNode.hasAttribute('preserveAspectRatio')) {
            svgNode.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }
        if (!svgNode.hasAttribute('xmlns')) {
            svgNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
        if (!svgNode.hasAttribute('xmlns:xlink')) {
            svgNode.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        }

        const serializer = new XMLSerializer();
        let finalSvgString = serializer.serializeToString(svgNode);
        
        if (!finalSvgString.startsWith('<?xml')) {
            finalSvgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + finalSvgString;
        }
        return {processedString: finalSvgString, width: displayWidth, height: displayHeight};

    } catch (e) {
        console.error("[DiagramDisplay SVG Process] Error processing SVG string for download:", e, "Original SVG:", svgString);
        if (svgString && svgString.includes("<svg")) {
           const errorComment = `<!-- SVG Processing Error: ${(e instanceof Error ? e.message : String(e))} -->\n`;
            return {processedString: errorComment + svgString, width: targetWidth, height: Math.round(targetWidth * 0.75)}; // Fallback dimensions
        }
        throw new Error(`SVG processing failed critically: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDownloadPNG = async () => {
    if (!jsxGraphBoardRef.current || !isBoardReady) {
      setJsxError("PNG Download Error: Board not available or ready.");
      return;
    }
    if (data.representationType !== 'geometry' || !data.geometricElements || data.geometricElements.length === 0) {
      setJsxError("PNG Download Error: No geometric data to download.");
      return;
    }
    
    const board = jsxGraphBoardRef.current;
    if (!board.renderer || (board.renderer as any).type !== 'svg') {
        setJsxError("PNG Download Error: Board renderer is not set to SVG.");
        return;
    }

    setJsxError(null); 
    let rawSvgString: string | undefined;
    let exportMethodUsed = "";

    try {
        const container = document.getElementById(jsxGraphContainerId);
        if (container && container.clientWidth > 0 && container.clientHeight > 0) {
            board.resizeContainer(container.clientWidth, container.clientHeight, false, true);
            board.fullUpdate();
        } else {
             console.warn("[DiagramDisplay Download PNG] Board container has no dimensions. SVG export for PNG might be incorrect.");
        }
        
        await new Promise(resolve => setTimeout(resolve, 150));

        if (!(board.canvasWidth > 0 && board.canvasHeight > 0)) {
            console.warn(`[DiagramDisplay Download PNG] Board canvas dimensions are invalid (W:${board.canvasWidth}, H:${board.canvasHeight}) even after resize attempt. PNG viewBox might be incorrect.`);
        }

        if (board.renderer && typeof (board.renderer as any).dumpToSVG === 'function') {
            rawSvgString = (board.renderer as any).dumpToSVG();
            exportMethodUsed = "board.renderer.dumpToSVG()";
        }
        if ((!rawSvgString || !rawSvgString.includes('<svg')) && typeof (board as any).toSVG === 'function') {
            rawSvgString = (board as any).toSVG();
            exportMethodUsed = "board.toSVG()";
        }
        if (!rawSvgString || !rawSvgString.includes('<svg') && container) {
            const svgElement = container?.querySelector('svg');
            if (svgElement) {
                rawSvgString = new XMLSerializer().serializeToString(svgElement);
                exportMethodUsed = "DOM XMLSerializer";
            }
        }
        
        if (!rawSvgString || !rawSvgString.includes('<svg')) {
            throw new Error(`Failed to obtain valid SVG string using methods: ${exportMethodUsed || 'all attempted methods'}. Content was empty or invalid.`);
        }
        
        const { processedString: processedSvgString, width: svgEffectiveWidth, height: svgEffectiveHeight } = processSvgStringForDownload(rawSvgString, board, 800); // Target 800px width for SVG intermediary

        const img = new Image();
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = (errEvt) => {
                console.error("Error loading SVG into Image for PNG conversion:", errEvt);
                let specificError = "Unknown error";
                if (typeof errEvt === 'string') specificError = errEvt;
                else if (errEvt instanceof Event && errEvt.target) {
                   // Cannot get more specific error from generic Event for img.onerror
                   specificError = "SVG data malformed or security issue.";
                }
                reject(new Error(`Failed to load SVG data into an image for PNG conversion. ${specificError}`));
            };
            img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(processedSvgString)}`;
        });

        const canvas = document.createElement('canvas');
        canvas.width = svgEffectiveWidth; 
        canvas.height = svgEffectiveHeight; 
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not get 2D context from canvas for PNG conversion.");
        }

        // Optional: Fill background if SVG is transparent and white BG is desired for PNG
        // ctx.fillStyle = 'white';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${(data.diagramTitle || 'diagram').replace(/[^a-z0-9_.-]/gi, '_')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (error) {
        console.error("[DiagramDisplay Download PNG] Error during PNG download:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        setJsxError(`PNG Download Failed: ${message} (Method for SVG source: ${exportMethodUsed || 'N/A'})`);
    }
  };


  return (
    <div className="p-6 bg-white shadow-xl rounded-lg border border-slate-200 space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <div>
          <h2 className="text-2xl font-semibold text-primary-600 mb-1 flex items-center space-x-2">
            {ShapesIcon && React.createElement(ShapesIcon)}
            <span>{data.diagramTitle || getTitleForRepresentation(data.representationType)}</span>
          </h2>
          <p className="text-xs text-slate-500 mb-3">For question: "{originalQuestion}"</p>
        </div>
        {data.representationType === 'geometry' && data.geometricElements && data.geometricElements.length > 0 && isBoardReady && (
            <button
                onClick={handleDownloadPNG} // Changed from handleDownloadSVG
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-400 transition-colors flex items-center space-x-1.5"
                title="Download Diagram as PNG"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                    <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>
                <span>Download PNG</span>
            </button>
        )}
      </div>


      {data.errorParsing ? (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-md">
          <p className="text-yellow-700 font-medium mb-2">Could not parse structured data from AI.</p>
          <p className="text-yellow-600 text-sm">Displaying raw AI response or error message:</p>
          <pre className="mt-2 text-xs text-slate-600 bg-slate-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">
            {data.description || "No textual description provided by AI for this error."}
          </pre>
        </div>
      ) : (
        <>
          {data.representationType === 'svg' && (
            <div className="border border-slate-200 rounded-md p-4 bg-slate-50 overflow-hidden">
              {data.elements && data.elements.length > 0 ? (
                <svg 
                  viewBox={data.viewBox || defaultViewBoxSVG} 
                  className="w-full h-auto max-h-[500px]"
                  preserveAspectRatio="xMidYMid meet"
                  aria-labelledby="diagramTitleSVG"
                  role="img"
                >
                  {data.diagramTitle && <title id="diagramTitleSVG">{data.diagramTitle}</title>}
                  {data.elements.map(renderElementSVG)}
                </svg>
              ) : (
                 <p className="text-slate-500 text-center py-8">No visual SVG elements were provided.</p>
              )}
            </div>
          )}

          {data.representationType === 'geometry' && (
             <div className="border border-slate-200 rounded-md p-1 bg-white flex flex-col justify-center items-center min-h-[300px] md:min-h-[400px]">
              {jsxError && (
                <div className="w-full p-3 mb-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-xs whitespace-pre-wrap overflow-auto max-h-40">
                  <p className="font-semibold mb-1">Diagram rendering/export issues:</p>
                  {jsxError}
                </div>
              )}
              {data.geometricElements && data.geometricElements.length > 0 ? (
                <div id={jsxGraphContainerId} className="jxgbox w-full h-[300px] md:h-[400px] text-slate-700" style={{minHeight: '300px'}}></div>
              ) : (
                !jsxError && <p className="text-slate-500 text-center py-8">No geometric elements provided or rendered.</p>
              )}
            </div>
          )}
          
          {data.representationType === 'text_only' && 
            (!data.elements || data.elements.length === 0) && 
            (!data.geometricElements || data.geometricElements.length === 0) && (
             <div className="p-4 bg-slate-100 border border-slate-200 rounded-md min-h-[100px]">
                {data.description && data.description.trim() !== "" ? (
                    <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{data.description}</p>
                ) : (
                    <p className="text-slate-500 text-center py-8">
                        The AI provided a text-based representation, but no content was available.
                    </p>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
