# Utility Functions Specification

## Overview

This directory contains pure utility functions for common operations like date formatting, validation, and API error handling. All utilities are framework-agnostic and can be used across the application.

## Purpose

- Provide reusable helper functions
- Centralize common logic
- Ensure consistent behavior across the app
- Maintain type safety
- Enable easy testing

## File Structure

```
src/utils/
├── api.ts          # API error handling and utilities
├── date.ts         # Date formatting and manipulation
└── validation.ts   # Form validation rules and helpers
```

---

## API Utilities

### File: `src/utils/api.ts`

#### Purpose
Handle API errors, validate responses, and provide HTTP utilities.

---

#### `AppError` Class

Custom error class for API errors.

```typescript
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
    public details?: unknown
  );
}
```

**Usage:**
```typescript
throw new AppError(
  'VALIDATION_ERROR',
  'Email is required',
  400,
  { field: 'email' }
);
```

---

#### `handleApiError()`

Normalize various error types into `AppError`.

```typescript
function handleApiError(error: unknown): AppError
```

**Handles:**
- Network errors
- Timeout errors
- HTTP status errors
- Unknown errors

**Example:**
```typescript
try {
  const response = await fetch('/api/meals');
} catch (error) {
  const apiError = handleApiError(error);
  console.error(apiError.code, apiError.message);
  throw apiError;
}
```

---

#### `validateApiResponse()`

Validate API response structure and type.

```typescript
function validateApiResponse<T>(
  response: unknown,
  schema?: ValidationSchema<T>
): ApiResponse<T>
```

**Example:**
```typescript
const data = await fetch('/api/meals').then(r => r.json());
const validated = validateApiResponse<Meal[]>(data);

if (validated.success && validated.data) {
  // Type-safe access to validated.data
  console.log(validated.data);
}
```

---

#### `getAuthHeaders()`

Create authorization headers with token.

```typescript
function getAuthHeaders(token?: string): Record<string, string>
```

**Example:**
```typescript
const headers = getAuthHeaders(accessToken);
// Returns: { 'Authorization': 'Bearer <token>' }

fetch('/api/protected', { headers });
```

---

#### `retry()`

Retry function with exponential backoff.

```typescript
function retry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;      // Default: 3
    delay?: number;           // Default: 1000ms
    backoff?: number;         // Default: 2 (exponential)
    shouldRetry?: (error: Error, attempt: number) => boolean;
  }
): Promise<T>
```

**Example:**
```typescript
const data = await retry(
  () => fetch('/api/meals').then(r => r.json()),
  {
    maxRetries: 5,
    delay: 2000,
    shouldRetry: (error, attempt) => {
      // Only retry on network errors
      return error.message.includes('NetworkError');
    }
  }
);
```

---

#### `createApiUrl()`

Build URL with query parameters.

```typescript
function createApiUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, any>
): string
```

**Example:**
```typescript
const url = createApiUrl(
  'http://localhost:8080',
  '/api/meals',
  { date: '2025-11-13', mealTime: 'lunch' }
);
// Returns: 'http://localhost:8080/api/meals?date=2025-11-13&mealTime=lunch'
```

---

## Date Utilities

### File: `src/utils/date.ts`

#### Purpose
Date formatting, parsing, and manipulation utilities using native Date API and date-fns.

---

#### `formatDate()`

Format date to various string formats.

```typescript
function formatDate(
  date: Date | string,
  format: 'YYYY-MM-DD' | 'korean' | 'short' | 'long' | 'relative'
): string
```

**Formats:**
- `'YYYY-MM-DD'` → `'2025-11-13'`
- `'korean'` → `'2025년 11월 13일'`
- `'short'` → `'11/13'`
- `'long'` → `'November 13, 2025'`
- `'relative'` → `'3 days ago'` / `'Today'` / `'Tomorrow'`

**Examples:**
```typescript
formatDate(new Date('2025-11-13'), 'YYYY-MM-DD');
// Returns: '2025-11-13'

formatDate(new Date(), 'korean');
// Returns: '2025년 11월 13일'

formatDate(new Date('2025-11-10'), 'relative');
// Returns: '3 days ago'
```

---

#### `parseDate()`

Parse string to Date object.

```typescript
function parseDate(dateString: string): Date
```

**Supported formats:**
- ISO: `'2025-11-13T10:30:00Z'`
- Date only: `'2025-11-13'`
- Korean: `'2025년 11월 13일'`

**Example:**
```typescript
const date = parseDate('2025-11-13');
console.log(date.getMonth()); // 10 (November)
```

---

#### `isToday()`

Check if date is today.

```typescript
function isToday(date: Date | string): boolean
```

**Example:**
```typescript
isToday(new Date()); // true
isToday('2025-11-13'); // depends on current date
```

---

#### `isSameDate()`

Check if two dates are the same day.

```typescript
function isSameDate(date1: Date | string, date2: Date | string): boolean
```

**Example:**
```typescript
isSameDate('2025-11-13', new Date('2025-11-13T15:30:00'));
// Returns: true (same day, different time)
```

---

#### `addDays()`

Add or subtract days from a date.

```typescript
function addDays(date: Date | string, days: number): Date
```

**Example:**
```typescript
const today = new Date('2025-11-13');
const tomorrow = addDays(today, 1);
const yesterday = addDays(today, -1);

console.log(formatDate(tomorrow, 'YYYY-MM-DD')); // '2025-11-14'
console.log(formatDate(yesterday, 'YYYY-MM-DD')); // '2025-11-12'
```

---

#### `getDateRange()`

Get array of dates between start and end.

```typescript
function getDateRange(start: Date | string, end: Date | string): Date[]
```

**Example:**
```typescript
const range = getDateRange('2025-11-13', '2025-11-15');
// Returns: [Date(2025-11-13), Date(2025-11-14), Date(2025-11-15)]

range.forEach(date => {
  console.log(formatDate(date, 'YYYY-MM-DD'));
});
```

---

#### `getWeekRange()`

Get start and end dates of a week containing the given date.

```typescript
function getWeekRange(date: Date | string): { start: string; end: string }
```

**Example:**
```typescript
const { start, end } = getWeekRange(new Date('2025-11-13'));
// Returns: { start: '2025-11-10', end: '2025-11-16' }
// (Monday to Sunday)

// Use with API
const nutrition = await nutritionApi.getNutritionData(start, end);
```

---

#### `getMonthRange()`

Get start and end dates of a month.

```typescript
function getMonthRange(date: Date | string): { start: string; end: string }
```

**Example:**
```typescript
const { start, end } = getMonthRange(new Date('2025-11-13'));
// Returns: { start: '2025-11-01', end: '2025-11-30' }
```

---

#### `getRelativeTimeString()`

Get human-readable relative time string.

```typescript
function getRelativeTimeString(date: Date | string): string
```

**Examples:**
```typescript
getRelativeTimeString(new Date()); // 'Just now'
getRelativeTimeString(addDays(new Date(), -1)); // 'Yesterday'
getRelativeTimeString(addDays(new Date(), -3)); // '3 days ago'
getRelativeTimeString(addDays(new Date(), 1)); // 'Tomorrow'
getRelativeTimeString(addDays(new Date(), 7)); // 'In 7 days'
```

---

#### `validateDateRange()`

Validate date range (max 90 days).

```typescript
function validateDateRange(
  start: Date | string,
  end: Date | string
): { valid: boolean; error?: string }
```

**Example:**
```typescript
const result = validateDateRange('2025-11-13', '2025-11-20');
// Returns: { valid: true }

const invalid = validateDateRange('2025-01-01', '2025-12-31');
// Returns: { valid: false, error: 'Date range cannot exceed 90 days' }
```

---

## Validation Utilities

### File: `src/utils/validation.ts`

#### Purpose
Form validation rules, composers, and helpers for consistent validation across the app.

---

### Validation Rule Type

```typescript
type ValidationRule<T = any> = (value: T) => string | undefined;
```

A validation rule returns:
- `undefined` if validation passes
- `string` (error message) if validation fails

---

### Basic Validation Rules

#### `required()`

Validate that value is not empty.

```typescript
const required: ValidationRule = (value: any) => string | undefined
```

**Example:**
```typescript
required('hello');     // undefined (valid)
required('');          // 'This field is required'
required(null);        // 'This field is required'
required(undefined);   // 'This field is required'
```

---

#### `minLength()`

Validate minimum string length.

```typescript
function minLength(min: number): ValidationRule<string>
```

**Example:**
```typescript
const minLength8 = minLength(8);

minLength8('password'); // undefined (valid)
minLength8('pass');     // 'Must be at least 8 characters'
```

---

#### `maxLength()`

Validate maximum string length.

```typescript
function maxLength(max: number): ValidationRule<string>
```

**Example:**
```typescript
const maxLength50 = maxLength(50);

maxLength50('Short text'); // undefined (valid)
maxLength50('x'.repeat(100)); // 'Must be at most 50 characters'
```

---

#### `pattern()`

Validate against regex pattern.

```typescript
function pattern(regex: RegExp, message: string): ValidationRule<string>
```

**Example:**
```typescript
const alphanumeric = pattern(
  /^[a-zA-Z0-9]+$/,
  'Must contain only letters and numbers'
);

alphanumeric('abc123'); // undefined (valid)
alphanumeric('abc-123'); // 'Must contain only letters and numbers'
```

---

### Domain-Specific Validation Rules

#### `email()`

Validate email format.

```typescript
const email: ValidationRule<string>
```

**Example:**
```typescript
email('user@example.com');     // undefined (valid)
email('invalid-email');         // 'Invalid email address'
email('user@');                 // 'Invalid email address'
```

---

#### `koreatech()`

Validate Koreatech email domain.

```typescript
const koreatech: ValidationRule<string>
```

**Example:**
```typescript
koreatech('student@koreatech.ac.kr');  // undefined (valid)
koreatech('student@gmail.com');        // 'Must be a Koreatech email address'
```

---

#### `studentId()`

Validate student ID format (10 digits).

```typescript
const studentId: ValidationRule<string>
```

**Example:**
```typescript
studentId('2021136000');  // undefined (valid)
studentId('123');         // 'Invalid student ID format'
studentId('abcd123456');  // 'Invalid student ID format'
```

---

#### `password()`

Validate password strength.

Requirements:
- At least 8 characters
- Contains uppercase letter
- Contains lowercase letter
- Contains number
- Contains special character

```typescript
const password: ValidationRule<string>
```

**Example:**
```typescript
password('Password123!');  // undefined (valid)
password('weak');          // 'Password must be at least 8 characters...'
password('password123');   // 'Password must contain...'
```

---

#### `phoneNumber()`

Validate Korean phone number format.

```typescript
const phoneNumber: ValidationRule<string>
```

**Example:**
```typescript
phoneNumber('010-1234-5678');  // undefined (valid)
phoneNumber('01012345678');    // undefined (valid)
phoneNumber('123-456');        // 'Invalid phone number format'
```

---

#### `date()`

Validate date format and range.

```typescript
function date(options?: {
  min?: Date | string;
  max?: Date | string;
  format?: 'YYYY-MM-DD' | 'ISO';
}): ValidationRule<string>
```

**Example:**
```typescript
const futureDate = date({
  min: new Date(),
  format: 'YYYY-MM-DD'
});

futureDate('2025-12-31'); // undefined (valid)
futureDate('2020-01-01'); // 'Date must be after ...'
```

---

### Validation Composers

#### `compose()`

Combine multiple validation rules.

```typescript
function compose<T>(...rules: ValidationRule<T>[]): ValidationRule<T>
```

Returns the first error encountered, or `undefined` if all pass.

**Example:**
```typescript
const validatePassword = compose(
  required,
  minLength(8),
  password
);

validatePassword('');              // 'This field is required'
validatePassword('short');         // 'Must be at least 8 characters'
validatePassword('password123');   // 'Password must contain...'
validatePassword('Password123!');  // undefined (valid)
```

---

#### `when()`

Conditional validation based on other field values.

```typescript
function when<T>(
  condition: (allValues: any) => boolean,
  rule: ValidationRule<T>
): ValidationRule<T>
```

**Example:**
```typescript
const form = {
  hasAddress: true,
  address: ''
};

const validateAddress = when(
  (values) => values.hasAddress === true,
  required
);

validateAddress(form.address); // 'This field is required'

// If hasAddress is false, validation is skipped
```

---

### Form Validation Helpers

#### `validateForm()`

Validate entire form object.

```typescript
function validateForm<T extends Record<string, any>>(
  values: T,
  rules: Partial<Record<keyof T, ValidationRule>>
): {
  errors: Partial<Record<keyof T, string>>;
  isValid: boolean;
}
```

**Example:**
```typescript
import { validateForm, validation } from '@/utils/validation';

const values = {
  email: 'user@koreatech.ac.kr',
  password: 'short',
  studentId: '2021136000'
};

const rules = {
  email: validation.compose(validation.required, validation.email, validation.koreatech),
  password: validation.compose(validation.required, validation.password),
  studentId: validation.studentId
};

const { errors, isValid } = validateForm(values, rules);

console.log(errors);
// { password: 'Must be at least 8 characters' }

console.log(isValid); // false
```

---

#### `createDebouncedValidator()`

Create debounced validator for real-time validation.

```typescript
function createDebouncedValidator<T>(
  rule: ValidationRule<T>,
  delay: number = 300
): (value: T, callback: (error?: string) => void) => void
```

**Example:**
```typescript
const debouncedEmailValidator = createDebouncedValidator(
  validation.compose(validation.required, validation.email),
  500
);

// In React component
const [emailError, setEmailError] = useState<string>();

const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setEmail(value);

  debouncedEmailValidator(value, (error) => {
    setEmailError(error);
  });
};
```

---

#### `createAsyncValidator()`

Create async validator for server-side checks.

```typescript
function createAsyncValidator<T>(
  asyncFn: (value: T) => Promise<boolean>,
  errorMessage: string
): ValidationRule<T>
```

**Example:**
```typescript
const checkEmailAvailability = createAsyncValidator(
  async (email: string) => {
    const response = await fetch(`/api/check-email?email=${email}`);
    const { available } = await response.json();
    return available;
  },
  'Email is already taken'
);

// Use in form validation
const emailRule = validation.compose(
  validation.required,
  validation.email,
  checkEmailAvailability
);
```

---

## Usage Patterns

### Form Validation Example

Complete form validation with `useForm` hook:

```typescript
import { useForm } from '@/hooks/useForm';
import { validation } from '@/utils/validation';
import type { RegisterData } from '@/types';

function RegisterForm() {
  const form = useForm<RegisterData>({
    initialValues: {
      email: '',
      password: '',
      name: '',
      studentId: '',
      department: ''
    },
    validate: (values) => {
      return {
        email: validation.compose(
          validation.required,
          validation.email,
          validation.koreatech
        )(values.email),

        password: validation.compose(
          validation.required,
          validation.password
        )(values.password),

        name: validation.required(values.name),

        studentId: validation.compose(
          validation.required,
          validation.studentId
        )(values.studentId),

        department: validation.required(values.department)
      };
    },
    onSubmit: async (values) => {
      await authApi.register(values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Best Practices

### 1. Use Composition
Combine simple rules to create complex validations:
```typescript
const strongPassword = compose(
  required,
  minLength(12),
  password
);
```

### 2. Create Reusable Rules
Define domain-specific rules once, use everywhere:
```typescript
export const koratechEmail = compose(required, email, koreatech);
```

### 3. Localize Error Messages
Consider i18n for error messages:
```typescript
const required = (value: any) =>
  value ? undefined : t('validation.required');
```

### 4. Test Validation Rules
Validation rules are pure functions - easy to test:
```typescript
describe('email validation', () => {
  it('validates correct email', () => {
    expect(email('user@example.com')).toBeUndefined();
  });

  it('rejects invalid email', () => {
    expect(email('invalid')).toBe('Invalid email address');
  });
});
```

---

## Adding New Utilities

When adding new utility functions:

1. **Choose appropriate file** based on category
2. **Write pure functions** (no side effects)
3. **Add TypeScript types**
4. **Write JSDoc comments**
5. **Add usage examples**
6. **Write unit tests**
7. **Update this SPEC**

Example template:
```typescript
/**
 * Brief description of what the function does
 *
 * @param paramName - Description of parameter
 * @returns Description of return value
 *
 * @example
 * ```typescript
 * const result = utilityFunction('input');
 * console.log(result); // 'output'
 * ```
 */
export function utilityFunction(param: string): string {
  // Implementation
  return param.toUpperCase();
}
```

---

## Testing Utilities

All utility functions should be unit tested:

```typescript
import { formatDate, addDays } from '@/utils/date';

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('formats date as YYYY-MM-DD', () => {
      const date = new Date('2025-11-13');
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-11-13');
    });

    it('handles invalid dates', () => {
      expect(() => formatDate('invalid', 'YYYY-MM-DD')).toThrow();
    });
  });

  describe('addDays', () => {
    it('adds days correctly', () => {
      const date = new Date('2025-11-13');
      const result = addDays(date, 5);
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2025-11-18');
    });
  });
});
```

---

## Dependencies

- `date-fns` - Date manipulation library
- `@/types` - TypeScript type definitions

---

## Related Documentation

- [Type Definitions](../types/SPEC.md)
- [Custom Hooks](../hooks/SPEC.md)
- [API Client](../lib/SPEC.md)
- [Code Conventions](../../CODE_CONVENTIONS.md)
