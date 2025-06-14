import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large'; // medium is default (120x120px logo)
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text, size = 'medium' }) => {
  let scale = 1;
  if (size === 'small') scale = 0.35; // Approx 42x42 for small contexts like diagram item
  if (size === 'large') scale = 0.8;  // Approx 96x96 for full page loaders

  return (
    <div className="loading-logo-container">
      <div 
        className="loading-logo" 
        style={size !== 'medium' ? { transform: `scale(${scale})`} : {}}
      >
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
      {text && (
        <p className={`mt-3 text-center ${size === 'small' ? 'text-xs' : 'text-base'} font-medium text-primary-600`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
