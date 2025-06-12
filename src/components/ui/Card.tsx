import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'neumorphism';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  animated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
  animated = true
}) => {
  const baseClasses = "rounded-2xl transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white border border-slate-200 shadow-lg",
    elevated: "bg-white shadow-2xl border border-slate-100",
    glass: "glass-effect backdrop-blur-md border border-white/20",
    neumorphism: "neumorphism"
  };
  
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };
  
  const interactiveClasses = hoverable || onClick ? 
    "interactive-card cursor-pointer hover:shadow-2xl hover:-translate-y-2" : "";
  
  const animationClasses = animated ? "animate-fade-in-up" : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${animationClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;