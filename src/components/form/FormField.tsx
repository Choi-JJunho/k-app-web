import React from 'react';
import type { BaseComponentProps } from '@/types';

interface FormFieldProps extends BaseComponentProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  description?: string;
}

export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  description,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      {children}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hasError?: boolean;
}

export function Input({
  error,
  hasError,
  className = '',
  ...props
}: InputProps) {
  const baseClasses = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors';
  const normalClasses = 'border-gray-200 focus:ring-orange-500 focus:border-orange-500';
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50';
  
  const inputClasses = `${baseClasses} ${hasError || error ? errorClasses : normalClasses} ${className}`;

  return <input {...props} className={inputClasses} />;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  hasError?: boolean;
}

export function TextArea({
  error,
  hasError,
  className = '',
  ...props
}: TextAreaProps) {
  const baseClasses = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors resize-vertical';
  const normalClasses = 'border-gray-200 focus:ring-orange-500 focus:border-orange-500';
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50';
  
  const textareaClasses = `${baseClasses} ${hasError || error ? errorClasses : normalClasses} ${className}`;

  return <textarea {...props} className={textareaClasses} />;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  hasError?: boolean;
  placeholder?: string;
}

export function Select({
  error,
  hasError,
  placeholder,
  children,
  className = '',
  ...props
}: SelectProps) {
  const baseClasses = 'w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors bg-white';
  const normalClasses = 'border-gray-200 focus:ring-orange-500 focus:border-orange-500';
  const errorClasses = 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50';
  
  const selectClasses = `${baseClasses} ${hasError || error ? errorClasses : normalClasses} ${className}`;

  return (
    <select {...props} className={selectClasses}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export function Checkbox({
  label,
  error,
  className = '',
  ...props
}: CheckboxProps) {
  const id = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-3">
        <input
          {...props}
          type="checkbox"
          id={id}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
        />
        <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
          {label}
        </label>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1 ml-7">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}