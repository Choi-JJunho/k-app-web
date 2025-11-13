import { describe, it, expect } from 'vitest';
import {
  required,
  minLength,
  maxLength,
  email,
  pattern,
  validateForm
} from './validation';

describe('validation', () => {
  describe('required', () => {
    it('should return error for empty string', () => {
      const result = required()('');
      expect(result).toEqual({ message: '필수 입력 항목입니다.', type: 'required' });
    });

    it('should return error for null', () => {
      const result = required()(null);
      expect(result).toEqual({ message: '필수 입력 항목입니다.', type: 'required' });
    });

    it('should return error for undefined', () => {
      const result = required()(undefined);
      expect(result).toEqual({ message: '필수 입력 항목입니다.', type: 'required' });
    });

    it('should return null for valid value', () => {
      const result = required()('valid');
      expect(result).toBeNull();
    });

    it('should use custom message', () => {
      const result = required('이 필드는 필수입니다')('');
      expect(result?.message).toBe('이 필드는 필수입니다');
    });
  });

  describe('minLength', () => {
    it('should return error for string shorter than minimum', () => {
      const result = minLength(5)('abc');
      expect(result).toEqual({
        message: '최소 5자 이상 입력해주세요.',
        type: 'minLength'
      });
    });

    it('should return null for string meeting minimum', () => {
      const result = minLength(5)('abcde');
      expect(result).toBeNull();
    });

    it('should return null for string longer than minimum', () => {
      const result = minLength(5)('abcdef');
      expect(result).toBeNull();
    });
  });

  describe('maxLength', () => {
    it('should return error for string longer than maximum', () => {
      const result = maxLength(5)('abcdef');
      expect(result).toEqual({
        message: '최대 5자까지 입력 가능합니다.',
        type: 'maxLength'
      });
    });

    it('should return null for string at maximum', () => {
      const result = maxLength(5)('abcde');
      expect(result).toBeNull();
    });

    it('should return null for string shorter than maximum', () => {
      const result = maxLength(5)('abc');
      expect(result).toBeNull();
    });
  });

  describe('email', () => {
    it('should return error for invalid email', () => {
      const result = email()('invalid');
      expect(result).toEqual({
        message: '올바른 이메일 형식을 입력해주세요.',
        type: 'pattern'
      });
    });

    it('should return null for valid email', () => {
      const result = email()('test@example.com');
      expect(result).toBeNull();
    });

    it('should return null for email with subdomain', () => {
      const result = email()('test@mail.example.com');
      expect(result).toBeNull();
    });
  });

  describe('pattern', () => {
    it('should return error for non-matching pattern', () => {
      const result = pattern(/^\d+$/, '숫자만 입력 가능합니다')('abc');
      expect(result).toEqual({
        message: '숫자만 입력 가능합니다',
        type: 'pattern'
      });
    });

    it('should return null for matching pattern', () => {
      const result = pattern(/^\d+$/, '숫자만 입력 가능합니다')('123');
      expect(result).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('should validate all fields correctly', () => {
      const rules = {
        name: required('이름은 필수입니다'),
        email: email(),
        age: minLength(1),
      };

      const values = {
        name: '',
        email: 'invalid',
        age: '25',
      };

      const result = validateForm(values, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toEqual({ message: '이름은 필수입니다', type: 'required' });
      expect(result.errors.email).toEqual({ message: '올바른 이메일 형식을 입력해주세요.', type: 'pattern' });
      expect(result.errors.age).toBeUndefined();
    });

    it('should return empty errors for valid values', () => {
      const rules = {
        name: required(),
        email: email(),
      };

      const values = {
        name: 'John',
        email: 'john@example.com',
      };

      const result = validateForm(values, rules);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});
