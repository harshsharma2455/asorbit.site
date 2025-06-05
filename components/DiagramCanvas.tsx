import React from 'react';
import { ShapeInstruction, ShapeType, PointInstruction, SegmentInstruction, CircleInstruction, ArcInstruction, PolygonInstruction, BoxInstruction, TextInstruction } from '../types';
import { Point, Segment, Circle, Arc, Polygon } from '@flatten-js/core';

interface DiagramCanvasProps {
  shapes: ShapeInstruction[];
  width: number;
  height: number;
}

const escapeXml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') {
    return '';
  }
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

const isValidPointData = (p: any): boolean => p && typeof p.x === 'number' && typeof p.y === 'number';

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ shapes, width, height }) => {
  const svgElements: string[] = [];

  shapes.forEach((instruction, index) => {
    // console.log(`Processing instruction at index ${index}:`, JSON.stringify(instruction)); // Verbose logging

    const commonAttributes = {
      stroke: instruction.stroke || 'currentColor',
      'stroke-width': instruction.strokeWidth || 1,
      fill: instruction.fill || 'none',
    };
    
    const textFill = (instruction as TextInstruction).fill || instruction.stroke || 'currentColor';


    try {
      switch (instruction.type) {
        case ShapeType.Point: {
          const instr = instruction as PointInstruction;
          if (typeof instr.x !== 'number' || typeof instr.y !== 'number') {
            console.error(`Invalid PointInstruction at index ${index}: Missing or non-numeric coordinates.`, instr);
            return; 
          }
          const center = new Point(instr.x, instr.y);
          const radius = typeof instr.radius === 'number' && instr.radius > 0 ? instr.radius : 2;
          const pointCircle = new Circle(center, radius);
          svgElements.push(pointCircle.svg({ ...commonAttributes, fill: instr.fill || instr.stroke || 'currentColor' }));
          break;
        }
        case ShapeType.Segment: {
          const instr = instruction as SegmentInstruction;
          if (!isValidPointData(instr.ps) || !isValidPointData(instr.pe)) {
            console.error(`Invalid SegmentInstruction at index ${index}: Malformed points.`, instr);
            return;
          }
          const ps = new Point(instr.ps.x, instr.ps.y);
          const pe = new Point(instr.pe.x, instr.pe.y);
          const segment = new Segment(ps, pe);
          svgElements.push(segment.svg(commonAttributes));
          break;
        }
        case ShapeType.Circle: {
          const instr = instruction as CircleInstruction;
          if (!isValidPointData(instr.pc) || typeof instr.r !== 'number' || instr.r <= 0) {
            console.error(`Invalid CircleInstruction at index ${index}: Malformed center point or invalid radius. Radius must be > 0.`, instr);
            return;
          }
          const pc = new Point(instr.pc.x, instr.pc.y);
          const circle = new Circle(pc, instr.r);
          svgElements.push(circle.svg(commonAttributes));
          break;
        }
        case ShapeType.Arc: {
          const instr = instruction as ArcInstruction;
          if (!isValidPointData(instr.pc) || 
              typeof instr.r !== 'number' || instr.r <= 0 ||
              typeof instr.startAngle !== 'number' || typeof instr.endAngle !== 'number') {
            console.error(`Invalid ArcInstruction at index ${index}: Malformed center, invalid radius (must be > 0), or non-numeric angles.`, instr);
            return;
          }
          const pc = new Point(instr.pc.x, instr.pc.y);
          const arc = new Arc(pc, instr.r, instr.startAngle, instr.endAngle, instr.counterClockwise || false);
          svgElements.push(arc.svg(commonAttributes));
          break;
        }
        case ShapeType.Polygon: {
          const instr = instruction as PolygonInstruction;
          if (!Array.isArray(instr.points) || instr.points.length < 2) { // flatten-js polygon needs at least 2 points for a degenerate one, 3 for a visible area
            console.error(`Invalid PolygonInstruction at index ${index}: 'points' array is missing, empty, or has too few points.`, instr);
            return;
          }
          const points = instr.points.map(p => {
            if (!isValidPointData(p)) {
              console.error(`Invalid point data within PolygonInstruction at index ${index}:`, p, instr);
              throw new Error("Invalid point in polygon"); // throw to be caught by outer try-catch for this instruction
            }
            return new Point(p.x, p.y);
          });
          if (points.length > 0) { // Redundant check if map didn't throw, but safe
             const polygon = new Polygon();
             polygon.addFace(points);
             svgElements.push(polygon.svg({ ...commonAttributes, fill: instr.fill || 'rgba(128, 128, 128, 0.3)' }));
          }
          break;
        }
        case ShapeType.Box: { // Box is internally a polygon, similar checks apply.
          const instr = instruction as BoxInstruction;
           if (typeof instr.xmin !== 'number' || typeof instr.ymin !== 'number' ||
               typeof instr.xmax !== 'number' || typeof instr.ymax !== 'number' ||
               instr.xmin >= instr.xmax || instr.ymin >= instr.ymax) {
            console.error(`Invalid BoxInstruction at index ${index}: Non-numeric or invalid min/max coordinates.`, instr);
            return;
           }
          const boxPolygon = new Polygon([
            new Point(instr.xmin, instr.ymin),
            new Point(instr.xmax, instr.ymin),
            new Point(instr.xmax, instr.ymax),
            new Point(instr.xmin, instr.ymax)
          ]);
          svgElements.push(boxPolygon.svg({ ...commonAttributes, fill: instr.fill || 'rgba(128, 128, 128, 0.1)' }));
          break;
        }
        case ShapeType.Text: {
          const instr = instruction as TextInstruction;
           if (typeof instr.x !== 'number' || typeof instr.y !== 'number' || typeof instr.content !== 'string') {
             console.error(`Invalid TextInstruction at index ${index}: Missing or invalid x, y, or content.`, instr);
             return;
           }
          const x = instr.x + (instr.offset?.x || 0);
          const y = instr.y + (instr.offset?.y || 0);
          svgElements.push(
            `<text x="${x}" y="${y}" font-family="${instr.fontFamily || 'sans-serif'}" font-size="${instr.fontSize || 12}" fill="${textFill}" text-anchor="${instr.textAnchor || 'start'}" dominant-baseline="middle">${escapeXml(instr.content)}</text>`
          );
          break;
        }
        default:
          console.warn(`Unsupported shape type at index ${index}: ${(instruction as any).type}`, instruction);
      }
    } catch (e) {
        // This catch is for errors during flatten-js object creation or .svg() calls IF pre-checks passed.
        console.error(`Error processing shape instruction of type ${(instruction as any).type} at index ${index}:`, instruction, e);
    }
  });

  return (
    <div className="flex justify-center items-center bg-slate-800 p-4 rounded-md shadow-inner" aria-label="Generated diagram canvas">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        className="border border-slate-600 bg-white rounded shadow"
        aria-labelledby="generated-diagram-heading"
        role="img"
      >
        <title id="diagram-title">Generated Mathematical Diagram</title>
        <desc id="diagram-desc">A diagram generated from the math question and its description, rendered using SVG.</desc>
        <g dangerouslySetInnerHTML={{ __html: svgElements.join('') }} />
      </svg>
    </div>
  );
};

export default DiagramCanvas;