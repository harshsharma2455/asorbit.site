import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'pulse' | 'dots' | 'bars';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text, 
  size = 'medium', 
  variant = 'default' 
}) => {
  let scale = 1;
  let textSize = 'text-base';
  
  if (size === 'small') {
    scale = 0.35;
    textSize = 'text-xs';
  }
  if (size === 'large') {
    scale = 0.8;
    textSize = 'text-lg';
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 bg-primary-500 rounded-full animate-pulse"
                style={{ 
                  height: `${12 + (i % 2) * 8}px`,
                  animationDelay: `${i * 0.15}s` 
                }}
              ></div>
            ))}
          </div>
        );
      
      default:
        return (
          <div 
            className="loading-logo" 
            style={size !== 'medium' ? { 
              transform: `scale(${scale})`, 
              width: `${120*scale}px`, 
              height: `${120*scale}px` 
            } : {}}
          >
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        );
    }
  };

  return (
    <div className="loading-logo-container animate-fade-in">
      {renderSpinner()}
      {text && (
        <p className={`mt-3 text-center ${textSize} font-medium text-primary-600 animate-fade-in-up`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;