import type { FormFieldError } from '@/types';

export type ValidationRule<T = unknown> = (value: T) => FormFieldError | null;

export const createValidationRule = <T>(
  type: FormFieldError['type'],
  condition: (value: T) => boolean,
  message: string
): ValidationRule<T> => {
  return (value: T) => {
    return condition(value) ? null : { type, message };
  };
};

// 기본 검증 규칙들
export const required = <T>(message = '필수 입력 항목입니다.'): ValidationRule<T> =>
  createValidationRule(
    'required',
    (value: T) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message
  );

export const minLength = (min: number, message?: string): ValidationRule<string> =>
  createValidationRule(
    'minLength',
    (value: string) => !value || value.length >= min,
    message || `최소 ${min}자 이상 입력해주세요.`
  );

export const maxLength = (max: number, message?: string): ValidationRule<string> =>
  createValidationRule(
    'maxLength',
    (value: string) => !value || value.length <= max,
    message || `최대 ${max}자까지 입력 가능합니다.`
  );

export const pattern = (regex: RegExp, message: string): ValidationRule<string> =>
  createValidationRule(
    'pattern',
    (value: string) => !value || regex.test(value),
    message
  );

export const email = (message = '올바른 이메일 형식을 입력해주세요.'): ValidationRule<string> =>
  pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, message);

export const koreatech = (message = '한국기술교육대학교 이메일만 사용 가능합니다.'): ValidationRule<string> =>
  pattern(/^[a-zA-Z0-9._%+-]+@koreatech\.ac\.kr$/, message);

export const studentId = (message = '올바른 학번을 입력해주세요.'): ValidationRule<string> =>
  pattern(/^\d{4}\d{6}$/, message);

export const password = (message = '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.'): ValidationRule<string> =>
  pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message);

export const phoneNumber = (message = '올바른 전화번호를 입력해주세요.'): ValidationRule<string> =>
  pattern(/^01[016789]-?\d{3,4}-?\d{4}$/, message);

export const date = (message = '올바른 날짜를 입력해주세요.'): ValidationRule<string> =>
  createValidationRule(
    'pattern',
    (value: string) => {
      if (!value) return true;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    message
  );

// 복합 검증 함수
export const compose = <T>(...rules: ValidationRule<T>[]): ValidationRule<T> => {
  return (value: T) => {
    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };
};

// 조건부 검증
export const when = <T>(
  condition: (value: T) => boolean,
  rule: ValidationRule<T>
): ValidationRule<T> => {
  return (value: T) => {
    return condition(value) ? rule(value) : null;
  };
};

// 폼 검증 유틸리티
export const validateForm = <T extends Record<string, any>>(
  values: T,
  rules: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>
): { isValid: boolean; errors: Partial<Record<keyof T, FormFieldError>> } => {
  const errors: Partial<Record<keyof T, FormFieldError>> = {};
  let isValid = true;

  for (const [field, rule] of Object.entries(rules) as [keyof T, ValidationRule<T[keyof T]>][]) {
    if (rule) {
      const error = rule(values[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

// 실시간 검증을 위한 debounce된 검증
export const createDebouncedValidator = <T>(
  rule: ValidationRule<T>,
  delay = 300
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (value: T, callback: (error: FormFieldError | null) => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      const error = rule(value);
      callback(error);
    }, delay);
  };
};

// 비동기 검증 (예: 중복 확인)
export const createAsyncValidator = <T>(
  asyncCheck: (value: T) => Promise<boolean>,
  message: string
) => {
  return async (value: T): Promise<FormFieldError | null> => {
    try {
      const isValid = await asyncCheck(value);
      return isValid ? null : { type: 'custom', message };
    } catch {
      return { type: 'custom', message: '검증 중 오류가 발생했습니다.' };
    }
  };
};