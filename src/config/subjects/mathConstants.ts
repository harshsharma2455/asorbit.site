
import type { SyllabusChapterDetail } from '../../types';

export const CBSE_MATH_SYLLABUS_DETAILED: SyllabusChapterDetail[] = [
  {
    id: "Real Numbers",
    displayName: "Real Numbers",
    unit: "UNIT I: NUMBER SYSTEMS",
    assessmentPattern: "Real Numbers carries 6 marks in the Class 10 board examination with typically 3 questions distributed across different mark categories.",
    difficultyDistribution: "The difficulty distribution includes 10 easy questions, 5 moderate questions, and 3 complicated problems.",
    exercises: [
      {
        exerciseName: "Exercise 1.1 - Euclid's Division Algorithm",
        questionDistribution: "Original: 5 questions (4 long answer, 1 short answer)",
        description: "The original exercise focused on Euclid's Division Lemma applications.",
        isRemovedCBSE: true,
        notes: "This topic has been completely dropped from the CBSE syllabus 2025-26. State board students may still encounter these questions."
      },
      {
        exerciseName: "Exercise 1.2 - Fundamental Theorem of Arithmetic", // Corresponds to user's "EXERCISE 1.1"
        questionDistribution: "7 questions (4 long answer, 3 short answer)",
        description: "Focuses on prime factorization, LCM, HCF, and their applications.",
        topics: [
          "Express each number as a product of its prime factors (e.g., 140, 156, 3825, 5005, 7429).",
          "Find the LCM and HCF of pairs of integers and verify that LCM × HCF = product of the two numbers (e.g., 26 and 91, 510 and 92, 336 and 54).",
          "Find the LCM and HCF of integers by applying the prime factorisation method (e.g., 12, 15 and 21; 17, 23 and 29; 8, 9 and 25).",
          "Given HCF of two numbers, find their LCM (e.g., HCF (306, 657) = 9, find LCM (306, 657)).",
          "Check whether 6^n can end with the digit 0 for any natural number n.",
          "Explain why certain expressions are composite numbers (e.g., 7 × 11 × 13 + 13 and 7 × 6 × 5 × 4 × 3 × 2 × 1 + 5).",
          "Word problems involving LCM (e.g., circular path problem - Sonia takes 18 mins, Ravi takes 12 mins, when will they meet again?)."
        ]
      },
      {
        exerciseName: "Exercise 1.3 - Rational and Irrational Numbers", // Corresponds to user's "EXERCISE 1.2"
        questionDistribution: "3 questions (3 short answer)",
        description: "Focuses on proofs of irrationality.",
        topics: [
          "Prove that √5 is irrational.",
          "Prove that 3 + 2√5 is irrational.",
          "Prove that the following are irrationals: (i) 1/√2, (ii) 7√5, (iii) 6 + √2."
        ]
      }
    ],
    includedTopics: [
      "Fundamental Theorem of Arithmetic (Statement after reviewing properties of positive integers and motivating through examples).",
      "Proofs of irrationality of √2, √3, √5 and numbers involving these radicals (like 3+2√5, 1/√2, 7√5, 6+√2)."
    ],
    deletedTopics: [
      "Euclid's Division Lemma (As per CBSE reduction, Exercise 1.1 is removed for CBSE).",
      "Decimal representation of rational numbers in terms of terminating/non-terminating recurring decimals (Exercise 1.4 topics are not included as per user request)."
    ]
  },
  {
    id: "Polynomials",
    displayName: "Polynomials",
    unit: "UNIT II: ALGEBRA",
    unitMarks: 20, 
    assessmentFocus: [
        "Multiple Choice Questions: Testing basic polynomial properties and zero identification.",
        "Short Answer Questions: Requiring application of sum and product formulas.",
        "Long Answer Questions: Involving complex polynomial formation and verification problems."
    ],
    realWorldApplications: [
        "GPS navigation applications, engineering calculations, and financial modeling where polynomial relationships describe real-world phenomena."
    ],
    exercises: [
      {
        exerciseName: "Exercise 2.1 - Geometric Meaning of Zeros",
        questionDistribution: "1 question with 6 sub-parts",
        description: "Focusing on geometric interpretation of zeroes from graphs.",
        topics: [
          "Given graphs of y = p(x), find the number of zeroes of p(x) by counting the number of times the graph intersects the x-axis (similar to textbook Fig. 2.10 with various polynomial curve shapes like line, parabola, cubic curves)."
        ]
      },
      {
        exerciseName: "Exercise 2.2 - Relationship Between Zeros and Coefficients",
        questionDistribution: "2 questions with multiple parts each",
        description: "Dealing with zeros and coefficients of quadratic polynomials.",
        topics: [
          "Find the zeroes of quadratic polynomials and verify the relationship between the zeroes and the coefficients (e.g., for x² - 2x - 8; 4s² - 4s + 1; 6x² - 3 - 7x; 4u² + 8u; t² - 15; 3x² - x - 4). Use α + β = -b/a and αβ = c/a.",
          "Find a quadratic polynomial given the sum and product of its zeroes (e.g., sum=1/4, product=-1; sum=√2, product=1/3; sum=0, product=√5; sum=1, product=1; sum=-1/4, product=1/4; sum=4, product=1). Use x² - (sum of zeroes)x + (product of zeroes) = 0."
        ]
      },
      {
        exerciseName: "Exercise 2.3 - Division Algorithm",
        description: "Completely removed from CBSE syllabus.",
        isRemovedCBSE: true
      }
    ],
    includedTopics: [ 
        "Zeros of a Polynomial.",
        "Geometrical Meaning of Zeros (Interpreting graphs to find the number of zeroes).",
        "Relationship between Zeros and Coefficients of quadratic polynomials (Sum of zeroes = -b/a, Product of zeroes = c/a).",
        "Forming quadratic polynomials given sum and product of zeroes."
    ],
    deletedTopics: [
        "Division Algorithm for Polynomials (Statement and problems with real coefficients - Exercise 2.3)."
    ]
  },
  {
    id: "Pair of Linear Equations in Two Variables",
    displayName: "Pair of Linear Equations in Two Variables",
    unit: "UNIT II: ALGEBRA",
    assessmentFocus: [
        "Consistency Analysis Framework: Students learn to determine system behavior using coefficient ratios (Unique Solution: a₁/a₂ ≠ b₁/b₂, No Solution: a₁/a₂ = b₁/b₂ ≠ c₁/c₂, Infinite Solutions: a₁/a₂ = b₁/b₂ = c₁/c₂)"
    ],
    exercises: [
      {
        exerciseName: "Exercise 3.1 - Graphical Method Applications",
        description: "Graphical method solutions.",
        topics: [
          "Real-life scenario problems involving student participation, cost calculations, and age-related questions",
          "Coordinate plotting exercises requiring students to create solution tables",
          "Graph intersection analysis for determining unique solutions",
          "Consistency and inconsistency analysis through visual interpretation"
        ]
      },
      {
        exerciseName: "Exercise 3.2 - Algebraic Solution Methods",
        description: "Algebraic methods (substitution and elimination).",
        topics: [
          "Substitution Method: Step-by-step elimination of one variable",
          "Elimination Method: Adding or subtracting equations to eliminate variables",
          "System classification based on solution types (unique, infinite, no solution)"
        ],
        notes: "Cross-multiplication Method: Removed from current CBSE syllabus."
      },
      {
        exerciseName: "Exercise 3.3 - Advanced Applications",
        description: "Advanced problem-solving applications.",
        topics: [
          "Word problems involving money calculations, speed-distance-time scenarios",
          "Multi-step algebraic problem solving requiring equation formation from verbal descriptions",
          "Business and economics applications using linear relationships"
        ]
      }
    ],
    includedTopics: [
        "Pair of linear equations and their graphical solutions",
        "Consistency/Inconsistency",
        "Algebraic conditions for number of solutions",
        "Solution by substitution and elimination methods",
        "Simple situational problems"
    ],
    deletedTopics: [
        "Cross Multiplication Method",
        "Complex problems on equations reducible to linear equations"
    ]
  },
  {
    id: "Quadratic Equations",
    displayName: "Quadratic Equations",
    unit: "UNIT II: ALGEBRA",
    assessmentFocus: [
        "Questions emphasize multiple solution approaches with students expected to solve the same equation using different methods and verify results.",
        "The chapter integrates theoretical understanding with practical applications in fields like engineering and economics."
    ],
    exercises: [
      {
        exerciseName: "Exercise 4.1 - Standard Form Recognition",
        description: "Standard form identification and classification.",
        topics: [
          "Equation classification problems distinguishing quadratic from non-quadratic expressions",
          "Algebraic manipulation questions converting complex expressions to ax² + bx + c = 0 form",
          "Expression simplification requiring expansion and collection of like terms"
        ]
      },
      {
        exerciseName: "Exercise 4.2 - Factorization Techniques",
        description: "Factorization method applications.",
        topics: [
          "Splitting the middle term method: Finding two numbers whose sum equals the coefficient of x and product equals ac",
          "Perfect square trinomial factoring: Recognizing and factoring expressions like (a ± b)²",
          "Difference of squares applications: Factoring expressions of the form a² - b²"
        ]
      },
      {
        exerciseName: "Exercise 4.3 - Quadratic Formula and Discriminant",
        description: "Quadratic formula and discriminant analysis.",
        topics: [
          "Discriminant analysis: Using b² - 4ac to determine root nature",
          "Quadratic formula applications: x = (-b ± √(b² - 4ac))/2a for solving complex equations",
          "Root nature determination: Classifying roots as real/imaginary, equal/unequal"
        ]
      },
      {
        exerciseName: "Exercise 4.4 - Real-world Applications",
        description: "Real-life application problems.",
        topics: [
          "Area and perimeter optimization problems: Finding dimensions that maximize or minimize area",
          "Projectile motion calculations: Height and time relationships in physics applications",
          "Business scenario problems: Profit maximization and cost minimization using quadratic relationships"
        ]
      }
    ],
    includedTopics: [
        "Standard Form: ax² + bx + c = 0 (where a ≠ 0)",
        "Solution Methods: By factorization and using quadratic formula (only real roots)",
        "Discriminant: Relationship between discriminant and nature of roots",
        "Situational Problems related to day-to-day activities"
    ],
    deletedTopics: [
        "Situational problems based on equations reducible to quadratic equations"
    ]
  },
  {
    id: "Arithmetic Progressions",
    displayName: "Arithmetic Progressions",
    unit: "UNIT II: ALGEBRA",
    exercises: [
      {
        exerciseName: "Exercise 5.1 - Basic Concepts",
        questionDistribution: "4 problems",
        description: "Covering fundamental AP concepts.",
        topics: [
          "Common difference identification using d = aₙ₊₁ - aₙ",
          "First term and nth term calculations using aₙ = a + (n-1)d",
          "Sequence continuation problems requiring pattern recognition"
        ]
      },
      {
        exerciseName: "Exercise 5.2 - Formula Applications",
        questionDistribution: "20 problems",
        description: "Focusing on term calculations and applications.",
        topics: [
          "nth term finding: Using the general term formula with known values",
          "Sum calculations: Applying Sₙ = n/2[2a + (n-1)d] and Sₙ = n/2(a + l) formulas",
          "Given term problems: Finding specific terms when other parameters are known"
        ]
      },
      {
        exerciseName: "Exercise 5.3 - Word Problems and Applications",
        questionDistribution: "20 problems ranging from easy to difficult",
        topics: [
          "Financial calculations: Installment payments, salary increments, and savings patterns",
          "Measurement scenarios: Construction projects involving arithmetic progressions",
          "Daily life applications: Seating arrangements, brick laying patterns"
        ]
      },
      {
        exerciseName: "Exercise 5.4 - Advanced Problem Solving",
        questionDistribution: "5 problems",
        description: "Involving advanced applications.",
        topics: [
          "First negative term identification: Determining when AP terms become negative",
          "Multiple AP relationships: Problems involving interactions between different arithmetic progressions",
          "Complex sum and product problems: Higher-order thinking questions"
        ]
      }
    ],
    includedTopics: [
        "Motivation for AP",
        "nth Term Derivation and applications",
        "Sum of n Terms: Formula and practical applications",
        "Daily Life Applications using AP concepts"
    ],
    deletedTopics: [
        "Application in solving daily life problems based on sum of n terms (complex ones)" 
    ]
  },
  {
    id: "Triangles",
    displayName: "Triangles",
    unit: "UNIT IV: GEOMETRY",
    unitMarks: 15,
    syllabusNotes: [
        "CBSE Syllabus (3 Exercises): Ex 6.1, 6.2, 6.3",
        "State Board Syllabus (6 Exercises): Additional Ex 6.4, 6.5, 6.6 for extended coverage"
    ],
    keyTheoremsForProof: ["Only Theorem 1 (parallel line proportionality / Basic Proportionality Theorem) can be asked for proof in CBSE board exams 2025-26, while other theorems are used for concept application."],
    exercises: [
      {
        exerciseName: "Exercise 6.1 - Similarity Fundamentals",
        description: "Basic similarity concepts.",
        topics: [
          "Definition-based questions: Understanding similar triangles and their properties",
          "Counter-example problems: Identifying when triangles are not similar",
          "Basic similarity recognition: Using visual and numerical data"
        ]
      },
      {
        exerciseName: "Exercise 6.2 - Theorem Applications (Basic Proportionality Theorem)",
        description: "Proportionality theorem applications.",
        topics: [
          "Parallel line theorem: If a line parallel to one side of a triangle intersects the other two sides, it divides them proportionally (Proof expected for CBSE)",
          "Proportional division problems: Finding unknown segments using proportionality",
          "Construction questions: Drawing parallel lines and verifying proportional segments"
        ]
      },
      {
        exerciseName: "Exercise 6.3 - Similarity Criteria",
        description: "Triangle similarity criteria (stated without proof for CBSE).",
        topics: [
          "AA Similarity: Angle-Angle similarity proofs and applications",
          "SSS Similarity: Side-Side-Side proportionality problems",
          "SAS Similarity: Side-Angle-Side similarity verification"
        ]
      },
      { exerciseName: "Exercise 6.4 (State Board)", description: "Extended coverage for state boards." },
      { exerciseName: "Exercise 6.5 (State Board)", description: "Extended coverage for state boards." },
      { exerciseName: "Exercise 6.6 (State Board)", description: "Extended coverage for state boards." }
    ],
    includedTopics: [
        "Similar Triangles: Definitions, examples, counter-examples",
        "Basic Proportionality Theorem (Proof)",
        "Similarity Criteria (AA, SSS, SAS - stated without proof for CBSE)",
        "Differentiating between congruent and similar figures"
    ],
    deletedTopics: [
        "Area Theorem: Ratio of areas of similar triangles equals ratio of squares of corresponding sides (for CBSE)",
        "Pythagoras Theorem: Proof and converse of Pythagoras theorem (for CBSE)",
        "Complex Similarity Proofs beyond BPT (for CBSE)"
    ]
  },
  {
    id: "Coordinate Geometry",
    displayName: "Coordinate Geometry",
    unit: "UNIT III: COORDINATE GEOMETRY",
    unitMarks: 6,
    removedContentNotes: "Area of triangle calculations using coordinate methods have been removed from the current CBSE syllabus, though state boards may still include these topics.",
    exercises: [
      {
        exerciseName: "Exercise 7.1 - Distance Applications",
        description: "Distance formula applications. Key Formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]",
        topics: [
          "Point-to-point distance calculations: Finding distances between given coordinate pairs",
          "Collinearity verification: Using distance formula to check if three points lie on the same line",
          "Geometric shape identification: Determining if triangles are isosceles, equilateral, or scalene",
          "Real-world distance scenarios: GPS navigation and mapping applications"
        ]
      },
      {
        exerciseName: "Exercise 7.2 - Section Formula Applications",
        description: "Section formula problems. Key Formula: Internal division at ((m₁x₂ + m₂x₁)/(m₁ + m₂), (m₁y₂ + m₂y₁)/(m₁ + m₂))",
        topics: [
          "Midpoint calculations: Finding coordinates when a line segment is divided in ratio 1:1",
          "Line segment division: Finding coordinates when division ratio is given",
          "Centroid calculations: Finding triangle centroids using coordinate methods",
          "Point location problems: Determining coordinates satisfying specific geometric conditions"
        ]
      }
    ],
    includedTopics: [
        "Basic Concepts of coordinate geometry",
        "Distance Formula",
        "Section Formula (Internal division)",
        "Cartesian Plane basics"
    ],
    deletedTopics: [
        "Area of Triangle using coordinate geometry methods (for CBSE)"
    ]
  },
  {
    id: "Introduction to Trigonometry",
    displayName: "Introduction to Trigonometry",
    unit: "UNIT V: TRIGONOMETRY",
    unitMarks: 12, 
    angleRestrictions: "Problems restricted to 30°, 45°, and 60° angles only.",
    assessmentFocus: [ 
        "Calculating trigonometric ratios (sin, cos, tan, cosec, sec, cot) for acute angles in a right-angled triangle.",
        "Evaluating trigonometric ratios for standard angles: 30°, 45°, 60°.",
        "Verifying and applying the fundamental trigonometric identity: sin²θ + cos²θ = 1.",
        "Solving simple problems involving relationships between trigonometric ratios.",
        "Basic applications within a single right-angled triangle (e.g., finding unknown sides or angles given sufficient information, without complex scenarios like height/distance)."
    ],
    exercises: [
        {
          exerciseName: "Exercise 8.1 - Basic Ratios and Relationships",
          description: "Focuses on defining and calculating trigonometric ratios in right-angled triangles, determining ratios from given sides or other ratios, and basic properties.",
          topics: [
            "Determine sin A, cos A given sides AB, BC in a right-angled triangle.",
            "Find tan P – cot R from a given figure with side lengths.",
            "Calculate cos A and tan A if sin A is given (e.g., sin A = 3/4).",
            "Given a multiple of a ratio (e.g., 15 cot A = 8), find sin A and sec A.",
            "Given sec θ (e.g., sec θ = 13/12), calculate all other trigonometric ratios.",
            "If ∠A and ∠B are acute angles such that cos A = cos B, show that ∠A = ∠B.",
            "If cot θ is given (e.g., cot θ = 7/8), evaluate expressions like (1+sinθ)(1-sinθ)/((1+cosθ)(1-cosθ)) and cot²θ.",
            "If a multiple of cot A is given (e.g., 3 cot A = 4), check identities like (1-tan²A)/(1+tan²A) = cos²A – sin²A for validity.",
            "In triangle ABC (right-angled at B), if tan A is given (e.g., tan A = 1/√3), find values of expressions like sin A cos C + cos A sin C and cos A cos C – sin A sin C.",
            "In ΔPQR (right-angled at Q), if sum of two sides (PR + QR) and one side (PQ) are given, determine sin P, cos P, tan P.",
            "True/False justification: Statements about the range of tan A, possible values of sec A, meaning of cos A abbreviation, cot A as a product, and possible values of sin θ."
          ]
        },
        {
          exerciseName: "Exercise 8.2 - Ratios of Standard Angles (30°, 45°, 60°)",
          description: "Focuses on evaluating trigonometric expressions involving standard angles (30°, 45°, 60°), multiple choice questions based on these, and solving for angles using standard value results.",
          notes: "Problem solving is restricted to 30°, 45°, 60° angles as per CBSE syllabus notes for this chapter. Conceptual true/false or MCQs might touch upon 0° or 90° for understanding properties, but direct evaluation in problems should stick to 30°, 45°, 60°.",
          topics: [
            "Evaluate expressions like: sin 60° cos 30° + sin 30° cos 60°.",
            "Evaluate expressions like: 2 tan² 45° + cos² 30° – sin² 60°.",
            "Evaluate expressions like: cos 45° / (sec 30° + cosec 30°).",
            "Evaluate expressions like: (sin 30° + tan 45° – cosec 60°) / (sec 30° + cos 60° + cot 45°).",
            "Evaluate expressions like: (5 cos² 60° + 4 sec² 30° – tan² 45°) / (sin² 30° + cos² 30°).",
            "MCQ: Choose correct option for (2 tan 30°) / (1 + tan² 30°).",
            "MCQ: Choose correct option for (1 – tan² 45°) / (1 + tan² 45°).",
            "MCQ: 'sin 2A = 2 sin A' is true when A = ? (options like 0°, 30°, 45°, 60°).",
            "MCQ: Choose correct option for (2 tan 30°) / (1 – tan² 30°).",
            "If tan(A + B) = √3 and tan(A – B) = 1/√3; with conditions on A+B and A>B, find A and B.",
            "True/False justification: Statements about sin(A+B); whether sinθ increases as θ increases; whether cosθ increases as θ increases; sinθ=cosθ for all θ; cotA definition at A=0°."
          ]
        },
        {
          exerciseName: "Exercise 8.3 - Trigonometric Identities",
          description: "Focuses on expressing trigonometric ratios in terms of others, and proving various trigonometric identities.",
          notes: "For CBSE syllabus, the primary focus for proof is the identity sin²A + cos²A = 1 and its simple applications. The more complex identities listed below are often part of broader/state board syllabi or used in application-type questions rather than direct proof in CBSE exams. AI should be mindful of this distinction when generating questions for 'CBSE'.",
          topics: [
            "Express sin A, sec A, and tan A in terms of cot A.",
            "Write all other trigonometric ratios of ∠A in terms of sec A.",
            "MCQ: 9 sec²A – 9 tan²A = ?",
            "MCQ: (1 + tan θ + sec θ)(1 + cot θ – cosec θ) = ?",
            "MCQ: (sec A + tan A)(1 – sin A) = ?",
            "MCQ: (1 + tan²A) / (1 + cot²A) = ?",
            "Prove: (cosec θ – cot θ)² = (1 – cos θ) / (1 + cos θ).",
            "Prove: cos A / (1 + sin A) + (1 + sin A) / cos A = 2 sec A.",
            "Prove: tan θ / (1 – cot θ) + cot θ / (1 – tan θ) = 1 + sec θ cosec θ.",
            "Prove: (1 + sec A) / sec A = sin² A / (1 – cos A).",
            "Prove: (cos A – sin A + 1) / (cos A + sin A – 1) = cosec A + cot A (using identity cosec² A = 1 + cot² A).",
            "Prove: √((1 + sin A) / (1 – sin A)) = sec A + tan A.",
            "Prove: (sin θ – 2 sin³ θ) / (2 cos³ θ – cos θ) = tan θ.",
            "Prove: (sin A + cosec A)² + (cos A + sec A)² = 7 + tan² A + cot² A.",
            "Prove: (cosec A – sin A)(sec A – cos A) = 1 / (tan A + cot A).",
            "Prove: ((1 + tan² A) / (1 + cot² A)) = ((1 – tan A) / (1 – cot A))² = tan² A."
          ]
        }
    ],
    includedTopics: [
      "Trigonometric Ratios (sin, cos, tan, cosec, sec, cot) of an acute angle of a right-angled triangle.",
      "Proof of their existence (well-defined).",
      "Values of the trigonometric ratios for angles 30°, 45°, and 60°.",
      "Relationships between the ratios.",
      "Proof and applications of the identity sin²A + cos²A = 1. (Only this identity for direct proof in CBSE)",
      "Simple problems on identities (application based for CBSE, wider range for other boards/contexts as per Ex 8.3)."
    ],
    deletedTopics: [
      "Trigonometric ratios of complementary angles (for CBSE)" 
    ]
  },
  {
    id: "Some Applications of Trigonometry",
    displayName: "Some Applications of Trigonometry",
    unit: "UNIT V: TRIGONOMETRY",
    angleRestrictions: "All problems are restricted to 30°, 45°, and 60° angles.",
    problemRestrictions: "Questions do not involve more than two right triangles and maintain focus on practical measurement scenarios.",
    assessmentFocus: [ 
        "Solving problems involving angles of elevation.",
        "Solving problems involving angles of depression.",
        "Calculating heights of objects (buildings, towers, trees, etc.).",
        "Calculating distances between objects or from an observer.",
        "Problems involving up to two right triangles in a combined scenario.",
        "Real-world measurement scenarios in surveying, architecture, etc."
    ],
    exercises: [
      {
        exerciseName: "Exercise 9.1 - Height and Distance Applications",
        topics: [
          "Finding height/length in a single right triangle given an angle (30°, 45°, 60°) and one side (e.g., height of pole from rope length, length of slide).",
          "Broken tree problems: involves two parts of the tree forming a right triangle with the ground.",
          "Finding height/length of an object (tower, kite) given distance from observer/point and angle of elevation.",
          "Problems involving an observer's height, with changing angles of elevation as observer moves (e.g., boy walking towards building, girl observing balloon).",
          "Two angles of elevation from the same point to different heights on the same vertical line (e.g., bottom and top of a tower on a building, pedestal and statue).",
          "Two angles of elevation to the same object from different points along a line (e.g., TV tower from two points on canal bank).",
          "Problems involving angles of elevation and depression from the same observation point (e.g., top of building to top and foot of a tower).",
          "Problems involving two objects and angles of depression from an observation point (e.g., lighthouse and two ships).",
          "Problems with two objects at different positions observed from a point between/around them (e.g., two poles of equal height on opposite sides of a road).",
          "Problems involving uniform speed and changing angles of depression over time (e.g., car approaching a tower)."
        ]
      }
    ],
    includedTopics: [
        "Angle of Elevation: Concept and applications",
        "Angle of Depression: Understanding and problem-solving",
        "Simple Problems on Heights and distances using trigonometry (30°, 45°, 60° only)",
        "Problems involving up to two right triangles"
    ],
    deletedTopics: [ ]
  },
  {
    id: "Circles",
    displayName: "Circles",
    unit: "UNIT IV: GEOMETRY", 
    keyTheoremsForProof: [
        "Tangent perpendicularity: The tangent at any point of a circle is perpendicular to the radius through the point of contact",
        "Equal tangent lengths: The lengths of tangents drawn from an external point to a circle are equal"
    ],
    exercises: [
      {
        exerciseName: "Exercise 10.1 - Fundamental Properties",
        description: "Basic circle properties and tangent concepts.",
        topics: [
          "Tangent property questions: Understanding perpendicularity of tangent to radius",
          "Fill-in-the-blank conceptual problems: Testing basic circle terminology",
          "Point-circle relationship analysis: Determining positions relative to circles",
          "Multiple tangent concepts: Understanding infinite tangent possibilities from external points"
        ]
      },
      {
        exerciseName: "Exercise 10.2 - Tangent Applications",
        description: "Tangent length calculations and applications.",
        topics: [
          "External point tangent length calculations: Using the theorem that tangent lengths from external point are equal",
          "Tangent construction problems: Geometric construction exercises",
          "Proof-based questions: Demonstrating tangent properties and relationships",
          "Real-world applications: Circle-based problems in engineering and design"
        ]
      }
    ],
    includedTopics: [
        "Tangent to a circle at point of contact",
        "Proof: Tangent is perpendicular to radius at contact point",
        "Proof: Tangents from external point are equal in length",
        "Circle-Line Relationships"
    ],
    deletedTopics: [  ]
  },
  {
    id: "Areas Related to Circles",
    displayName: "Areas Related to Circles",
    unit: "UNIT VI: MENSURATION",
    unitMarks: 10, 
    angleRestrictions: "Problems restricted to 60°, 90°, and 120° angles.",
    syllabusNotes: [
        "CBSE Syllabus: 1 exercise (Exercise 11.1) focusing on sector and segment area calculations",
        "State Boards: 2 exercises (11.1 and 11.2) with extended coverage"
    ],
    exercises: [
      {
        exerciseName: "Exercise 11.1 (CBSE & State Boards) - Sector and Segment Areas",
        topics: [
          "Sector Area Calculations: Central angle applications (60°, 90°, 120°)",
          "Arc length computations: Using l = rθ (radians) or l = (πrθ)/180°",
          "Sector area formulas: Area = (1/2)r²θ (radians) or (πr²θ)/360° (degrees)",
          "Segment Area Problems: Combined figure calculations (sectors minus triangles)",
          "Real-world applications: Fan-shaped regions, pizza slices, architectural designs",
          "Composite shape analysis: Problems combining multiple circular regions"
        ]
      },
      {
        exerciseName: "Exercise 11.2 (State Boards)",
        description: "Extended coverage for state boards."
      }
    ],
    includedTopics: [
        "Area of sectors and segments of a circle",
        "Perimeter/Circumference related problems",
        "Problems based on areas and perimeter / circumference of the above said plane figures. (In calculating area of segment of a circle, problems should be restricted to central angle of 60°, 90° and 120° only)"
    ],
    deletedTopics: [ ]
  },
  {
    id: "Surface Areas and Volumes",
    displayName: "Surface Areas and Volumes",
    unit: "UNIT VI: MENSURATION",
    removedContentNotes: "Frustum of cone calculations have been completely removed from the CBSE syllabus, though some state boards may still include this topic.",
    exercises: [
      {
        exerciseName: "Exercise 12.1 - Combined Solids Surface Area",
        questionDistribution: "9 questions (7 long, 2 short)",
        topics: [
          "Cube and hemisphere combinations: Calculating total surface area of composite objects",
          "Cylinder and cone combinations: Finding surface areas of joined geometric shapes",
          "Real-world object calculations: Surface area of everyday items like ice cream cones, decorative items"
        ]
      },
      {
        exerciseName: "Exercise 12.2 - Volume Applications",
        questionDistribution: "8 questions (7 long, 1 short)",
        description: "Volume combinations.",
        topics: [
          "Multi-solid volume calculations: Finding volumes of combined geometric shapes",
          "Material requirement problems: Calculating amounts needed for construction projects",
          "Capacity and storage questions: Tank volumes, container calculations"
        ]
      },
      {
        exerciseName: "Exercise 12.3 - Advanced Applications",
        questionDistribution: "9 questions (9 long)",
      },
      {
        exerciseName: "Exercise 12.4 - Shape Conversions",
        questionDistribution: "5 questions (5 long)",
        topics: ["Shape conversion problems: Converting one solid form to another while preserving volume"]
      },
      {
        exerciseName: "Exercise 12.5 - Complex Constructions",
        questionDistribution: "7 questions (7 long)",
        topics: [
            "Complex geometric constructions: Multi-step problems involving several solids",
            "Engineering applications: Real-world scenarios in construction and manufacturing"
            ]
      }
    ],
    includedTopics: [
        "Surface areas and volumes of combinations of any two of the following: cubes, cuboids, spheres, hemispheres and right circular cylinders/cones.",
        "Basic 3D Shapes formulas",
        "Mathematical Visualization for formulae"
    ],
    deletedTopics: [
        "Frustum of Cone (for CBSE)",
        "Problems involving converting one type of metallic solid into another (This contradicts Ex 12.4 description, assuming 'metallic conversion' is a specific type of complex problem beyond simple volume-preserving shape conversion, or Ex 12.4 is for state boards only. For CBSE, will emphasize basic combinations).",
        "Problems with more than two different solids combined (for CBSE)"
    ]
  },
  {
    id: "Statistics",
    displayName: "Statistics",
    unit: "UNIT VII: STATISTICS AND PROBABILITY",
    unitMarks: 11, 
    removedContentNotes: "Step deviation method for finding mean and cumulative frequency graphs (ogives) have been removed from the CBSE syllabus.",
    exercises: [
      {
        exerciseName: "Exercise 13.1 - Mean Calculations",
        description: "Grouped data mean calculations (direct method only).",
        topics: [
          "Direct method applications: Using mean = Σfixi/Σfi for grouped data",
          "Class interval problems: Working with continuous and discrete data",
          "Real-life data interpretation: Analyzing survey results and statistical information"
        ]
      },
      {
        exerciseName: "Exercise 13.2 - Mode Determination",
        description: "Mode determination for frequency distributions."
      },
      {
        exerciseName: "Exercise 13.3 - Median Calculations",
        description: "Median calculations for grouped data."
      },
      {
        exerciseName: "Exercise 13.4 - Frequency Analysis Applications",
        description: "Frequency analysis applications."
      }
    ],
    includedTopics: [
        "Mean, median, and mode of grouped data (bimodal situation to be avoided)",
        "Mean by Direct Method only",
        "Real-life contexts and data interpretation"
    ],
    deletedTopics: [
        "Step Deviation method for finding mean",
        "Cumulative Frequency graphs (ogives)",
        "Bimodal situations in problems (for CBSE)"
    ]
  },
  {
    id: "Probability",
    displayName: "Probability",
    unit: "UNIT VII: STATISTICS AND PROBABILITY",
    assessmentFocus: [
        "Elementary Events and Complementary Events",
        "Complementary probability: Understanding P(E) + P(E') = 1 relationships",
        "Impossible and certain events: Recognizing probability values of 0 and 1",
        "Equally likely outcomes: Problems assuming fair conditions in experiments"
    ],
    exercises: [
      {
        exerciseName: "Exercise 14.1 - Basic Probability Applications",
        description: "Focusing on theoretical probability concepts.",
        topics: [
          "Theoretical approach problems: Using P(E) = Number of favorable outcomes/Total number of outcomes",
          "Event probability calculations: Finding probabilities of simple and compound events",
          "Sample space determination: Identifying all possible outcomes in given scenarios",
          "Real-life probability scenarios: Games, weather predictions, and everyday probability situations"
        ]
      }
    ],
    includedTopics: [
        "Classical (theoretical) definition of probability",
        "Simple problems on finding the probability of an event",
        "P(E) = Number of favorable outcomes / Total number of outcomes"
    ],
    deletedTopics: [ ]
  }
];

export const CBSE_MATH_10_CHAPTERS: string[] = CBSE_MATH_SYLLABUS_DETAILED.map(
  (chapter) => chapter.displayName
);
