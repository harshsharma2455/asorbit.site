export interface FlattenPoint {
  x: number;
  y: number;
}

export enum ShapeType {
  Point = 'Point',
  Segment = 'Segment',
  Circle = 'Circle',
  Arc = 'Arc',
  Polygon = 'Polygon',
  Box = 'Box',
  Text = 'Text',
}

export interface BaseShapeInstruction {
  id?: string; // Optional unique ID for any shape
  type: ShapeType;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}

export interface PointInstruction extends BaseShapeInstruction {
  type: ShapeType.Point;
  x: number;
  y: number;
  radius?: number; // For drawing a small circle for the point
}

export interface SegmentInstruction extends BaseShapeInstruction {
  type: ShapeType.Segment;
  ps: FlattenPoint;
  pe: FlattenPoint;
}

export interface CircleInstruction extends BaseShapeInstruction {
  type: ShapeType.Circle;
  pc: FlattenPoint;
  r: number;
}

export interface ArcInstruction extends BaseShapeInstruction {
  type: ShapeType.Arc;
  pc: FlattenPoint;
  r: number;
  startAngle: number; // in radians
  endAngle: number;   // in radians
  counterClockwise?: boolean;
}

export interface PolygonInstruction extends BaseShapeInstruction {
  type: ShapeType.Polygon;
  points: FlattenPoint[]; // A single face (array of points)
}

export interface BoxInstruction extends BaseShapeInstruction {
  type: ShapeType.Box;
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface TextInstruction extends BaseShapeInstruction {
  type: ShapeType.Text;
  x: number;
  y: number;
  content: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string; // Text fill color, different from shape fill
  textAnchor?: 'start' | 'middle' | 'end';
  targetId?: string; // Optional ID of the shape this text is labeling
  offset?: FlattenPoint; // Optional x/y offset for fine-tuning placement
}

export type ShapeInstruction =
  | PointInstruction
  | SegmentInstruction
  | CircleInstruction
  | ArcInstruction
  | PolygonInstruction
  | BoxInstruction
  | TextInstruction;