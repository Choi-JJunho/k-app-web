import { useState, useCallback, useRef, useEffect } from 'react';
import { validateForm } from '@/utils/validation';
import type { FormState, FormFieldError } from '@/types';

type ValidationRule<T> = (value: T) => FormFieldError | null;
type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<T[keyof T]>>>;

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit?: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, FormFieldError>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRulesRef = useRef(validationRules);
  validationRulesRef.current = validationRules;

  const validateField = useCallback((name: keyof T, value: T[keyof T]) => {
    const rule = validationRulesRef.current[name];
    return rule ? rule(value) : null;
  }, []);

  const validateAllFields = useCallback(() => {
    const result = validateForm(values, validationRulesRef.current);
    setErrors(result.errors);
    return result;
  }, [values]);

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    } else {
      // 이미 에러가 있는 필드는 실시간으로 검증
      if (errors[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  }, [validateOnChange, validateField, errors]);

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
    
    if (validateOnBlur && isTouched) {
      const error = validateField(name, values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateOnBlur, validateField, values]);

  const handleInputChange = useCallback(
    (name: keyof T) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, type } = event.target;
      const inputValue = type === 'checkbox' 
        ? (event.target as HTMLInputElement).checked as T[keyof T]
        : value as T[keyof T];
      
      setValue(name, inputValue);
    },
    [setValue]
  );

  const handleInputBlur = useCallback(
    (name: keyof T) => () => {
      setFieldTouched(name, true);
    },
    [setFieldTouched]
  );

  const resetForm = useCallback((newValues?: Partial<T>) => {
    const resetValues = newValues ? { ...initialValues, ...newValues } : initialValues;
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    (event?: React.FormEvent) => {
      event?.preventDefault();
      
      const validationResult = validateAllFields();
      
      if (!validationResult.isValid) {
        // 모든 필드를 touched로 표시하여 에러 표시
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        );
        setTouched(allTouched);
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          const result = onSubmit(values);
          if (result instanceof Promise) {
            result.finally(() => setIsSubmitting(false));
          } else {
            setIsSubmitting(false);
          }
        } catch (error) {
          setIsSubmitting(false);
          throw error;
        }
      }
    },
    [validateAllFields, values, onSubmit]
  );

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      name: String(name),
      value: values[name] ?? '',
      onChange: handleInputChange(name),
      onBlur: handleInputBlur(name),
      error: touched[name] ? errors[name]?.message : undefined,
      hasError: touched[name] && !!errors[name],
    }),
    [values, touched, errors, handleInputChange, handleInputBlur]
  );

  const setFieldError = useCallback((name: keyof T, error: FormFieldError | null) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const clearFieldError = useCallback((name: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const isValid = Object.keys(errors).length === 0 || 
    Object.values(errors).every(error => error === null);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  const formState: FormState<T> = {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
  };

  return {
    // Form state
    ...formState,
    isDirty,
    
    // Field methods
    setValue,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    getFieldProps,
    
    // Form methods
    handleSubmit,
    validateField,
    validateAllFields,
    resetForm,
    
    // Event handlers
    handleInputChange,
    handleInputBlur,
  };
}

// 특정 필드에 대한 개별 훅
export function useFormField<T>(
  initialValue: T,
  validationRule?: ValidationRule<T>
) {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<FormFieldError | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback(() => {
    if (validationRule) {
      const validationError = validationRule(value);
      setError(validationError);
      return !validationError;
    }
    return true;
  }, [value, validationRule]);

  const handleChange = useCallback((newValue: T) => {
    setValue(newValue);
    if (touched && validationRule) {
      const validationError = validationRule(newValue);
      setError(validationError);
    }
  }, [touched, validationRule]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validationRule) {
      const validationError = validationRule(value);
      setError(validationError);
    }
  }, [value, validationRule]);

  const reset = useCallback((newValue?: T) => {
    setValue(newValue ?? initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    isValid: !error,
    isDirty: value !== initialValue,
    setValue: handleChange,
    setTouched: () => setTouched(true),
    setError,
    handleBlur,
    validate,
    reset,
  };
}