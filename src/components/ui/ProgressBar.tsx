import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'gradient' | 'animated';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  className = ''
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const getBarClasses = () => {
    const baseClasses = "transition-all duration-500 ease-out rounded-full";
    
    switch (variant) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-primary-500 via-accent-500 to-success-500`;
      case 'animated':
        return `${baseClasses} progress-bar`;
      default:
        return `${baseClasses} bg-primary-500`;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-medium text-slate-500">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={getBarClasses()}
          style={{ width: `${clampedProgress}%` }}
        >
          {variant === 'animated' && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;