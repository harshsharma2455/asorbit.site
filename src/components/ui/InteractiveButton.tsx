import React, { ReactNode } from 'react';

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = "interactive-button button-glow relative overflow-hidden font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-slate-500 to-slate-600 text-white hover:from-slate-600 hover:to-slate-700 focus:ring-slate-500 shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-white hover:shadow-lg",
    ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500 hover:shadow-md"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span>{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span>{icon}</span>}
          </>
        )}
      </span>
    </button>
  );
};

export default InteractiveButton;