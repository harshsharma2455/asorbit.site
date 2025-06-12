import JXG from 'jsxgraph'; // Added import

// Allow JSXGraph to be used from window if not using direct imports with types
declare global {
  interface Window {
    JXG?: any; // JSXGraph global object
  }
}

export interface AppError {
  message: string;
  details?: string;
}

// Notification function type
export type NotificationFunction = (notification: {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}) => void;

// Doubt solving types
export interface DoubtQuery {
  id: string;
  question: string;
  subject: string;
  timestamp: Date;
  status: 'pending' | 'resolved' | 'failed';
  attachedImage?: string; // base64 image data
  solution?: DoubtSolution;
}

export interface DoubtSolution {
  explanation: string;
  steps?: string[];
  relatedConcepts?: string[];
  diagramData?: DiagramData;
  confidence?: number; // 0-1 confidence score
  additionalResources?: {
    title: string;
    url: string;
    type: 'video' | 'article' | 'practice';
  }[];
}

// User and subscription types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'premium' | 'pro';
  subscriptionExpiry?: Date;
  usageStats: {
    questionsGenerated: number;
    diagramsCreated: number;
    doubtsResolved: number;
    papersCreated: number;
    lastReset: Date;
  };
  preferences: {
    defaultSubject?: string;
    defaultGrade?: string;
    notificationsEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface SubscriptionPlan {
  id: 'free' | 'premium' | 'pro';
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    questionsPerDay: number;
    diagramsPerDay: number;
    doubtsPerDay: number;
    papersPerDay: number;
  };
}

// SVG Elements (can be kept for potential non-geometric conceptual diagrams or fallback)
export interface DiagramElementBase {
  id: string;
  label?: string;
  color?: string;
}

export interface CircleElement extends DiagramElementBase {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
}

export interface RectangleElement extends DiagramElementBase {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LineElement extends DiagramElementBase {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth?: number;
  labelX?: number;
  labelY?: number;
}

export interface TextElement extends DiagramElementBase {
  type: 'text';
  x: number;
  y: number;
  text: string;
  fontSize?: number;
  anchor?: 'start' | 'middle' | 'end';
}

export type DiagramElement = CircleElement | RectangleElement | LineElement | TextElement;

// Geometric Elements for JSXGraph

export interface JXGArrowOptions {
  type?: number;          // e.g., 1 (filled triangle), 2 (line), 7 (classic arrow)
  size?: number;          // size of the arrowhead in px
  highlightSize?: number;
  strokeColor?: string;
  fillColor?: string;
  // JSXGraph also supports more complex objects here, but this covers common cases
}

export interface JXGCommonAttributes {
  id?: string;
  name?: string; // For labels in JSXGraph
  visible?: boolean;
  fixed?: boolean;
  color?: string; // Often used as strokeColor or general color by AI
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number; 
  fillOpacity?: number;   
  highlightStrokeColor?: string; 
  highlightFillColor?: string;   
  highlightStrokeOpacity?: number; 
  highlightFillOpacity?: number;   
  dash?: number; // Added for dashed lines (e.g., 0 for solid, 1 for dotted, 2 for dashed)
  label?: { // For text labels associated with elements
    offset?: [number, number];
    fontSize?: number;
    color?: string;
    useMathJax?: boolean;
  };
  firstArrow?: boolean | JXGArrowOptions; // For segments/lines
  lastArrow?: boolean | JXGArrowOptions;  // For segments/lines
}

// Helper type for references that can be an ID string or a direct JSXGraph element object
type JXGPointRef = string | JXG.Point; // Point ID or JSXGraph Point object
type JXGElementRef = string | JXG.GeometryElement; // General element ID or JSXGraph object

export interface PointDef extends JXGCommonAttributes {
  type: 'point';
  coords: [number, number] | [() => number, () => number]; // Can be static or dynamic
  size?: number; // Point size
}

export interface LineDef extends JXGCommonAttributes {
  type: 'line';
  points: [JXGPointRef, JXGPointRef]; 
}

export interface SegmentDef extends JXGCommonAttributes {
  type: 'segment';
  points: [JXGPointRef, JXGPointRef];
}

export interface CircleDef extends JXGCommonAttributes {
  type: 'circle';
  center: JXGPointRef; 
  radius: number | string; // Static radius or ID of a segment/slider for dynamic radius
}

export interface ArcDef extends JXGCommonAttributes {
  type: 'arc';
  center: JXGPointRef;
  radiusPoint: JXGPointRef; 
  anglePoint: JXGPointRef; 
}

export interface PolygonDef extends JXGCommonAttributes {
  type: 'polygon';
  vertices: JXGPointRef[]; 
}

export interface FunctionGraphDef extends JXGCommonAttributes {
  type: 'functiongraph';
  functionString: string; // e.g., "x*x", "Math.sin(x)", "Math.pow(x,3)"
  xDomain: [number, number]; // e.g., [-5, 5], the start and end x-values for plotting
}

export interface AngleDef extends JXGCommonAttributes {
  type: 'angle';
  points: [JXGPointRef, JXGPointRef, JXGPointRef]; // Point on one arm, Vertex, Point on other arm
  radius?: number; // Radius for the angle arc visualization
  // 'name' from JXGCommonAttributes can be used for the angle label e.g., "30°"
}

export interface EllipseDef extends JXGCommonAttributes {
  type: 'ellipse';
  center: JXGPointRef;
  horizontalRadius: number; // Semi-axis length along x-direction from center
  verticalRadius: number;   // Semi-axis length along y-direction from center
}

export interface SemicircleDef extends JXGCommonAttributes {
  type: 'semicircle';
  points: [JXGPointRef, JXGPointRef]; // The two points defining the diameter
}

export interface TextDef extends JXGCommonAttributes {
  type: 'text';
  coords: [number, number]; // [x, y] position of the text
  text: string;             // The content of the text
  fontSize?: number;
  anchorX?: 'left' | 'middle' | 'right'; // For JSXGraph text alignment
  anchorY?: 'top' | 'middle' | 'bottom'; // For JSXGraph text alignment
  useMathJax?: boolean;
  // `color` from JXGCommonAttributes will be used for text color via commonAttrs logic in display
  // `strokeColor` is what JSXGraph uses for text `fill`.
}

export type GeometricElement = PointDef | LineDef | SegmentDef | CircleDef | ArcDef | PolygonDef | FunctionGraphDef | AngleDef | EllipseDef | SemicircleDef | TextDef;

export type RepresentationType = 'svg' | 'geometry' | 'text_only';

export interface DiagramData {
  diagramTitle?: string;
  elements: DiagramElement[]; // Kept for potential SVG output, can be empty for geometry
  geometricElements?: GeometricElement[]; // For JSXGraph
  description?: string; 
  viewBox?: string; // SVG specific, JSXGraph handles its own bounding box
  errorParsing?: boolean; 
  representationType: RepresentationType;
}

export type QuestionCategory = 'MCQ' | 'ShortAnswer2' | 'ShortAnswer3' | 'LongAnswer5' | 'CaseStudy'; // Removed 'Custom' as we map to existing

export interface QuestionTypeConfig {
  id: QuestionCategory;
  label: string;
  marks: number;
}

export interface PaperQuestionConfiguration {
  category: QuestionCategory;
  count: number;
}

export interface CustomQuestionEntry {
  text: string;
  category: QuestionCategory;
  generateDiagram?: boolean; // New: Flag to indicate if diagram should be generated
}

export interface PaperConfiguration {
  subject: string;
  grade: string;
  chapters: string[];
  timeDuration: string;
  totalMarks: number; // Can be calculated or entered
  questionCounts: PaperQuestionConfiguration[];
  customQuestions?: CustomQuestionEntry[];
  // generalInstructions?: string; // Add later
}

export interface QuestionItem {
  id: string;
  text: string; // Editable in draft stage
  category: QuestionCategory; // e.g., MCQ, ShortAnswer
  marks: number;
  isDiagramRecommended?: boolean; // Hint from AI during draft generation OR user request for custom
  diagramData: DiagramData | null; // Interactive diagram for draft
  isLoadingDiagram: boolean;
  diagramError: AppError | null;
  diagramOriginalQuestionPrompt: string; // The prompt used for generating the diagram
  // For final paper
  staticDiagramImage?: string; // base64 SVG or PNG data URL
}

export interface AIParsedQuestion {
  questionText: string;
  category: QuestionCategory;
  marks: number;
  isDiagramRecommended?: boolean; // AI might not always provide this
  diagramPromptSuggestion?: string; // AI might not always provide this
}


export type AppView = 'config' | 'draft' | 'final';
export type Chapter = string; // This can remain as string, representing the chapter's displayName or id


export interface ExerciseDetail {
  exerciseName: string; // e.g., "Exercise 1.1" or "Exercise 1.1 - Euclid's Division Algorithm"
  description?: string; // General description of the exercise focus
  questionDistribution?: string; // e.g., "5 questions (4 long answer, 1 short answer)"
  topics?: string[]; // Specific topics or question types, e.g., ["Prime factorization problems...", "LCM and HCF calculations..."]
  isRemovedCBSE?: boolean;
  notes?: string; // e.g., "State board students may still encounter these questions."
}

export interface SyllabusChapterDetail {
  id: string; // Unique identifier, e.g., "real_numbers" or "Real Numbers"
  displayName: string; // User-friendly name, e.g., "Real Numbers"
  unit?: string; // e.g., "UNIT I: NUMBER SYSTEMS"
  unitMarks?: number; // Optional: Marks for the unit (can be chapter specific if provided)
  
  // New detailed fields from user input
  assessmentFocus?: string[]; // e.g., ["Questions emphasize multiple solution approaches..."]
  assessmentPattern?: string; // e.g., "Real Numbers carries 6 marks..."
  difficultyDistribution?: string; // e.g., "10 easy questions, 5 moderate questions..."
  angleRestrictions?: string; // e.g., "restricted to 30°, 45°, and 60° angles only"
  problemRestrictions?: string; // e.g., "Questions do not involve more than two right triangles..."
  keyTheoremsForProof?: string[]; // e.g., ["Tangent perpendicularity...", "Equal tangent lengths..."]
  removedContentNotes?: string; // e.g., "Frustum of cone calculations have been completely removed..."
  realWorldApplications?: string[]; // Specific applications mentioned for the chapter
  syllabusNotes?: string[]; // General notes about syllabus like "CBSE Syllabus (3 Exercises)" vs "State Board Syllabus (6 Exercises)"

  exercises?: ExerciseDetail[]; // Array of exercise details
  
  // Kept for backward compatibility or general guidance if exercises don't cover all
  includedTopics?: string[];
  deletedTopics?: string[]; // General deleted topics (redundant if exercise.isRemovedCBSE is comprehensive)
}