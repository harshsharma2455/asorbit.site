
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ShapeInstruction } from './types';
import DiagramCanvas from './components/DiagramCanvas';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

// Ensure API_KEY is available via process.env
const API_KEY = process.env.API_KEY;

const App: React.FC = () => {
  const [mathQuestion, setMathQuestion] = useState<string>('');
  const [diagramDescription, setDiagramDescription] = useState<string>('');
  const [diagramShapes, setDiagramShapes] = useState<ShapeInstruction[]>([]);
  
  const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false);
  const [isLoadingDiagram, setIsLoadingDiagram] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

  const handleGenerateDescription = useCallback(async () => {
    if (!genAI) {
      setError("API Key not configured. Please set process.env.API_KEY.");
      return;
    }
    if (!mathQuestion.trim()) {
      setError("Please enter a math question.");
      return;
    }

    setIsLoadingDescription(true);
    setError(null);
    setDiagramDescription('');
    setDiagramShapes([]);

    const prompt = `You are an expert mathematics visualizer. Given the following math problem, provide a detailed textual description of a 2D diagram that would help solve or understand it.
The description should be clear and unambiguous, suitable for a programmer to translate into drawing commands.
Focus on geometric shapes (points, lines, circles, polygons, angles), their properties (coordinates, lengths, radii, colors), and their relationships.
Provide specific coordinates or relative positions where appropriate. Assume a canvas of roughly 500 (width) x 300 (height) pixels.
Important: Identify key points in the diagram and label them with capital letters (e.g., Point A, Point B, Vertex C). Describe these labels and suggest where they should be placed for clarity.
Describe labels for sides and angles as well.

Specific instructions for tangents:
- If the problem involves a line tangent to a curve (e.g., a circle or arc), clearly describe the point of tangency. Label this point (e.g., "Point T").
- State that the tangent line must touch the curve at exactly one point in the local vicinity of the point of tangency.
- For a line tangent to a circle, explicitly state that the radius drawn from the center of the circle to the point of tangency is perpendicular (forms a 90-degree angle) to the tangent line.

Math problem: "${mathQuestion}"

Diagram Description:`;

    try {
      const response: GenerateContentResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
      });
      setDiagramDescription(response.text);
    } catch (e) {
      console.error(e);
      setError(`Failed to generate diagram description: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoadingDescription(false);
    }
  }, [genAI, mathQuestion]);

  const handleGenerateDiagram = useCallback(async () => {
    if (!genAI) {
      setError("API Key not configured. Please set process.env.API_KEY.");
      return;
    }
    if (!diagramDescription.trim()) {
      setError("Please generate a diagram description first.");
      return;
    }

    setIsLoadingDiagram(true);
    setError(null);
    setDiagramShapes([]);

    const prompt = `You are an expert in programmatic 2D graphics and the 'flatten-js' library.
Given the following textual description of a diagram, convert it into a JSON array of 'ShapeInstruction' objects.
The JSON output must conform to the TypeScript type 'ShapeInstruction[]' defined below.
Ensure all coordinates are within a 500 (width) x 300 (height) canvas.
Use reasonable default stroke/fill colors if not specified (e.g., stroke: 'black', fill: 'none' or a light color for shapes).

CRITICAL: Ensure all numerical values for coordinates (x, y), radii (r), lengths, and angles (startAngle, endAngle) are valid numbers.
Radii for Circles and Arcs MUST be positive numbers (r > 0).
Points used in Segments and Polygons must have valid numeric x and y coordinates.
Missing or invalid numerical parameters (e.g., non-numeric strings, null, radius <= 0) will cause rendering errors.

Key considerations for text labels and clarity:
1.  If the description mentions points labeled with letters (e.g., "Point A", "Vertex B", "Point of tangency T"), create a 'TextInstruction' for each letter label (e.g., content: "A", content: "T"). Place this label near the corresponding point.
2.  Assign an 'id' to important shapes (like points, including points of tangency) if they are referenced by text labels via 'targetId'.
3.  Place text labels strategically to maximize readability and avoid overlapping other diagram elements.
4.  Use the 'textAnchor' property ('start', 'middle', 'end') appropriately. For example, if labeling a point P at (x,y), a label "P" might be placed at (x+5, y) with textAnchor: 'start'.
5.  Use the 'offset': { 'x': number, 'y': number } property within 'TextInstruction' for fine-tuned placement adjustments if needed.
6.  If a text label needs to be significantly offset from its target element for clarity, ALSO include a thin 'SegmentInstruction' to act as a "leader line" connecting a point near the text label to the target element. Use a subtle stroke color like 'gray' and a thin strokeWidth (e.g., 0.5 or 1).

Specific instructions for Tangents:
- When generating instructions for a line tangent to a curve (especially a circle or arc), ensure the line (SegmentInstruction) visually touches the curve at a single, precise point of tangency.
- Create an explicit PointInstruction for the point of tangency itself. This point should lie exactly on the curve.
- For a line tangent to a circle, the tangent line segment must be visually perpendicular to the radius connecting the circle's center to the point of tangency. Ensure the coordinates reflect this.

TypeScript definitions:
enum ShapeType { Point = 'Point', Segment = 'Segment', Circle = 'Circle', Arc = 'Arc', Polygon = 'Polygon', Box = 'Box', Text = 'Text' }
interface FlattenPoint { x: number; y: number; }
interface BaseShapeInstruction { id?: string; type: ShapeType; stroke?: string; fill?: string; strokeWidth?: number; }
interface PointInstruction extends BaseShapeInstruction { type: ShapeType.Point; x: number; y: number; radius?: number; }
interface SegmentInstruction extends BaseShapeInstruction { type: ShapeType.Segment; ps: FlattenPoint; pe: FlattenPoint; }
interface CircleInstruction extends BaseShapeInstruction { type: ShapeType.Circle; pc: FlattenPoint; r: number; }
interface ArcInstruction extends BaseShapeInstruction { type: ShapeType.Arc; pc: FlattenPoint; r: number; startAngle: number; endAngle: number; counterClockwise?: boolean; }
interface PolygonInstruction extends BaseShapeInstruction { type: ShapeType.Polygon; points: FlattenPoint[]; }
interface BoxInstruction extends BaseShapeInstruction { type: ShapeType.Box; xmin: number; ymin: number; xmax: number; ymax: number; }
interface TextInstruction extends BaseShapeInstruction { type: ShapeType.Text; x: number; y: number; content: string; fontSize?: number; fontFamily?: string; fill?: string; textAnchor?: 'start' | 'middle' | 'end'; targetId?: string; offset?: FlattenPoint; }
type ShapeInstruction = PointInstruction | SegmentInstruction | CircleInstruction | ArcInstruction | PolygonInstruction | BoxInstruction | TextInstruction;

Diagram Description:
"${diagramDescription}"

Return ONLY the JSON array. Do not include any other text or explanation. Ensure the JSON is valid.
Example of a Point A at (50,50) with its label:
[
  { "type": "Point", "id": "ptA", "x": 50, "y": 50, "radius": 3, "fill": "blue" },
  { "type": "Text", "x": 55, "y": 45, "content": "A", "targetId": "ptA", "fill": "black", "textAnchor": "start" }
]

Example of a line tangent to a circle:
Assume: Circle center (cx, cy) = (100, 150), radius r = 50. Point of tangency T is at (100, 100) (top of the circle).
[
  { "type": "Circle", "id": "circle1", "pc": { "x": 100, "y": 150 }, "r": 50, "stroke": "blue", "strokeWidth": 1.5 },
  { "type": "Point", "id": "tangencyPointT", "x": 100, "y": 100, "radius": 2.5, "fill": "red", "stroke": "black" },
  { "type": "Text", "x": 105, "y": 95, "content": "T", "targetId": "tangencyPointT", "fill": "black", "textAnchor": "start" },
  { "type": "Segment", "ps": { "x": 50, "y": 100 }, "pe": { "x": 150, "y": 100 }, "stroke": "green", "strokeWidth": 1.5 },
  // Optional: Radius to show perpendicularity
  // { "type": "Segment", "ps": { "x": 100, "y": 150 }, "pe": { "x": 100, "y": 100 }, "stroke": "lightgray", "strokeWidth": 1, "strokeDasharray": "2,2" }
]


JSON Output:`;

    try {
      const response: GenerateContentResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      let jsonStr = response.text.trim();
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }

      const parsedShapes = JSON.parse(jsonStr) as ShapeInstruction[];
      setDiagramShapes(parsedShapes);
    } catch (e) {
      console.error(e);
      setError(`Failed to generate diagram data or parse JSON: ${e instanceof Error ? e.message : String(e)}`);
      setDiagramShapes([]); // Clear shapes on error
    } finally {
      setIsLoadingDiagram(false);
    }
  }, [genAI, diagramDescription]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Math Diagram Generator
          </h1>
          <p className="mt-2 text-slate-400">Visualize complex math problems with AI-generated diagrams.</p>
        </header>

        {!API_KEY && (
          <ErrorDisplay message="CRITICAL: API_KEY environment variable is not set. The application cannot function." />
        )}
        
        <ErrorDisplay message={error} />

        {/* Step 1: Input Math Question */}
        <section className="space-y-4 p-6 bg-slate-700/50 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-sky-400">1. Enter Your Math Question</h2>
          <textarea
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-200 placeholder-slate-500 transition duration-150 ease-in-out"
            rows={4}
            placeholder="e.g., A ladder 5m long leans against a vertical wall. The foot of the ladder is 3m from the wall. How high up the wall does the ladder reach?"
            value={mathQuestion}
            onChange={(e) => setMathQuestion(e.target.value)}
            disabled={isLoadingDescription || isLoadingDiagram || !API_KEY}
            aria-label="Math question input"
          />
          <button
            onClick={handleGenerateDescription}
            disabled={isLoadingDescription || !mathQuestion.trim() || !API_KEY}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-live="polite"
          >
            {isLoadingDescription ? <LoadingSpinner /> : 'Generate Diagram Description'}
          </button>
        </section>

        {/* Step 2: Diagram Description */}
        {(diagramDescription || isLoadingDescription) && (
          <section className="space-y-4 p-6 bg-slate-700/50 rounded-lg shadow" aria-labelledby="diagram-desc-heading">
            <h2 id="diagram-desc-heading" className="text-2xl font-semibold text-teal-400">2. Diagram Description</h2>
            {isLoadingDescription ? (
              <div className="flex justify-center p-4" role="status" aria-label="Loading diagram description"><LoadingSpinner /></div>
            ) : diagramDescription ? (
              <>
                <pre className="w-full p-3 bg-slate-800 border border-slate-600 rounded-md text-sm text-gray-300 whitespace-pre-wrap h-48 overflow-y-auto" tabIndex={0}>
                  {diagramDescription}
                </pre>
                <button
                  onClick={handleGenerateDiagram}
                  disabled={isLoadingDiagram || !diagramDescription.trim() || !API_KEY}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-live="polite"
                >
                  {isLoadingDiagram ? <LoadingSpinner /> : 'Generate Diagram from Description'}
                </button>
              </>
            ) : null}
          </section>
        )}
        
        {/* Step 3: Generated Diagram */}
        {(diagramShapes.length > 0 || isLoadingDiagram) && (
           <section className="space-y-4 p-6 bg-slate-700/50 rounded-lg shadow" aria-labelledby="generated-diagram-heading">
            <h2 id="generated-diagram-heading" className="text-2xl font-semibold text-purple-400">3. Generated Diagram</h2>
            {isLoadingDiagram ? (
              <div className="flex justify-center p-4" role="status" aria-label="Loading diagram"><LoadingSpinner /></div>
            ) : diagramShapes.length > 0 ? (
              <DiagramCanvas shapes={diagramShapes} width={500} height={300} />
            ) : !isLoadingDiagram && diagramDescription && ( // Show if tried to generate but got no shapes
              <p className="text-slate-400 text-center py-4">Could not generate diagram elements. Check the description or try again.</p>
            )}
          </section>
        )}
      </div>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>Powered by Gemini API and flatten-js.</p>
      </footer>
    </div>
  );
};

export default App;