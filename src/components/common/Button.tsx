import React, { ButtonHTMLAttributes } from 'react';
import { classNames } from '../../utils/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success' | 'warning' | 'info';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary hover:bg-blue-700 text-white',
    secondary: 'bg-secondary hover:bg-slate-600 text-white',
    success: 'bg-success hover:bg-emerald-600 text-white',
    danger: 'bg-danger hover:bg-red-600 text-white',
    warning: 'bg-warning hover:bg-amber-600 text-white',
    info: 'bg-info hover:bg-blue-600 text-white',
  };

  const sizeClasses = {
    xs: 'text-xs px-2 py-1 rounded',
    sm: 'text-sm px-3 py-1.5 rounded md:py-1.5 md:text-sm',
    md: 'text-base px-4 py-2.5 rounded-md md:text-sm md:py-2',
    lg: 'text-lg px-6 py-3.5 rounded-lg md:py-3 md:text-base',
  };

  const widthClass = fullWidth ? 'w-full justify-center' : '';

  return (
    <button
      className={classNames(
        'inline-flex items-center font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        variantClasses[variant],
        sizeClasses[size],
        widthClass,
        isLoading ? 'opacity-75 cursor-not-allowed' : '',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button; 