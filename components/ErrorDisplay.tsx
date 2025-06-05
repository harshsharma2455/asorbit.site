
import React from 'react';

interface ErrorDisplayProps {
  message: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md relative mb-6 shadow" role="alert">
      <strong className="font-semibold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorDisplay;
