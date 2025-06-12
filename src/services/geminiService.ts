import { GoogleGenerativeAI } from '@google/generative-ai';
import type { 
  PaperConfiguration, 
  QuestionItem, 
  DiagramData, 
  AIParsedQuestion, 
  QuestionCategory,
  DoubtSolution
} from '../types';
import { GEMINI_MODEL_TEXT, QUESTION_CONFIG_SECTIONS } from '../config';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = 'AIzaSyCQrz2imBYmXUX6wSat-dJL7jfR1DAtHig';
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL_TEXT });
  }

  async generateDraftQuestionPaper(config: PaperConfiguration): Promise<QuestionItem[]> {
    const prompt = this.buildQuestionPaperPrompt(config);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseQuestionPaperResponse(text);
    } catch (error) {
      console.error('Error generating question paper:', error);
      throw new Error(`Failed to generate question paper: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateDiagramDescription(questionPrompt: string): Promise<DiagramData> {
    const prompt = this.buildDiagramPrompt(questionPrompt);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseDiagramResponse(text, questionPrompt);
    } catch (error) {
      console.error('Error generating diagram:', error);
      throw new Error(`Failed to generate diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async solveDoubt(doubtText: string, subject?: string, attachedImage?: string): Promise<DoubtSolution> {
    const prompt = this.buildDoubtSolvingPrompt(doubtText, subject, attachedImage);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseDoubtSolutionResponse(text, doubtText);
    } catch (error) {
      console.error('Error solving doubt:', error);
      throw new Error(`Failed to solve doubt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildQuestionPaperPrompt(config: PaperConfiguration): string {
    const questionBreakdown = config.questionCounts
      .filter(qc => qc.count > 0)
      .map(qc => {
        const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === qc.category);
        return `${qc.count} ${sectionConfig?.label || qc.category} (${sectionConfig?.marks || 0} marks each)`;
      })
      .join(', ');

    return `Generate a question paper with the following specifications:

Subject: ${config.subject}
Grade: ${config.grade}
Chapters: ${config.chapters.join(', ')}
Time Duration: ${config.timeDuration}
Total Marks: ${config.totalMarks}

Question Distribution:
${questionBreakdown}

Requirements:
1. Generate questions that are appropriate for the specified grade level
2. Ensure questions cover the selected chapters comprehensively
3. Include a mix of difficulty levels (easy, medium, hard)
4. For each question, indicate if a diagram would be helpful
5. Questions should be clear, unambiguous, and educationally sound

Format your response as a JSON array where each question object has:
{
  "questionText": "The actual question text",
  "category": "One of: MCQ, ShortAnswer2, ShortAnswer3, LongAnswer5, CaseStudy",
  "marks": number,
  "isDiagramRecommended": boolean,
  "diagramPromptSuggestion": "Optional suggestion for diagram if recommended"
}

Generate exactly the number of questions specified for each category.`;
  }

  private buildDiagramPrompt(questionPrompt: string): string {
    return `Create a geometric diagram description for the following question or scenario:

"${questionPrompt}"

Analyze this question and determine the best way to represent it visually. Consider:
1. Is this a geometric problem that needs precise geometric elements?
2. Is this a graph/function that needs coordinate plotting?
3. Is this a conceptual diagram that needs simple shapes and labels?

Respond with a JSON object in this exact format:
{
  "diagramTitle": "Brief title for the diagram",
  "description": "Detailed description of what the diagram shows",
  "representationType": "geometry" | "svg" | "text_only",
  "viewBox": "x y width height" (for coordinate bounds),
  "geometricElements": [
    {
      "type": "point" | "line" | "segment" | "circle" | "arc" | "polygon" | "functiongraph" | "angle" | "ellipse" | "semicircle" | "text",
      "id": "unique_identifier",
      "name": "display_label",
      // Type-specific properties:
      // For point: "coords": [x, y], "size": number
      // For line/segment: "points": ["point_id1", "point_id2"]
      // For circle: "center": "point_id", "radius": number
      // For text: "coords": [x, y], "text": "content"
      // etc.
      "strokeColor": "#color",
      "fillColor": "#color",
      "strokeWidth": number
    }
  ]
}

For geometry problems, use "geometry" type with precise geometric elements.
For function graphs, use "geometry" type with functiongraph elements.
For simple conceptual diagrams, use "svg" type.
If no visual representation is helpful, use "text_only".`;
  }

  private buildDoubtSolvingPrompt(doubtText: string, subject?: string, attachedImage?: string): string {
    let prompt = `Solve this academic doubt step by step:

Subject: ${subject || 'General'}
Question: "${doubtText}"`;

    if (attachedImage) {
      prompt += `\n\nNote: The user has attached an image. Please consider that there might be visual elements to this question that require analysis.`;
    }

    prompt += `

Provide a comprehensive solution in JSON format:
{
  "explanation": "Clear, detailed explanation of the concept and solution",
  "steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "relatedConcepts": ["concept1", "concept2", "concept3"],
  "confidence": 0.95,
  "additionalResources": [
    {
      "title": "Resource title",
      "url": "https://example.com",
      "type": "video" | "article" | "practice"
    }
  ]
}

Requirements:
1. Provide a clear, student-friendly explanation
2. Break down complex problems into manageable steps
3. Include related concepts that might help understanding
4. Suggest additional learning resources when appropriate
5. Be encouraging and supportive in tone
6. If the question is unclear, ask for clarification
7. If you're not confident about the answer, indicate that in the confidence score`;

    return prompt;
  }

  private parseQuestionPaperResponse(text: string): QuestionItem[] {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in response');
      }

      const parsedQuestions: AIParsedQuestion[] = JSON.parse(jsonMatch[0]);
      
      return parsedQuestions.map(q => ({
        id: crypto.randomUUID(),
        text: q.questionText,
        category: q.category,
        marks: q.marks,
        isDiagramRecommended: q.isDiagramRecommended || false,
        diagramData: null,
        isLoadingDiagram: q.isDiagramRecommended || false,
        diagramError: null,
        diagramOriginalQuestionPrompt: q.diagramPromptSuggestion || q.questionText
      }));
    } catch (error) {
      console.error('Error parsing question paper response:', error);
      throw new Error('Failed to parse AI response for question paper');
    }
  }

  private parseDiagramResponse(text: string, originalQuestion: string): DiagramData {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          diagramTitle: "Text-only Description",
          elements: [],
          geometricElements: [],
          description: text,
          representationType: 'text_only',
          errorParsing: true
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        diagramTitle: parsed.diagramTitle || "Generated Diagram",
        elements: parsed.elements || [],
        geometricElements: parsed.geometricElements || [],
        description: parsed.description || "",
        viewBox: parsed.viewBox,
        representationType: parsed.representationType || 'text_only',
        errorParsing: false
      };
    } catch (error) {
      console.error('Error parsing diagram response:', error);
      return {
        diagramTitle: "Parsing Error",
        elements: [],
        geometricElements: [],
        description: `Failed to parse diagram data. Raw response: ${text}`,
        representationType: 'text_only',
        errorParsing: true
      };
    }
  }

  private parseDoubtSolutionResponse(text: string, originalQuestion: string): DoubtSolution {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          explanation: text,
          steps: [],
          relatedConcepts: [],
          confidence: 0.7
        };
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        explanation: parsed.explanation || text,
        steps: parsed.steps || [],
        relatedConcepts: parsed.relatedConcepts || [],
        confidence: parsed.confidence || 0.8,
        additionalResources: parsed.additionalResources || []
      };
    } catch (error) {
      console.error('Error parsing doubt solution response:', error);
      return {
        explanation: `I understand you're asking about: "${originalQuestion}". Let me help you with this. ${text}`,
        steps: [],
        relatedConcepts: [],
        confidence: 0.6
      };
    }
  }
}