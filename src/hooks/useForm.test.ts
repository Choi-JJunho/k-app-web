import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm, useFormField } from './useForm';
import { required, email, minLength } from '@/utils/validation';

describe('useForm', () => {
  it('should initialize with initial values', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm({ initialValues }));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it('should update field value', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm({ initialValues }));

    act(() => {
      result.current.setValue('name', 'John');
    });

    expect(result.current.values.name).toBe('John');
    expect(result.current.isDirty).toBe(true);
  });

  it('should validate on blur when validateOnBlur is true', () => {
    const initialValues = { email: '' };
    const validationRules = {
      email: email(),
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        validateOnBlur: true,
      })
    );

    act(() => {
      result.current.setValue('email', 'invalid');
    });

    act(() => {
      result.current.setFieldTouched('email', true);
    });

    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.errors.email?.message).toContain('이메일');
  });

  it('should validate on change when validateOnChange is true', () => {
    const initialValues = { email: '' };
    const validationRules = {
      email: email(),
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        validateOnChange: true,
      })
    );

    act(() => {
      result.current.setValue('email', 'invalid');
    });

    expect(result.current.errors.email).toBeTruthy();
  });

  it('should validate all fields', () => {
    const initialValues = { name: '', email: '', password: '' };
    const validationRules = {
      name: required('이름 필수'),
      email: email(),
      password: minLength(8),
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
      })
    );

    let validationResult: any;
    act(() => {
      validationResult = result.current.validateAllFields();
    });

    expect(validationResult.isValid).toBe(false);
    // At least name field should have error
    expect(result.current.errors.name).toBeTruthy();
  });

  it('should handle form submission with valid data', async () => {
    const onSubmit = vi.fn();
    const initialValues = { name: 'John', email: 'john@example.com' };
    const validationRules = {
      name: required(),
      email: email(),
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit,
      })
    );

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(onSubmit).toHaveBeenCalledWith(initialValues);
  });

  it('should not submit form with invalid data', () => {
    const onSubmit = vi.fn();
    const initialValues = { email: 'invalid' };
    const validationRules = {
      email: email(),
    };

    const { result } = renderHook(() =>
      useForm({
        initialValues,
        validationRules,
        onSubmit,
      })
    );

    act(() => {
      result.current.handleSubmit();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.touched.email).toBe(true);
  });

  it('should reset form', () => {
    const initialValues = { name: '', email: '' };
    const { result } = renderHook(() => useForm({ initialValues }));

    act(() => {
      result.current.setValue('name', 'John');
      result.current.setValue('email', 'john@example.com');
      result.current.setFieldTouched('name', true);
    });

    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.touched).toEqual({});
  });

  it('should get field props', () => {
    const initialValues = { name: 'John' };
    const { result } = renderHook(() => useForm({ initialValues }));

    const fieldProps = result.current.getFieldProps('name');

    expect(fieldProps.name).toBe('name');
    expect(fieldProps.value).toBe('John');
    expect(fieldProps.onChange).toBeInstanceOf(Function);
    expect(fieldProps.onBlur).toBeInstanceOf(Function);
  });

  it('should handle input change event', () => {
    const initialValues = { name: '' };
    const { result } = renderHook(() => useForm({ initialValues }));

    const event = {
      target: { value: 'John', type: 'text' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange('name')(event);
    });

    expect(result.current.values.name).toBe('John');
  });

  it('should set field error', () => {
    const initialValues = { name: '' };
    const { result } = renderHook(() => useForm({ initialValues }));

    act(() => {
      result.current.setFieldError('name', {
        type: 'custom',
        message: 'Custom error',
      });
    });

    expect(result.current.errors.name?.message).toBe('Custom error');
  });

  it('should clear field error', () => {
    const initialValues = { name: '' };
    const validationRules = {
      name: required(),
    };
    const { result } = renderHook(() =>
      useForm({ initialValues, validationRules })
    );

    act(() => {
      result.current.validateAllFields();
    });

    expect(result.current.errors.name).toBeTruthy();

    act(() => {
      result.current.clearFieldError('name');
    });

    expect(result.current.errors.name).toBeUndefined();
  });
});

describe('useFormField', () => {
  it('should initialize with initial value', () => {
    const { result } = renderHook(() => useFormField(''));

    expect(result.current.value).toBe('');
    expect(result.current.isValid).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it('should update value', () => {
    const { result } = renderHook(() => useFormField(''));

    act(() => {
      result.current.setValue('test');
    });

    expect(result.current.value).toBe('test');
    expect(result.current.isDirty).toBe(true);
  });

  it('should validate on blur', () => {
    const { result } = renderHook(() => useFormField('', required()));

    act(() => {
      result.current.handleBlur();
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.isValid).toBe(false);
    expect(result.current.touched).toBe(true);
  });

  it('should validate manually', () => {
    const { result } = renderHook(() => useFormField('', required()));

    act(() => {
      const isValid = result.current.validate();
      expect(isValid).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('should reset field', () => {
    const { result } = renderHook(() => useFormField(''));

    act(() => {
      result.current.setValue('test');
      result.current.handleBlur();
    });

    expect(result.current.isDirty).toBe(true);
    expect(result.current.touched).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe('');
    expect(result.current.isDirty).toBe(false);
    expect(result.current.touched).toBe(false);
  });
});
