import React from 'react';
import type { QuestionTypeConfig }  from '../types';

export const API_KEY_ERROR_MESSAGE = "API key not configured. Please set the process.env.API_KEY environment variable.";
export const GEMINI_MODEL_TEXT = "gemini-2.5-flash";

export const InfoIcon: React.ReactElement<React.SVGProps<SVGSVGElement>> = React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5 text-primary-500 shrink-0",
  },
  React.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z",
    clipRule: "evenodd",
  })
);

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => 
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className: className || "w-10 h-10 text-primary-500",
    },
    React.createElement("path", {
      d: "M11.25 3.765c.666-1.233 2.334-1.233 3 0l7.094 13.131a1.5 1.5 0 0 1-1.299 2.354H2.455a1.5 1.5 0 0 1-1.3-2.354L11.25 3.765ZM12 11.25a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75Zm.002 6a.752.752 0 1 0 0-1.504.752.752 0 0 0 0 1.504Z",
    }),
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M12 1.5c-5.74 0-10.742 4.045-11.886 9.608A.75.75 0 0 0 .817 12h5.433c.193.385.424.745.683 1.077l-4.07 4.07a.75.75 0 0 0 1.06 1.06l4.07-4.07c.332.26.692.49 1.077.683v5.433a.75.75 0 0 0 1.092.703A11.962 11.962 0 0 0 12 22.5c5.74 0 10.742-4.045 11.886-9.608A.75.75 0 0 0 23.183 12h-5.433a6.723 6.723 0 0 1-1.76-1.759l4.07-4.07a.75.75 0 0 0-1.06-1.06l-4.07 4.07A6.723 6.723 0 0 1 13.25 7.433V1.999a.75.75 0 0 0-.703-.699A11.962 11.962 0 0 0 12 1.5Zm0 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z",
      clipRule: "evenodd",
    })
  );

export const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: className || "w-5 h-5",
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M4.25 5.5A.75.75 0 0 0 3.5 6.25v8.5A.75.75 0 0 0 4.25 15h8.5A.75.75 0 0 0 13.5 14.25v-8.5A.75.75 0 0 0 12.75 5.5h-8.5Zm0 9h8.5V6.25h-8.5v8.25ZM6.5 8a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4ZM6.5 11a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5h-1Z",
      clipRule: "evenodd",
    })
  );

export const ShapesIcon: React.FC = () =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
    },
    React.createElement("path", {
      d: "M7 3.5A1.5 1.5 0 0 1 8.5 2h3A1.5 1.5 0 0 1 13 3.5v3A1.5 1.5 0 0 1 11.5 8h-3A1.5 1.5 0 0 1 7 6.5v-3Zm7.5 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
    }),
    React.createElement("path", {
      d: "M3 8.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 9 8.5v3A1.5 1.5 0 0 1 7.5 13h-3A1.5 1.5 0 0 1 3 11.5v-3Z",
    }),
    React.createElement("path", {
      d: "M11.5 11a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
    })
  );

export const PlusCircleIcon: React.ReactNode = React.createElement(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
  },
  React.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z",
    clipRule: "evenodd",
  })
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: className || "w-5 h-5",
    },
    React.createElement("path", {
      d: "M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z",
    })
  );

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 16 16", 
      fill: "currentColor",
      className: className || "w-4 h-4", 
    },
    React.createElement("path", {
      d: "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z",
    }),
    React.createElement("path", {
      d: "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z",
    })
  );

export const SparklesIcon: React.FC = () =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.252.986 4.873 3.948 2.544 2.583 3.949.039.006c.322.772 1.416.772 1.737 0l2.583-3.949 3.948-2.544.986-4.873-3.423-3.252-4.753-.39-1.83-4.401Zm-3.143 5.435.608 1.463a.75.75 0 0 1-.264.912l-1.328.855-.328 1.625 1.28.825a.75.75 0 0 1 .374.879l-.352 1.515 1.487.957a.75.75 0 0 1 .183.987l-.683 1.408 1.02-.49a.75.75 0 0 1 .91.265l.854 1.328.854-1.328a.75.75 0 0 1 .91-.265l1.02.49-.683-1.408a.75.75 0 0 1 .183-.987l1.487-.957-.352-1.515a.75.75 0 0 1 .374-.879l1.28-.825-.328-1.625-1.328-.855a.75.75 0 0 1-.264-.912l.608-1.463-1.583-.13-1.127 1.077a.75.75 0 0 1-1.036 0L8.308 8.19l-1.583.13Z",
      clipRule: "evenodd",
    })
  );

export const CogIcon: React.FC = () =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.835 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 0 1 2.287-.947c1.372.835 2.942-.734 2.106-2.106a1.533 1.533 0 0 1 .947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.835-1.372-.734-2.942-2.106-2.106A1.532 1.532 0 0 1 11.49 3.17ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
      clipRule: "evenodd",
    })
  );

export const BookOpenIcon: React.FC = () =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: "w-5 h-5",
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 8.75A.75.75 0 0 1 2.75 8h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8.75ZM2 12.75a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z",
      clipRule: "evenodd",
    })
  );

export const RedoIcon: React.FC<{ className?: string }> = ({ className }) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      className: className || "w-4 h-4", // Default 16x16
      viewBox: "0 0 16 16"
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
    }),
    React.createElement("path", {
      d: "M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"
    })
  );

export const RefreshIcon: React.FC<{ className?: string }> = RedoIcon;


export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      className: className || "w-5 h-5",
    },
    React.createElement("path", {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z",
      clipRule: "evenodd",
    })
  );

export const FileEarmarkPlusFillIcon: React.FC<{ className?: string }> = ({ className }) =>
  React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      className: className || "w-5 h-5", // Default to w-5 h-5 for consistency with other button icons
      viewBox: "0 0 16 16"
    },
    React.createElement("path", {
      d: "M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M8.5 7v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 1 0"
    })
  );


export const SUPPORTED_SUBJECTS = [
  { id: 'maths', name: 'Mathematics' },
  // { id: 'science', name: 'Science' }, // Removed Science for now
];

export const SUPPORTED_GRADES = [
  { id: '10cbse', name: '10th Grade CBSE' },
  // { id: '12cbse', name: '12th Grade CBSE' }, // Future
];

export const QUESTION_CONFIG_SECTIONS: QuestionTypeConfig[] = [
  { id: 'MCQ', label: 'Multiple Choice Questions (MCQs)', marks: 1 },
  { id: 'ShortAnswer2', label: 'Short Answer Questions (2 Marks)', marks: 2 },
  { id: 'ShortAnswer3', label: 'Short Answer Questions (3 Marks)', marks: 3 },
  { id: 'LongAnswer5', label: 'Long Answer Questions (5 Marks)', marks: 5 },
  { id: 'CaseStudy', label: 'Case Study Based Questions (4-5 Marks)', marks: 4 }, // Marks can vary
];
