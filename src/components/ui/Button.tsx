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
    primary: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 focus:ring-zinc-500',
    secondary: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 focus:ring-zinc-500 border border-zinc-200 dark:border-zinc-700',
    outline: 'border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-zinc-50 dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 focus:ring-zinc-500',
    ghost: 'text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800 focus:ring-zinc-500 rounded-none',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs rounded-none',
    sm: 'px-3 py-2 text-sm rounded-none',
    md: 'px-4 py-2.5 text-sm rounded-none',
    lg: 'px-6 py-3 text-base rounded-none',
    xl: 'px-8 py-4 text-lg rounded-none',
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