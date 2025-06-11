
import React, { useState } from 'react';
import { PlusCircleIcon } from '../../config';

interface AddQuestionFormProps {
  onAddQuestion: (questionText: string) => void;
}

export const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ onAddQuestion }) => {
  const [questionText, setQuestionText] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!questionText.trim()) {
      setError('Question text cannot be empty.');
      return;
    }
    setError('');
    onAddQuestion(questionText);
    setQuestionText(''); // Clear input after adding
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 bg-white shadow-xl rounded-lg border border-slate-200">
      <label htmlFor="new-question" className="block text-lg font-semibold mb-3 text-primary-700">
        Add New Question to Paper:
      </label>
      <textarea
        id="new-question"
        value={questionText}
        onChange={(e) => {
          setQuestionText(e.target.value);
          if (error) setError('');
        }}
        placeholder="Enter your question text here..."
        rows={3}
        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors placeholder-slate-400 text-slate-700"
        aria-describedby={error ? "question-error" : undefined}
      />
      {error && <p id="question-error" className="text-sm text-red-600 mt-1">{error}</p>}
      <button
        type="submit"
        disabled={!questionText.trim()}
        className="mt-4 w-full px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-accent-500 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {PlusCircleIcon}
        <span>Add Question</span>
      </button>
    </form>
  );
};
