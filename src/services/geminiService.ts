
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { DiagramData, DiagramElement, RepresentationType, GeometricElement, PaperConfiguration, QuestionItem, AIParsedQuestion, QuestionCategory, SyllabusChapterDetail, ExerciseDetail } from '../types';
import { API_KEY_ERROR_MESSAGE, GEMINI_MODEL_TEXT, QUESTION_CONFIG_SECTIONS, CBSE_MATH_SYLLABUS_DETAILED } from '../config';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error(API_KEY_ERROR_MESSAGE);
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private parseDiagramJson(jsonString: string): Partial<DiagramData> | null {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[1]) {
      cleanJsonString = match[1].trim();
    }

    cleanJsonString = cleanJsonString.replace(/\/\/[^\n\r]*/g, '');

    let prevJsonStringIteration = "";
    let iterations = 0;
    const MAX_ITERATIONS_ARITHMETIC = 10; 

    const numPatternForRegex = "(-?(?:\\d+(?:\\.\\d+)?|\\.\\d+))";

    const multiplicationRegex = new RegExp(`${numPatternForRegex}\\s*\\*\\s*${numPatternForRegex}`, "g");
    const divisionRegex       = new RegExp(`${numPatternForRegex}\\s*\\/\\s*${numPatternForRegex}`, "g");
    const additionRegex       = new RegExp(`${numPatternForRegex}\\s*\\+\\s*${numPatternForRegex}`, "g");
    const subtractionRegex    = new RegExp(`${numPatternForRegex}\\s*-\\s*${numPatternForRegex}`, "g");
    
    const simplifyParenthesizedNumberRegex = new RegExp(`\\(\\s*${numPatternForRegex}\\s*\\)`, "g");


    while (prevJsonStringIteration !== cleanJsonString && iterations < MAX_ITERATIONS_ARITHMETIC) {
        prevJsonStringIteration = cleanJsonString;
        iterations++;

        cleanJsonString = cleanJsonString.replace(simplifyParenthesizedNumberRegex, "$1");
        cleanJsonString = cleanJsonString.replace(multiplicationRegex, (_match, num1Str, num2Str) => (parseFloat(num1Str) * parseFloat(num2Str)).toFixed(7));
        cleanJsonString = cleanJsonString.replace(divisionRegex, (_match, num1Str, num2Str) => {
            const num2 = parseFloat(num2Str);
            if (num2 === 0) return "0.0000000"; 
            return (parseFloat(num1Str) / num2).toFixed(7);
        });
        cleanJsonString = cleanJsonString.replace(additionRegex, (_match, num1Str, num2Str) => (parseFloat(num1Str) + parseFloat(num2Str)).toFixed(7));
        cleanJsonString = cleanJsonString.replace(subtractionRegex, (_match, num1Str, num2Str) => (parseFloat(num1Str) - parseFloat(num2Str)).toFixed(7));
    }

    if (iterations >= MAX_ITERATIONS_ARITHMETIC && prevJsonStringIteration !== cleanJsonString) {
        console.warn("JSON pre-processing for arithmetic reached max iterations. Final attempt to parse:", cleanJsonString);
    }

    try {
      const parsed = JSON.parse(cleanJsonString);
      if (parsed && typeof parsed === 'object') {
          const diagramData: Partial<DiagramData> = {
            representationType: 'text_only', elements: [], geometricElements: [],
          };
          if (parsed.diagramTitle && typeof parsed.diagramTitle === 'string') diagramData.diagramTitle = parsed.diagramTitle;
          if (parsed.description && typeof parsed.description === 'string') diagramData.description = parsed.description;
          if (parsed.representationType && ['svg', 'geometry', 'text_only'].includes(parsed.representationType)) {
            diagramData.representationType = parsed.representationType as RepresentationType;
          }
          
          if (parsed.viewBox && typeof parsed.viewBox === 'string') {
            const viewBoxParts = parsed.viewBox.split(' ').map(Number);
            if (viewBoxParts.length === 4 && viewBoxParts.every((p: number) => !isNaN(p))) {
                 diagramData.viewBox = parsed.viewBox;
            } else {
                console.warn(`[GeminiService] Invalid viewBox format received from AI: "${parsed.viewBox}". It will be ignored.`);
            }
          }

          if (diagramData.representationType === 'geometry') {
            if (Array.isArray(parsed.geometricElements)) diagramData.geometricElements = parsed.geometricElements.filter((el: any) => el && el.type) as GeometricElement[];
          } else if (diagramData.representationType === 'svg') {
            if (Array.isArray(parsed.elements)) diagramData.elements = parsed.elements.filter((el: any) => el && el.type && el.id) as DiagramElement[];
          }
          return diagramData;
      }
      return null;
    } catch (e) {
      console.error("Failed to parse JSON (Diagram) from Gemini:", e, "\nProblematic JSON string (after pre-processing):", cleanJsonString);
      if (jsonString.trim() !== cleanJsonString.trim()) console.error("Original JSON string (Diagram):", jsonString);
      return null;
    }
  }
  
  private parseQuestionsJson(jsonString: string): AIParsedQuestion[] | null {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[1]) {
      cleanJsonString = match[1].trim();
    }
    // Remove JavaScript-style line comments
    cleanJsonString = cleanJsonString.replace(/\/\/[^\n\r]*/g, '');
    
    // Step 1: Normalize ALL known newline styles (CRLF, CR, LF, LS, PS) to a single LF (\n).
    cleanJsonString = cleanJsonString.replace(/\r\n|\r|\u2028|\u2029/g, '\n');

    // Step 2: (REMOVED) cleanJsonString = cleanJsonString.replace(/\\\n/g, '\n');
    // The AI is now explicitly instructed not to use backslash + newline for line continuation in JSON strings,
    // and to correctly escape literal backslashes within string content. Removing this avoids corrupting
    // correctly formatted strings, especially those with ASCII art that might use `\\n`.

    // Step 3: Fix potentially bad escapes for pipe characters if AI misused them (e.g., \| instead of |).
    cleanJsonString = cleanJsonString.replace(/\\\|/g, '|');

    // Step 4: Remove problematic control characters (U+0000-U+001F, U+007F-U+009F)
    // EXCLUDING tab (U+0009 \t), newline (U+000A \n).
    cleanJsonString = cleanJsonString.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");

    try {
      const parsed = JSON.parse(cleanJsonString);
      if (Array.isArray(parsed)) {
        // Basic validation for each question object
        return parsed.filter(q => 
            q && typeof q === 'object' &&
            typeof q.questionText === 'string' &&
            typeof q.category === 'string' && QUESTION_CONFIG_SECTIONS.some(s => s.id === q.category) &&
            typeof q.marks === 'number' &&
            (typeof q.isDiagramRecommended === 'boolean' || q.isDiagramRecommended === undefined) &&
            (typeof q.diagramPromptSuggestion === 'string' || q.diagramPromptSuggestion === undefined) &&
            Object.keys(q).every(key => ['questionText', 'category', 'marks', 'isDiagramRecommended', 'diagramPromptSuggestion'].includes(key))
        ).map(q => {
          // NOTE: The "random $" sign cleaning logic has been removed from here
          // to allow MathJax to process LaTeX expressions correctly.
          // If stray dollar signs become an issue, a more MathJax-aware
          // cleaning function might be needed.
          return {
            questionText: q.questionText,
            category: q.category as QuestionCategory,
            marks: q.marks,
            isDiagramRecommended: q.isDiagramRecommended,
            diagramPromptSuggestion: q.diagramPromptSuggestion,
          };
        }) as AIParsedQuestion[];
      }
      console.error("Parsed questions JSON is not an array:", parsed);
      return null;
    } catch (e) {
      console.error("Failed to parse JSON (Questions) from Gemini:", e, "\nProblematic JSON string (after pre-processing):", cleanJsonString);
       if (jsonString.trim() !== cleanJsonString.trim()) console.error("Original JSON string (Questions):", jsonString);
      return null;
    }
  }

  async generateDraftQuestionPaper(config: PaperConfiguration): Promise<QuestionItem[]> {
    const questionBreakdown = config.questionCounts
        .map(qc => {
            const section = QUESTION_CONFIG_SECTIONS.find(s => s.id === qc.category);
            if (qc.count > 0 && section) {
                return `- ${qc.count} questions of category '${qc.category}' (${section.label}), each worth ${section.marks} marks.`;
            }
            return null;
        })
        .filter(Boolean)
        .join('\n');

    const chapterDetailsText = config.chapters.map(chapterName => {
      const chapterSyllabus = CBSE_MATH_SYLLABUS_DETAILED.find(ch => ch.displayName === chapterName);
      if (chapterSyllabus) {
        let text = `\n\nChapter: "${chapterName}" (Syllabus ID: ${chapterSyllabus.id})\n`;
        if (chapterSyllabus.unit) text += `Unit: ${chapterSyllabus.unit}\n`;
        if (chapterSyllabus.assessmentPattern) text += `Assessment Pattern: ${chapterSyllabus.assessmentPattern}\n`;
        if (chapterSyllabus.difficultyDistribution) text += `Difficulty Distribution Hint: ${chapterSyllabus.difficultyDistribution}\n`;
        if (chapterSyllabus.angleRestrictions) text += `Angle Restrictions: ${chapterSyllabus.angleRestrictions}\n`;
        if (chapterSyllabus.problemRestrictions) text += `Problem Complexity Restrictions: ${chapterSyllabus.problemRestrictions}\n`;
        
        if (chapterSyllabus.assessmentFocus && chapterSyllabus.assessmentFocus.length > 0) {
            text += `Key Assessment Focus Areas:\n${chapterSyllabus.assessmentFocus.map(f => `  - ${f}`).join('\n')}\n`;
        }
        if (chapterSyllabus.keyTheoremsForProof && chapterSyllabus.keyTheoremsForProof.length > 0) {
            text += `Key Theorems for Proof (CBSE): ${chapterSyllabus.keyTheoremsForProof.join(', ')}\n`;
        }
         if (chapterSyllabus.syllabusNotes && chapterSyllabus.syllabusNotes.length > 0) {
            text += `Syllabus Notes:\n${chapterSyllabus.syllabusNotes.map(n => `  - ${n}`).join('\n')}\n`;
        }
        if (chapterSyllabus.removedContentNotes) {
            text += `Removed Content Note: ${chapterSyllabus.removedContentNotes}\n`;
        }
         if (chapterSyllabus.realWorldApplications && chapterSyllabus.realWorldApplications.length > 0) {
            text += `Consider Real-world Applications like:\n${chapterSyllabus.realWorldApplications.map(app => `  - ${app}`).join('\n')}\n`;
        }

        if (chapterSyllabus.exercises && chapterSyllabus.exercises.length > 0) {
          text += `Exercise-specific guidance (use this to inform question style and content focus):\n`;
          chapterSyllabus.exercises.forEach((ex: ExerciseDetail) => {
            text += `  - ${ex.exerciseName}:\n`;
            if (ex.description) text += `    Description: ${ex.description}\n`;
            if (ex.questionDistribution) text += `    Original Question Distribution: ${ex.questionDistribution}\n`;
            if (ex.isRemovedCBSE) text += `    NOTE: THIS EXERCISE/TOPIC IS LARGELY REMOVED FROM CBSE SYLLABUS.\n`;
            if (ex.notes) text += `    Syllabus Notes for Exercise: ${ex.notes}\n`;
            if (ex.topics && ex.topics.length > 0) {
              text += `    Focus on question types like:\n${ex.topics.map(t => `      - ${t}`).join('\n')}\n`;
            }
          });
        }
        
        // General included/deleted topics as fallback or supplement
        if (chapterSyllabus.includedTopics && chapterSyllabus.includedTopics.length > 0) {
          text += `\n  Overall Included Topics for "${chapterName}" (may overlap with exercise details or provide broader context):\n${chapterSyllabus.includedTopics.map(t => `    - ${t}`).join('\n')}\n`;
        }
        if (chapterSyllabus.deletedTopics && chapterSyllabus.deletedTopics.length > 0) {
          text += `  Overall STRICTLY AVOID generating questions from these DELETED topics for "${chapterName}" (especially for CBSE, unless notes indicate state board relevance):\n${chapterSyllabus.deletedTopics.map(t => `    - ${t}`).join('\n')}\n`;
        }
        return text;
      }
      return `\n\nChapter: "${chapterName}"\n  - No detailed syllabus information found. Cover general topics appropriate for the grade.`;
    }).join('');


    const systemInstruction = `You are an AI Question Paper Generator. Your task is to create a draft question paper based on the provided configuration.
Output ONLY a JSON array of question objects. The entire response MUST be this JSON array and nothing else.
Each object in the array MUST strictly adhere to the following structure and ONLY include these keys:
1. "questionText": string (The full text of the question. Markdown tables, ASCII art, or LaTeX expressions (using $...$ for inline and $$...$$ for display) are allowed here.
   - Newlines within this string value should be represented as '\\n'.
   - ALL literal backslash characters '\\' within the string value MUST be escaped as '\\\\'. For example, if the text contains 'C:\\Users', it must be written as 'C:\\\\Users' in the JSON string. For LaTeX like '\\$\\tan\\theta\$', it must be '\\\\\\$\\tan\\\\theta\\\\\\$' in the JSON string for the backslashes to be literal, and then the dollar signs.
   - For LaTeX, ensure standard syntax: $\\tan \\theta = \\frac{3}{4}$.
   - Literal quote characters '"' within the string value MUST be escaped as '\\"'.
   - Other JSON special characters like tab must be escaped as '\\t', etc.
   - Do NOT use a single backslash followed by an actual newline character (e.g., '\\' then a newline in the source) as a line continuation within the string value; JSON does not support this for string values.)
2. "category": string (MUST be one of the valid category IDs provided in the user prompt, e.g., "MCQ", "ShortAnswer2")
3. "marks": number (MUST be the correct mark value for that specific category, as provided in the user prompt)
4. "isDiagramRecommended": boolean (true if a diagram would be highly beneficial for understanding or solving the question; otherwise false. Omit if not applicable, but prefer explicit true/false.)
5. "diagramPromptSuggestion": string (OPTIONAL, but STRONGLY RECOMMENDED if isDiagramRecommended is true. Provide a concise and effective prompt for generating the diagram. This could be the question text itself, or a slightly rephrased version focusing on the visual elements.)

ABSOLUTELY NO OTHER KEYS OR PROPERTIES SHOULD BE PRESENT IN THE QUESTION OBJECTS. For example, do not add keys like "pulsed", "reasoning", "solution", or any other field not listed above.
Do not add any comments within the JSON.
Do not add any explanatory text before or after the JSON array.
The response must start with '[' and end with ']'.

Ensure questions are appropriate for the specified grade and cover the given chapters, ADHERING STRICTLY to the DETAILED SYLLABUS INFORMATION provided for each chapter. This includes exercise-specific focuses, question styles, assessment patterns, and explicit mentions of included/deleted topics or theorems.
Strive for creativity and uniqueness in question generation. Avoid common textbook examples, past paper questions (PYQs), or questions that are frequently repeated. The goal is to produce novel, insightful,and thought-provoking questions that test conceptual understanding rather than rote memorization, aligned with the detailed syllabus.
Adhere strictly to the number of questions requested for each category and assign the correct marks per category.
If a question is primarily about 'Statistics' (e.g., mean, median, mode, probability distributions described textually, data interpretation from text/tables within questionText), then "isDiagramRecommended" MUST be false and "diagramPromptSuggestion" SHOULD NOT be provided. Focus on textual or tabular data presentation within the questionText itself for statistics.`;

    const userPrompt = `Generate a question paper with the following configuration:
Subject: ${config.subject}
Grade: ${config.grade}
Chapters selected by user (use these names for matching with syllabus details below): ${config.chapters.join(', ')}
Overall Total Marks for paper: ${config.totalMarks}
Overall Time Duration for paper: ${config.timeDuration}

Strictly follow this Question Breakdown:
${questionBreakdown}

Valid Category IDs and their marks (use these for "category" and "marks" fields):
${QUESTION_CONFIG_SECTIONS.map(s => `- ID: "${s.id}", Marks: ${s.marks}`).join('\n')}

**Detailed Syllabus Constraints and Guidance for Selected Chapters:**
${chapterDetailsText}

For each question:
- Ensure it is relevant to the specified chapters, grade level, AND THE DETAILED SYLLABUS information provided above for each chapter (including exercise focus, included/deleted topics, assessment patterns, etc.). This is CRITICAL.
- The "category" field for each question MUST exactly match one of the provided valid category IDs.
- The "marks" field for each question MUST exactly match the marks specified for its category.
- **Diagram Usage Principles:**
    - Set \`isDiagramRecommended\` to \`true\` ONLY if a diagram is *essential* for understanding the problem's premise (e.g., complex geometric setups, specific graph shapes not easily described in text) or if the diagram itself contains GIVEN information the student must interpret (like coordinates on a grid, values in a chart not fully detailed in text). The diagram must primarily show GIVEN information and should present incomplete information if the student needs to complete it.
    - If the core of the question is for the student to visualize, draw, or construct their own diagram based on the textual description, then \`isDiagramRecommended\` should be \`false\`. The goal is NOT to provide a diagram that reveals the solution or critical steps the student should deduce.
    - If \`isDiagramRecommended\` is \`true\`:
        - The \`questionText\` itself MUST be written to include all necessary explicit numerical data (e.g., lengths, angles, radii) and clear geometric relationships that would be required to construct an unambiguous diagram of the GIVEN situation. Avoid vague descriptions where precise data is needed for a drawing.
        - Try to naturally incorporate phrases like 'Refer to the diagram below, which is not drawn to scale.', 'The figure shows...', 'In the provided diagram, ...', or 'Consider the setup in the provided diagram:' into the \`questionText\`.
        - The \`diagramPromptSuggestion\` should then be this detailed \`questionText\` or a concisely focused excerpt of it that highlights ONLY THE VISUAL ELEMENTS THAT ARE EXPLICITLY GIVEN in the question. It should NOT include information that the student needs to find, calculate, or deduce.
- For questions specifically from the 'Statistics' chapter (if selected and applicable based on its syllabus details):
    -   \`isDiagramRecommended\` MUST be \`false\`.
    -   \`diagramPromptSuggestion\` SHOULD NOT be provided.
    -   Avoid generating questions that would inherently require visual plots like histograms, bar charts, pie charts, or ogives as the primary component to be generated by the diagram tool. Instead, focus on calculations, interpretations of data provided in the question text (which can include Markdown tables), or conceptual understanding.
- Generate the precise number of questions requested for each category. Do not generate more or fewer questions for any category than specified in the "Question Breakdown".
- VERY IMPORTANT: Generate unique and creative questions. Do not repeat common examples or past questions. Aim for novel scenarios, inspired by the detailed exercise focuses and application areas mentioned in the syllabus.
- For "questionText" containing Markdown tables, ensure the pipe characters '|' are used normally and are NOT escaped with a backslash (i.e., use '|', not '\\|').
- For "questionText" containing LaTeX expressions for mathematics, use standard LaTeX syntax. For inline math, use single dollar signs, e.g., $\\tan \\theta = \\frac{3}{4}$. For display math, use double dollar signs, e.g., $$\\sum_{i=0}^{n} x_i$$. Ensure backslashes in LaTeX commands are properly escaped for JSON string values (e.g., '\\\\tan', '\\\\frac').
- **CRITICAL STRING FORMATTING for "questionText":**
    - Newlines within the string value MUST be represented as '\\n'.
    - ALL literal backslash characters '\\' (e.g., in ASCII art, paths, or LaTeX commands) MUST be escaped as '\\\\' in the JSON string.
    - Literal double quotes '"' within the string value MUST be escaped as '\\"'.
    - Do NOT use a single backslash followed by an actual newline character in the JSON source as a line continuation; this is invalid JSON for string values. Instead, ensure the entire string value is on one logical line in the JSON, or use standard JSON string concatenation if your generation process builds strings in multiple steps before forming the final JSON.
`;
    
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }], 
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.45, // Slightly adjusted temperature for potentially more constrained and creative generation
          responseMimeType: "application/json",
        },
      });

      console.log("[GeminiService Questions Raw Response Full Object]:", response); 
      if (!response || typeof response.text !== 'string') {
        console.error("[GeminiService Questions] Invalid response structure or missing text. Full response logged above.");
        const errorDescription = `AI response for question generation was invalid or text was missing.`;
        throw new Error(errorDescription + (response ? ` Raw response status: ${ (response as any).status }` : ""));
      }
      const jsonString = response.text;
      const parsedAiQuestions = this.parseQuestionsJson(jsonString);

      if (parsedAiQuestions && parsedAiQuestions.length > 0) {
        return parsedAiQuestions.map((aiQuestion): QuestionItem => {
            const sectionConfig = QUESTION_CONFIG_SECTIONS.find(s => s.id === aiQuestion.category);
            const validCategory = sectionConfig ? sectionConfig.id : config.questionCounts[0]?.category || 'ShortAnswer2'; 
            const validMarks = sectionConfig ? sectionConfig.marks : config.questionCounts[0] ? QUESTION_CONFIG_SECTIONS.find(s=>s.id === config.questionCounts[0].category)?.marks || 2 : 2;
            const isRecommended = aiQuestion.isDiagramRecommended ?? false;

            return {
                id: crypto.randomUUID(),
                text: aiQuestion.questionText,
                category: sectionConfig ? aiQuestion.category : validCategory, 
                marks: sectionConfig && aiQuestion.marks === sectionConfig.marks ? aiQuestion.marks : validMarks, 
                isDiagramRecommended: isRecommended,
                diagramOriginalQuestionPrompt: aiQuestion.diagramPromptSuggestion || aiQuestion.questionText,
                diagramData: null,
                isLoadingDiagram: isRecommended, 
                diagramError: null,
            };
        });
      } else {
        console.error("Parsed AI questions are null or empty. Raw response:", jsonString);
        throw new Error("The AI did not return any valid questions. The response might have been empty or incorrectly formatted. Raw response logged to console.");
      }
    } catch (error: any) {
      console.error("Error calling Gemini API for question generation:", error);
      let errorMessage = "Failed to generate draft question paper due to an API error.";
      if (error.message) {
        errorMessage = `Failed to generate draft: ${error.message}`;
      }
      if (error.response && error.response.data) { 
        console.error("Gemini API Error Response Data (Questions):", error.response.data);
      }
      throw new Error(errorMessage);
    }
  }


  async generateDiagramDescription(question: string): Promise<DiagramData> {
    const prompt = `
      You are an AI assistant specialized in creating 2D visualizations for the *setup* of math and science problems, including geometric diagrams, graphs of algebraic equations, and visual representations of statistical tables for a light-themed UI.
      Your goal is to describe the construction necessary to visualize the problem for a light-themed UI using the JSXGraph library.
      You will output data as a JSON object. Ensure all coordinates and numerical values for GIVEN data are pre-calculated decimals, typically to 5-7 decimal places for precision unless whole numbers are exact.

      For the given question: "${question}"

      **Regarding Calculations and Unknowns (VERY IMPORTANT):**
      -   **DO NOT SOLVE THE PROBLEM.** Your role is to visualize the setup based on the given information to help the user solve it.
      -   If the question asks to "find" or "calculate" a specific length, angle, or other quantity, represent this **unknown quantity** on the diagram with a variable (e.g., "x", "h", "θ", "?") as its label. Do not calculate and display its numerical value in a label.
      -   **ONLY display numerical values in labels for quantities that are EXPLICITLY GIVEN in the problem statement.**
      -   Coordinates for points *must* be calculated numerically by you for drawing purposes, based on given information. But the *labels* for things the user needs to find should be variables.
      -   To be absolutely clear: **always include specific numerical measurements (e.g., '5 cm', '30°') as labels on the diagram IF AND ONLY IF those exact values are GIVEN in the question. For any measurement or quantity that is NOT explicitly given (e.g., it needs to be calculated by the user), use a variable (like 'x', 'h', 'length AB') as its label, NOT a pre-calculated numerical value.** This distinction is critical for the diagram's purpose.
      -   **The diagram's primary purpose is to visually represent the GIVEN conditions of the problem. It should not preemptively reveal relationships or constructions that the student is expected to derive as part of solving the question. For instance, if perpendicularity is to be proven, don't mark a right angle unless it's explicitly stated as given.**
      -   **If the question asks the student to 'visualize and solve', the diagram you generate should be minimal, perhaps only showing a basic coordinate system or a very partial figure if absolutely necessary for context. The goal is to *support* their visualization process, not replace it.**

      **Representing Important Lengths/Dimensions:**
      To clearly show lengths like height, width, radius, or specific calculated distances:
      1.  **Dimension Line:** A \`segment\` element drawn parallel to the dimension being measured.
          *   **Styling:** \`strokeColor: "#4b5563"\`, \`firstArrow: {"type": 1, "size": 4}\`, \`lastArrow: {"type": 1, "size": 4}\`, \`strokeWidth: 1.5\`. (Note: the "type" here is for arrowhead style and is a number).
          *   **Placement:** Offset slightly. You may need new, invisible \`point\` elements for its ends.
      2.  **Extension Lines (Recommended):** Two \`segment\` elements perpendicular to the dimension line, from the feature to the dimension line ends.
          *   **Styling:** \`dash: 2\`, \`strokeColor: "#9ca3af"\`, \`strokeWidth: 1\`. No arrowheads.
      3.  **Dimension Text:** A \`text\` element displaying the value.
          *   **Content:** If the length is GIVEN, use its numerical value (e.g., "10 cm"). If the length is UNKNOWN (to be found by the user), use a variable (e.g., "h cm", "x").
          *   **Placement:** Near the middle of the dimension line.
          *   \`strokeColor: "#1f2937"\` (for JXG.Text, this sets its color), \`fontSize: 10\` or \`12\`.
      4.  **Direct Labeling on Segments:** For some lengths, especially on angled segments or when a full dimension line is complex, you can label the segment directly using its \`name\` attribute.
          *   **Content:** If the segment's length is GIVEN, use the numerical value. If it's UNKNOWN, use a variable (e.g., \`"name": "l"\`).
          *   **Styling:** Set \`label: {"color": "desired_color", "fontSize": 12, "useMathJax": true_if_variable}\`.

      **Key Geometric Interpretations for JSXGraph:**
      - **Circle:** Defined by a center point and radius.
      - **Algebraic Equation Graphs (Function Graphs):** Use 'functiongraph' type. Example: \`{"type": "functiongraph", "id": "fg1", "functionString": "x*x - 2", "xDomain": [-10, 10]}\`
      - **Standalone Text Labels:** Use 'text' type for arbitrary text placement (like dimension values).

      **Representing 3D Objects as 2D Cross-Sections:**
      Generate a 2D cross-sectional view.
      - **Hemispheres:** Use 'semicircle'. Order of points in \`"points": ["P1", "P2"]\` determines upward/downward curve relative to the P1-P2 diameter.
      - **Cones/Cylinders (Bases/Tops):** Use 'ellipse' for perspective. 'horizontalRadius' is actual, 'verticalRadius' is smaller (e.g., 0.3 * horizontalRadius).

      **Angles of Elevation and Depression:**
      - Crucial for trigonometry. Defined by three points: \`points: ["P1_on_horizontal", "Vertex_observer", "P2_target_object"]\`.
      - **Styling:** Type \`"angle"\`, \`name\` is its value (e.g., "30°" if given, or "θ" if unknown). Distinct \`strokeColor\` (e.g., \`"#ef4444"\`), \`fillColor\` (e.g., \`"#fee2e2"\`), \`fillOpacity: 0.5\`. Appropriate \`radius\`. Label color matches stroke. For angle labels, use a smaller offset like \`[3, -5]\` (or similar, adjust slightly for neatness) within the label properties to position the text (e.g., "30°") closely and neatly within or very near the angle arc.

      **Representing Right Angles (90°) with a Square Symbol:**
      To visually indicate a right angle (90°), the preferred method is to draw a small square symbol at the vertex.
      1.  **Vertex:** This is the point where the two perpendicular segments meet (e.g., 'V').
      2.  **Size of the Square:** The side length 's' of this square symbol should be small, typically around **0.2 to 0.3 units** in your diagram's coordinate system. For example, if your \`viewBox\` is around \`"-5 5 5 -5"\`, a side length of \`0.25\` would be appropriate. Adjust slightly based on the overall scale of the diagram, but keep it modest.
      3.  **Construction Points:** You will need to define three additional \`point\` elements to form the corners of the square with the vertex V. These points should typically be \`visible: false\`.
          *   Let the vertex be V at \`(vx, vy)\`.
          *   If the right angle's arms extend roughly along the positive X and positive Y axes from V (forming the first quadrant relative to V), the points would be:
              *   P1 (on X-axis arm): \`[vx + s, vy]\`
              *   P_corner (the corner of the square): \`[vx + s, vy + s]\`
              *   P2 (on Y-axis arm): \`[vx, vy + s]\`
              The polygon would then be \`[V, P1, P_corner, P2]\`.
          *   **Crucially, you must adapt the coordinates of P1, P_corner, and P2 based on the actual orientation of the right angle.** For example, if the arms go along -X and +Y from V, P1 would be \`[vx - s, vy]\`, P_corner \`[vx - s, vy + s]\`, P2 \`[vx, vy + s]\`. Always ensure the square sits neatly *inside* the 90-degree angle.
      4.  **Polygon Definition:** Create a \`polygon\` element.
          *   \`id\`: e.g., \`"right_angle_marker_V"\`
          *   \`vertices\`: \`["V_id", "P1_id", "P_corner_id", "P2_id"]\` (using the IDs of the vertex and the three new points).
      5.  **Styling for the Square Polygon:**
          *   \`strokeColor\`: Use the same color as one of the segments forming the angle (e.g., \`"#6b7280"\` - slate-500), or a dedicated subtle color for such markers.
          *   \`strokeWidth\`: \`1\` or \`1.5\`.
          *   \`fillColor\`: Often not filled. If you must use a fill, make it very subtle, e.g., \`"#f3f4f6"\` (slate-100) and \`fillOpacity: 0.3\`. Or, omit \`fillColor\` entirely.
          *   **Do not use the \`name\` attribute to label this square polygon with "90°".** The square symbol itself is the standard mathematical notation for a right angle.
          *   Make sure the construction points P1, P_corner, P2 are set to \`visible: false\`.
      This method is generally preferred over a large circular arc and "90°" text for denoting right angles, as it is cleaner and less obtrusive.

      **Visualizing Statistical Tables (e.g., Frequency Distributions):**
      If the question involves a statistical table, attempt to visualize it using JSXGraph primitives.
      1.  **Determine Layout:**
          *   Count number of rows (numRows) and columns (numCols).
          *   Estimate reasonable cell width (cellWidth) and cell height (cellHeight). E.g., cellWidth=2.0, cellHeight=0.8 units. These might need to vary based on expected content length.
          *   Calculate total table width (numCols * cellWidth) and height (numRows * cellHeight).
          *   Choose a starting top-left coordinate for the table (e.g., \`startX = -totalWidth/2\`, \`startY = totalHeight/2\`).
      2.  **Grid Lines:**
          *   Generate \`segment\` elements for horizontal lines. For each row \`r\` from 0 to numRows:
              *   Y-coordinate: \`y = startY - r * cellHeight\`
              *   Points: \`[[startX, y], [startX + totalWidth, y]]\`
          *   Generate \`segment\` elements for vertical lines. For each column \`c\` from 0 to numCols:
              *   X-coordinate: \`x = startX + c * cellWidth\`
              *   Points: \`[[x, startY], [x, startY - totalHeight]]\`
          *   **Styling for Grid Lines:** \`strokeColor: "#cbd5e1"\` (slate-300), \`strokeWidth: 1\`.
      3.  **Table Headers and Cell Content:**
          *   For each cell (header or data):
              *   Create a \`text\` element.
              *   Calculate the center coordinates of the cell. For cell at row \`r\`, col \`c\`:
                  *   \`textX = startX + c * cellWidth + cellWidth / 2\`
                  *   \`textY = startY - r * cellHeight - cellHeight / 2\`
              *   \`coords: [textX, textY]\`
              *   \`text\`: The actual header or data value for that cell.
              *   **Styling for Text:**
                  *   Headers: \`strokeColor: "#334155"\` (slate-700), \`fontSize: 11\` or \`12\`, \`cssClass: "font-semibold"\` (if possible, or rely on renderer default).
                  *   Data: \`strokeColor: "#475569"\` (slate-600), \`fontSize: 10\` or \`11\`.
                  *   Common: \`anchorX: "middle"\`, \`anchorY: "middle"\`.
      4.  **ViewBox:** Ensure the \`viewBox\` is calculated to encompass the entire table with some padding.
      5.  **Description:** In the \`description\` field of the JSON, also provide the table data, perhaps using Markdown table format as a fallback or for clarity.
      Example structure for a single cell's text:
      \`\`\`json
      {
        "type": "text", "id": "cell_r0_c0_header_age", "coords": [-2.5, 1.6], "text": "Age Group", 
        "strokeColor": "#334155", "fontSize": 12, "anchorX": "middle", "anchorY": "middle"
      }
      \`\`\`
      (Coordinates and IDs are illustrative). The AI must compute all actual coordinates.

      **Example 1: Toy Problem - Cone on Hemisphere (Given Dimensions)**
      Question: "A toy is in the form of a cone of radius 3.5 cm mounted on a hemisphere of the same radius. The total height of the toy is 15.5 cm."
      (All dimensions are GIVEN. AI calculates intermediate points/heights for drawing. Labels show given numbers.)
      JSON Output:
      \`\`\`json
      {
        "diagramTitle": "Cross-section: Cone on Hemisphere",
        "representationType": "geometry",
        "viewBox": "-4.5 16.5 5.5 -4.5", 
        "geometricElements": [
          {"type": "point", "id": "O", "coords": [0,0], "name": "O", "visible": true, "size":1, "strokeColor":"#4b5563", "label":{"offset":[-10,-10], "fontSize":12, "color":"#4b5563"}},
          {"type": "point", "id": "B_left", "coords": [-3.5,0], "visible": false},
          {"type": "point", "id": "B_right", "coords": [3.5,0], "visible": false},
          {"type": "point", "id": "V_cone", "coords": [0,12], "name": "V", "label": {"offset": [5,10], "fontSize":12, "color": "#374151"}},
          {"type": "point", "id": "H_bottom", "coords": [0, -3.5], "name": "HB", "label": {"offset": [5,-15], "fontSize":12, "color": "#374151"}}, 
          
          {"type": "ellipse", "id": "cone_base_ellipse", "center": "O", "horizontalRadius": 3.5, "verticalRadius": 1.05, "strokeColor": "#838c99", "fillColor": "#e5e7eb", "fillOpacity": 0.6, "strokeWidth":1.5},
          {"type": "semicircle", "id": "hemi_arc", "points": ["B_right", "B_left"], "strokeColor": "#059669", "fillColor":"#d1fae5", "fillOpacity": 0.4, "strokeWidth": 2.5},
          {"type": "segment", "id": "base_line_vis", "points": ["B_left", "B_right"], "strokeColor": "#059669", "dash": 0, "strokeWidth": 2.5, "visible": true},
          {"type": "segment", "id": "cone_L", "points": ["B_left", "V_cone"], "strokeColor": "#2563eb", "strokeWidth": 2.5},
          {"type": "segment", "id": "cone_R", "points": ["B_right", "V_cone"], "strokeColor": "#2563eb", "strokeWidth": 2.5},

          {"type": "point", "id": "Dim_TH_start", "coords": [4.5, -3.5], "visible": false},
          {"type": "point", "id": "Dim_TH_end", "coords": [4.5, 12], "visible": false},
          {"type": "segment", "id": "dim_totalH_line", "points": ["Dim_TH_start", "Dim_TH_end"], "strokeColor": "#4b5563", "strokeWidth": 1.5, "firstArrow": {"type":1, "size":4}, "lastArrow": {"type":1, "size":4}},
          {"type": "segment", "id": "dim_ext_H_top", "points": ["V_cone", "Dim_TH_end"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "segment", "id": "dim_ext_H_bottom", "points": ["H_bottom", "Dim_TH_start"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "text", "id": "dim_totalH_text", "coords": [4.8, 4.25], "text": "15.5 cm", "strokeColor":"#1f2937", "fontSize": 10, "anchorX": "left", "anchorY":"middle"}
        ],
        "description": "2D cross-section: Cone (radius 3.5cm) on a hemisphere (radius 3.5cm). Total height 15.5cm. All dimensions are given."
      }
      \`\`\`

      **Example 2: Cylinder with Hemispherical Ends (Given Dimensions)**
      Question: "A Gulab Jamun has a total length of 5 cm and diameter 2.8 cm. It's a cylinder with hemispherical ends."
      (All dimensions are GIVEN. Labels show these numbers.)
      JSON Output:
      \`\`\`json
      {
        "diagramTitle": "Cross-section: Gulab Jamun",
        "representationType": "geometry",
        "viewBox": "-3.0 2.2 3.0 -2.5", 
        "geometricElements": [
          {"type": "point", "id": "Cyl_TL", "coords": [-1.1, 1.4], "visible": false},
          {"type": "point", "id": "Cyl_BL", "coords": [-1.1, -1.4], "visible": false},
          {"type": "point", "id": "Cyl_TR", "coords": [1.1, 1.4], "visible": false},
          {"type": "point", "id": "Cyl_BR", "coords": [1.1, -1.4], "visible": false},
          {"type": "point", "id": "End_L", "coords": [-2.5, 0], "visible": false}, 
          {"type": "point", "id": "End_R", "coords": [2.5, 0], "visible": false},

          {"type": "polygon", "id": "cyl_body", "vertices": ["Cyl_TL", "Cyl_BL", "Cyl_BR", "Cyl_TR"], "fillColor": "#fde68a", "strokeColor": "#f59e0b", "fillOpacity": 0.7, "strokeWidth": 1.5},
          {"type": "semicircle", "id": "left_end", "points": ["Cyl_BL", "Cyl_TL"], "fillColor": "#fde68a", "strokeColor": "#f59e0b", "fillOpacity": 0.7, "strokeWidth": 1.5},
          {"type": "semicircle", "id": "right_end", "points": ["Cyl_TR", "Cyl_BR"], "fillColor": "#fde68a", "strokeColor": "#f59e0b", "fillOpacity": 0.7, "strokeWidth": 1.5},
          
          {"type": "point", "id": "Dim_TL_start", "coords": [-2.5, -1.9], "visible": false},
          {"type": "point", "id": "Dim_TL_end", "coords": [2.5, -1.9], "visible": false},
          {"type": "segment", "id": "dim_totalL_line", "points": ["Dim_TL_start", "Dim_TL_end"], "strokeColor": "#4b5563", "strokeWidth": 1.5, "firstArrow": {"type":1, "size":4}, "lastArrow": {"type":1, "size":4}},
          {"type": "segment", "id": "dim_ext_L_left", "points": ["End_L", "Dim_TL_start"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "segment", "id": "dim_ext_L_right", "points": ["End_R", "Dim_TL_end"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "text", "id": "dim_totalL_text", "coords": [0, -2.2], "text": "5 cm", "strokeColor":"#1f2937", "fontSize": 10, "anchorX": "middle", "anchorY":"top"}
        ],
        "description": "2D cross-section of a Gulab Jamun. Total length 5cm, diameter 2.8cm. All dimensions are given."
      }
      \`\`\`

      **Example 3: Angle of Elevation (Given Angle & Distance, Unknown Height/Ladder Length)**
      Problem context: "The angle of elevation of a ladder leaning against a wall is 60° and the foot of the ladder is 4.6 m away from the wall. Illustrate this to help find the height the ladder reaches and the ladder's length."
      (GIVEN: angle 60°, distance 4.6m. UNKNOWN: height 'h', ladder length 'l'. AI calculates points for drawing, but labels 'h' and 'l' as variables. Right angle at wall is shown with small square.)
      JSON Output:
      \`\`\`json
      {
        "diagramTitle": "Ladder Problem: Angle of Elevation",
        "representationType": "geometry",
        "viewBox": "-1.5 9 5.5 -2.5", 
        "geometricElements": [
          {"type": "point", "id": "FW", "coords": [0,0], "name": "Base of Wall (W)", "label": {"offset": [-10, -15], "fontSize": 10, "color":"#4b5563"}},
          {"type": "point", "id": "FL", "coords": [4.6, 0], "name": "Foot of Ladder (F)", "label": {"offset": [5, -15], "fontSize": 10, "color":"#4b5563"}},
          {"type": "point", "id": "TL", "coords": [0, 7.9672131], "name": "Top of Ladder (T)", "label": {"offset": [-10, 10], "fontSize": 10, "color":"#4b5563"}}, 
          
          {"type": "segment", "id": "Wall", "points": ["FW", "TL"], "strokeColor": "#6b7280", "strokeWidth": 2},
          {"type": "segment", "id": "Ground", "points": ["FW", "FL"], "strokeColor": "#6b7280", "strokeWidth": 2},
          {"type": "segment", "id": "Ladder", "points": ["FL", "TL"], "strokeColor": "#2563eb", "strokeWidth": 2.5, "name": "l", "label":{"color":"#1e40af", "fontSize":12, "useMathJax":true, "offset":[-15,10]}},
          
          {"type": "angle", "id": "elevAngle", "points": ["FW", "FL", "TL"], "name": "60°", "radius": 1.2, "strokeColor": "#ef4444", "fillColor": "#fee2e2", "fillOpacity": 0.5, "label": {"fontSize": 12, "color": "#ef4444", "offset": [3, -5]}},

          {"type": "point", "id": "RA_P1", "coords": [0.25, 0], "visible": false}, 
          {"type": "point", "id": "RA_Pcorner", "coords": [0.25, 0.25], "visible": false},
          {"type": "point", "id": "RA_P2", "coords": [0, 0.25], "visible": false},
          {"type": "polygon", "id": "rightAngleSymbol_FW", "vertices": ["FW", "RA_P1", "RA_Pcorner", "RA_P2"], "strokeColor": "#6b7280", "strokeWidth": 1, "fillColor": "#e5e7eb", "fillOpacity":0.3},

          {"type": "point", "id": "Dim_Dist_Start_G", "coords": [0, -0.9], "visible": false},
          {"type": "point", "id": "Dim_Dist_End_G", "coords": [4.6, -0.9], "visible": false},
          {"type": "segment", "id": "dim_dist_line_G", "points": ["Dim_Dist_Start_G", "Dim_Dist_End_G"], "strokeColor": "#4b5563", "strokeWidth": 1.5, "firstArrow": {"type":1, "size":4}, "lastArrow": {"type":1, "size":4}},
          {"type": "segment", "id": "dim_ext_Dist_1", "points": ["FW", "Dim_Dist_Start_G"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "segment", "id": "dim_ext_Dist_2", "points": ["FL", "Dim_Dist_End_G"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "text", "id": "dim_dist_text_G", "coords": [2.3, -1.2], "text": "4.6 m", "strokeColor":"#1f2937", "fontSize": 10, "anchorX": "middle", "anchorY":"top"},
          
          {"type": "point", "id": "Dim_H_Start", "coords": [-0.7, 0], "visible": false},
          {"type": "point", "id": "Dim_H_End", "coords": [-0.7, 7.9672131], "visible": false},
          {"type": "segment", "id": "dim_H_line", "points": ["Dim_H_Start", "Dim_H_End"], "strokeColor": "#4b5563", "strokeWidth": 1.5, "firstArrow": {"type":1, "size":4}, "lastArrow": {"type":1, "size":4}},
          {"type": "segment", "id": "dim_ext_H_1", "points": ["FW", "Dim_H_Start"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "segment", "id": "dim_ext_H_2", "points": ["TL", "Dim_H_End"], "dash": 2, "strokeColor": "#9ca3af", "strokeWidth": 1},
          {"type": "text", "id": "dim_H_text", "coords": [-1, 3.9836065], "text": "h", "strokeColor":"#1f2937", "fontSize": 12, "anchorX": "right", "anchorY":"middle", "useMathJax": true}
        ],
        "description": "Diagram: Ladder (length 'l') leans against a wall, making a 60° angle of elevation with the ground. Foot of ladder is 4.6m from wall. Height reached on wall is 'h'. The right angle at the wall-ground intersection is marked with a small square."
      }
      \`\`\`

      **Example 4: Sector of a Circle (Given Angle and Radius)**
      Question: "Illustrate a sector of a circle with radius 5 units and a central angle of 60 degrees."
      (GIVEN: radius 5, angle 60°. The sector is visualized as a filled arc. AI calculates points for drawing.)
      JSON Output:
      \`\`\`json
      {
        "diagramTitle": "Sector of a Circle",
        "representationType": "geometry",
        "viewBox": "-6 6 6 -1",
        "geometricElements": [
          { "type": "point", "id": "O", "coords": [0,0], "name": "O", "visible": true, "size":1, "strokeColor":"#4b5563" },
          { "type": "point", "id": "P_radius_start", "coords": [5,0], "name": "R", "visible": false }, 
          { "type": "point", "id": "P_angle_end", "coords": [2.5, 4.330127], "name": "A", "visible": false }, 
      
          { 
            "type": "arc", "id": "sectorArc", 
            "center": "O", "radiusPoint": "P_radius_start", "anglePoint": "P_angle_end",
            "strokeColor": "#2563eb", "strokeWidth": 1.5,
            "fillColor": "#bfdbfe", "fillOpacity": 0.6 
          },
      
          { "type": "segment", "id": "seg_radius1", "points": ["O", "P_radius_start"], "strokeColor": "#2563eb", "strokeWidth": 1.5 },
          { "type": "segment", "id": "seg_radius2", "points": ["O", "P_angle_end"], "strokeColor": "#2563eb", "strokeWidth": 1.5 },
      
          { "type": "text", "id": "angleLabel", "coords": [1.7, 1.0], "text": "60°", "fontSize": 12, "strokeColor": "#1e40af", "anchorX": "middle", "anchorY": "middle" }
        ],
        "description": "A sector of a circle with radius 5 units and central angle 60°. The arc is filled, and the bounding radii segments are shown to clearly define the sector."
      }
      \`\`\`

      JSON Output Structure:
      {
        "diagramTitle": "A concise title.",
        "representationType": "MUST be 'geometry' or 'text_only'.",
        "viewBox": "Optional. Example: \\"-5 5 5 -5\\" (minX maxY maxX minY). Calculate based on content + dimensioning. Provide reasonable values for a good initial view. MUST be a string containing 4 space-separated numbers if provided.",
        "geometricElements": [ /* Array of JSXGraph element definitions if 'geometry'. */ ],
        "description": "A brief textual explanation. ALWAYS required."
      }

      **VERY IMPORTANT GUIDELINES FOR NUMERICAL VALUES AND COORDINATES (CRITICAL FOR SUCCESSFUL RENDERING):**
      - **Coordinate Values (\`coords\` array for \`'point'\` and \`'text'\` types):**
          - Each coordinate value (e.g., \`x\` and \`y\` in \`[x,y]\`) **MUST BE A PRE-CALCULATED, LITERAL DECIMAL NUMBER** (e.g., \`3.14\`, \`-5.0\`, \`8.3333333\`). These should be actual numbers in the JSON, not strings. Aim for 5-7 decimal places if not an exact integer.
          - **DO NOT** use mathematical expressions, function calls (like \`Math.sqrt(2)\`, \`5*Math.sin(0.5)\`), or unresolved variables within coordinate values. For example, \`{"type": "point", "id": "P1", "coords": ["Math.sqrt(2)", 0]}\` IS INCORRECT and will FAIL. It MUST be \`{"type": "point", "id": "P1", "coords": [1.4142136, 0]}\` (or similar precision for the number).
          - If a coordinate depends on a calculation (e.g., \`3 * sqrt(2)\`), you MUST perform this calculation and provide the resulting decimal number directly.
          - This applies to all \`coords\` arrays for \`point\` and \`text\` elements.
      - **Other Numerical Properties (\`'radius'\`, \`'xDomain'\`, \`'horizontalRadius'\`, \`'verticalRadius'\`, etc.):**
          - These also MUST be pre-calculated literal decimal numbers (actual numbers in JSON, not strings). No expressions. Aim for 5-7 decimal places if not an exact integer.
      - **Allowed use of Math functions (e.g., \`Math.sqrt\`, \`Math.sin\`, \`Math.cos\`, \`Math.pow\`, constants like \`Math.PI\`):**
          - These functions and constants are **ONLY PERMITTED** within the \`functionString\` property of a \`functiongraph\` element (which is a string value itself).
          - Example for \`functionString\`: \`{"type": "functiongraph", "functionString": "Math.sqrt(16 - x*x)"}\` is CORRECT if it's for a graph.
          - Example of INCORRECT usage for coordinates: \`{"type": "point", "coords": ["Math.sqrt(2)", "Math.PI"]}\` will FAIL.
      - **Fractions:** Do not use fractions like '25/3'. Output decimals (e.g., \`8.3333333\`).
      - **Responsibility:** It is your responsibility as the AI to perform all necessary calculations to convert geometric descriptions and symbolic values into these precise decimal coordinates and parameters for drawing. The rendering engine expects literal numbers in the JSON structure.
      - Example: If point P is at \`[2.0,0.0]\` and another point Q is "5 units to the right of P", Q's coordinate for drawing is \`[7.0, 0.0]\`. If a point R is at \`(2*sqrt(3), 5)\`, its coordinates must be output as approximately \`[3.4641016, 5.0]\`.

      Guidelines for 'geometricElements':
      General Colors for light theme: Point stroke: '#1d4ed8'. Line/Segment/FunctionGraph stroke: '#047857'. Fills: Lighter, transparent (e.g., fillColor: "#d1fae5", fillOpacity: 0.4). Ellipses for 3D effect: subtle greys (stroke: "#838c99", fill: "#e5e7eb").
      Dimensioning Colors: Dimension Line stroke: \`"#4b5563"\`. Extension Line stroke: \`"#9ca3af"\`. Dimension Text (via strokeColor): \`"#1f2937"\`.
      Angle Colors: Stroke: \`"#ef4444"\`, Fill: \`"#fee2e2"\`, Opacity: \`0.5\`. Label color matches stroke. For angle labels, use an offset like \`[3, -5]\` within the label properties to position the text (e.g., "30°") neatly near the angle arc.
      - Point: \`{ "type": "point", "id": "A", "coords": [1.0,2.0], "name": "A", "visible": true }\` (Use invisible points for construction where needed.)
      - Line: \`{ "type": "line", "id": "l1", "points": ["A", "B"] }\`
      - Segment: \`{ "type": "segment", "id": "s1", "points": ["C", "D"], "firstArrow": ..., "lastArrow": ..., "name": "label_text_or_variable" }\`
      - Circle: \`{ "type": "circle", "id": "c1", "center": "O", "radius": 3.0 }\`
      - Semicircle: \`{ "type": "semicircle", "id": "sc1", "points": ["P1", "P2"] }\`
      - Polygon: \`{ "type": "polygon", "id": "poly1", "vertices": ["A", "B", "C"] }\`
      - Function Graph: \`{ "type": "functiongraph", "id": "fg1", "functionString": "Math.sin(x)", "xDomain": [-3.1415927, 3.1415927] }\`
      - Angle: \`{ "type": "angle", "id": "ang1", "points": ["P1", "Vertex", "P2"], "name": "30° or θ", "radius": 1.0, ... }\`
      - Ellipse: \`{ "type": "ellipse", "id": "e1", "center": "C", "horizontalRadius": 5.0, "verticalRadius": 2.0 }\`
      - Text: \`{ "type": "text", "id": "t1", "coords": [0.0,0.0], "text": "Value or Variable", "fontSize": 12, "strokeColor": "#334155", ... }\`

      **Point Definition and Referencing (ABSOLUTELY CRITICAL - NON-COMPLIANCE WILL CAUSE RENDERING FAILURE):**
      -   **RULE:** ALL 'point' elements **MUST** be defined as individual, top-level objects directly within the 'geometricElements' array.
      -   **RULE:** Each such top-level 'point' object **MUST** have a unique 'id' string property (e.g., \`"id": "P1"\`).
      -   **RULE:** When other elements (like 'line', 'segment', 'circle', 'polygon', 'angle', 'ellipse') need to refer to points (e.g., for their endpoints, center, vertices), they **MUST** use the string 'id' of these separately defined 'point' elements (e.g., \`"points": ["P1", "P2"]\` for a segment).
      -   **STRICTLY PROHIBITED:** **DO NOT** embed a full 'point' definition object (e.g., \`{"type": "point", "coords": [x,y], ...}\`) directly as a value for an element's 'center', or within an element's 'points' array, or within an element's 'vertices' array. This is called an "inline point definition" and is FORBIDDEN.
      -   **CONSEQUENCE OF VIOLATION:** Using an inline point definition will result in errors, and the diagram will likely fail to render correctly.
      -   This applies to ALL points, including those used for helper constructions like custom axes or dimension lines. Their endpoints must be defined as separate, top-level point objects.
      -   **Correct Example (Points defined separately, referenced by ID):**
          \`\`\`json
          "geometricElements": [
            { "type": "point", "id": "A", "coords": [0.0,0.0] },
            { "type": "point", "id": "B", "coords": [2.0,2.0] },
            { "type": "segment", "id": "seg1", "points": ["A", "B"] }
          ]
          \`\`\`
      -   **Incorrect Example (Inline point definition - THIS IS WRONG AND WILL FAIL):**
          \`\`\`json
          "geometricElements": [
            { "type": "point", "id": "A", "coords": [0.0,0.0] },
            { 
              "type": "segment", 
              "id": "seg1", 
              "points": ["A", { "type": "point", "id": "B_inline", "coords": [2.0,2.0] }] /* THIS IS WRONG */
            }
          ]
          \`\`\`
      This rule is non-negotiable: **ABSOLUTELY NO INLINE POINT DEFINITIONS.** All points MUST be defined at the top level of the 'geometricElements' array and referenced by ID.

      **VALID GEOMETRIC ELEMENT TYPES (ABSOLUTELY CRITICAL!):**
      The 'type' attribute for *each main object* in the 'geometricElements' array (e.g., describing a point, line, circle, etc.) **MUST** be one of permeated following exact **STRING** values:
      - "point"
      - "line"
      - "segment"
      - "circle"
      - "semicircle" 
      - "arc" (Use this for sectors/parts of circles. You can use \`fillColor\` and \`fillOpacity\` for a sector-like appearance. If distinct line segments are needed to form a "pie slice" sector, define an "arc" [potentially with fill for the area] and then two "segment" elements from the arc's center to its endpoints.)
      - "polygon"
      - "functiongraph"
      - "angle"
      - "ellipse"
      - "text"
      **UNDER NO CIRCUMSTANCES should this top-level 'type' attribute be "sector" or any other unlisted string.**
      **UNDER NO CIRCUMSTANCES should this top-level 'type' attribute be a number (e.g., \`"type": 1\`) or a string containing a number (e.g., \`"type": "1"\`). Using a number for the main element's 'type' will cause the diagram generation to FAIL. This is a common error to avoid.**
      This is fundamentally different from numeric 'type' attributes used *within specific nested options* like 'firstArrow' or 'lastArrow' (e.g., \`"firstArrow": {"type": 1, "size": 4}\` which defines an arrowhead style). The 'type' for the main element itself (a point, a line, etc.) MUST be a string from the list above. Do not invent new types.
      **Specifically, do NOT use types like "orthogonal", "perpendicular", "bisector", "sector", etc., as top-level element types. If you need to represent such concepts (e.g., a right angle, a perpendicular line, a sector of a circle), do so by constructing them from the allowed basic types listed above. For instance, to show a right angle, prefer creating a small square \`polygon\` at the vertex (see details in 'Representing Right Angles (90°) with a Square Symbol' section). For a sector, use an 'arc' with appropriate fill properties, or an 'arc' plus 'segment' elements (see Example 4).**

      Calculate all coordinates for drawing carefully. Ensure IDs are unique. Provide a 'viewBox' that comfortably fits all elements, including any dimensioning labels and drawn tables. Ensure 'viewBox' string has exactly 4 space-separated numbers.
      
      **Self-Correction / Final Check (CRUCIAL):**
      Before outputting the JSON, meticulously review every single object within the 'geometricElements' array. For each object representing a diagram element (like a point, line, segment, etc.):
      1.  Verify that its top-level 'type' attribute is a STRING from the approved list: "point", "line", "segment", "circle", "semicircle", "arc", "polygon", "functiongraph", "angle", "ellipse", "text". This list is exhaustive for top-level element types. Do not use other strings like "orthogonal" or "sector".
      2.  Ensure this 'type' is NOT a number (e.g., \`1\`, \`2\`).
      3.  Ensure this 'type' is NOT a stringified number (e.g., \`"1"\`, \`"2"\`).
      This check is critical. An incorrect 'type' (like a number, "sector", or an unlisted string like "orthogonal") for a main geometric element will cause a complete failure in rendering the diagram. This is distinct from numeric 'type' attributes used *within options* like arrowheads.
      4.  Re-check the **Coordinate Values** and **Other Numerical Properties** guidelines above: all such values MUST be actual numbers in the JSON (not strings, not expressions), except for 'functionString'. Aim for 5-7 decimal places.
      5.  **Re-check the Point Definition and Referencing guidelines with EXTREME CARE:**
          -   **ALL points MUST be defined as top-level objects within 'geometricElements'.**
          -   **EACH top-level point object MUST have a unique 'id' string.**
          -   **Points are THEN referenced by these string IDs only.**
          -   **ABSOLUTELY NO INLINE POINT DEFINITIONS** (i.e., no \`{"type":"point", ...}\` objects embedded within another element's \`points\`, \`center\`, or \`vertices\` properties). This is a common source of failure if not strictly followed. This applies even to endpoints of segments used to draw custom axes, for example.
      6.  If representing a right angle with a square polygon, ensure it's small (around 0.2-0.3 units side length) and styled subtly.
      7.  If generating a statistical table visualization, ensure all grid lines (\`segment\` elements) and cell contents (\`text\` elements) have accurately calculated coordinates and appropriate styling.
      8.  If a 'viewBox' is provided, it MUST be a string containing exactly four space-separated numbers (minX maxY maxX minY).

      Output MUST be a single JSON object.
    `;

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_MODEL_TEXT,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          temperature: 0.15, 
          responseMimeType: "application/json",
        },
      });
      
      console.log("[GeminiService Diagram Raw Response Full Object]:", response); 
      
      if (!response || typeof response.text !== 'string') {
        console.error("[GeminiService Diagram] Invalid response structure or missing text. Full response logged above.");
        const errorDescription = `AI response for diagram generation was invalid or text was missing.`;
        let responseStatusInfo = "";
        if (response && (response as any).status) { 
            responseStatusInfo = ` Raw response status: ${ (response as any).status }`;
        } else if (response && Object.keys(response).length === 0) {
             responseStatusInfo = ` Raw response object was empty.`;
        } else if (!response) {
            responseStatusInfo = ` Raw response object was null/undefined.`;
        }

        return {
          diagramTitle: "Invalid AI Response",
          elements: [],
          geometricElements: [],
          description: errorDescription + responseStatusInfo,
          representationType: 'text_only',
          errorParsing: true,
        };
      }

      const jsonString = response.text; 
      const parsedData = this.parseDiagramJson(jsonString);

      if (parsedData) {
        return {
          diagramTitle: parsedData.diagramTitle || "AI Generated Diagram",
          elements: parsedData.elements || [],
          geometricElements: parsedData.geometricElements || [],
          description: parsedData.description || "No specific description provided by AI.",
          viewBox: parsedData.viewBox, 
          representationType: parsedData.representationType || 'text_only',
          errorParsing: false,
        };
      } else {
        return {
          diagramTitle: "Error Parsing AI Response",
          elements: [],
          geometricElements: [],
          description: `Failed to parse the structured data from the AI. Raw response (after any client-side cleaning if different from original): \n${jsonString}`,
          representationType: 'text_only',
          errorParsing: true,
        };
      }
    } catch (error: any) {
      console.error("Error calling Gemini API for diagram generation:", error);
      let errorMessage = "Failed to generate diagram due to an API error.";
      if (error.message) {
        errorMessage += ` Details: ${error.message}`;
      }
      if (error.response && error.response.data) {
        console.error("Gemini API Error Response Data (Diagram):", error.response.data);
      }
      return {
        diagramTitle: "API Error",
        elements: [],
        geometricElements: [],
        description: errorMessage,
        representationType: 'text_only',
        errorParsing: true,
      };
    }
  }
}
