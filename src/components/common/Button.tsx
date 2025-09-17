import React from 'react';
import type { BaseComponentProps } from '@/types';

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses = {
  primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 disabled:bg-orange-300',
  secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 disabled:bg-gray-300',
  outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50 focus:ring-orange-500 disabled:border-orange-300 disabled:text-orange-300',
  ghost: 'text-orange-500 hover:bg-orange-50 focus:ring-orange-500 disabled:text-orange-300',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300',
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-6 py-4 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  onClick,
  testId,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClasses = [
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'transition-all duration-200',
    'disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={onClick}
      data-testid={testId}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          {children}
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// 특화된 버튼 컴포넌트들
export function SubmitButton({
  children = '제출',
  loading,
  ...props
}: Omit<ButtonProps, 'type'>) {
  return (
    <Button type="submit" loading={loading} {...props}>
      {children}
    </Button>
  );
}

export function CancelButton({
  children = '취소',
  ...props
}: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="outline" {...props}>
      {children}
    </Button>
  );
}

export function DeleteButton({
  children = '삭제',
  ...props
}: Omit<ButtonProps, 'variant'>) {
  return (
    <Button variant="danger" {...props}>
      {children}
    </Button>
  );
}

export function IconButton({
  children,
  size = 'md',
  ...props
}: ButtonProps) {
  const iconSizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  return (
    <Button
      {...props}
      size={size}
      className={`${iconSizeClasses[size]} ${props.className || ''}`}
    >
      {children}
    </Button>
  );
}