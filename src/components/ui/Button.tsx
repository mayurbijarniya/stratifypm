import React from 'react';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  className,
  type = 'button',
  fullWidth = false,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm hover:shadow-md focus:ring-secondary border border-border',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md focus:ring-primary',
    ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground focus:ring-accent rounded-xl',
    danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg focus:ring-destructive',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg focus:ring-green-500',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded-lg',
    sm: 'px-3 py-2 text-sm rounded-xl',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <button
      type={ type }
      className={ clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        'focus:ring-offset-white dark:focus:ring-offset-gray-900',
        className
      ) }
      disabled={ disabled || loading }
      onClick={ onClick }
    >

      { loading ? (
        <div className="flex items-center">
          <div className={ clsx("animate-spin rounded-full border-2 border-current border-t-transparent", iconSizes[size]) } />
          { children && <span className="ml-2">{ children }</span> }
        </div>
      ) : (
        <>
          { Icon && iconPosition === 'left' && children && (
            <Icon className={ clsx(iconSizes[size], "mr-2") } />
          ) }
          { Icon && !children && (
            <Icon className={ iconSizes[size] } />
          ) }
          { children }
          { Icon && iconPosition === 'right' && children && (
            <Icon className={ clsx(iconSizes[size], "ml-2") } />
          ) }
        </>
      ) }
    </button>
  );
};