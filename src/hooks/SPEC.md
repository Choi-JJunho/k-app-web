# Custom Hooks Specification

## Overview

This directory contains custom React hooks that encapsulate reusable logic for data fetching, form management, and application state. These hooks provide a consistent, type-safe interface for common patterns throughout the application.

## Purpose

- Abstract data fetching and caching logic
- Provide reusable form state management
- Implement consistent error handling
- Enable automatic refetching and retry logic
- Manage loading and error states

## File Structure

```
src/hooks/
├── useApi.ts        # Core data fetching hooks
├── useMeals.ts      # Domain-specific meal data hook
└── useForm.ts       # Form state management hook
```

---

## Core Hooks

### 1. `useApi<T>()` - Primary Data Fetching Hook

**File:** `src/hooks/useApi.ts`

#### Purpose
Main hook for GET requests with automatic caching, retry logic, and state management.

#### Type Signature
```typescript
function useApi<T>(
  url: string | null,
  options?: {
    enabled?: boolean;           // Default: true
    staleTime?: number;          // Default: 5 minutes (300000ms)
    refetchOnMount?: boolean;    // Default: true
    refetchOnWindowFocus?: boolean; // Default: true
    retry?: number;              // Default: 3
    retryDelay?: number;         // Default: 1000ms
    onSuccess?: (data: T) => void;
    onError?: (error: AppError) => void;
  }
): UseApiReturn<T>
```

#### Return Type
```typescript
interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  reset: () => void;
}
```

#### Features
- **Automatic Caching**: Prevents duplicate requests for the same URL
- **Stale Time**: Data remains fresh for 5 minutes by default
- **Auto Retry**: Exponential backoff retry logic (up to 3 attempts)
- **Refetch Controls**: Configurable refetch on mount/focus
- **Memory Leak Prevention**: Uses mounted ref to prevent state updates on unmounted components
- **Null URL Support**: Pass `null` to disable the request

#### Usage Examples

**Basic Usage:**
```typescript
import { useApi } from '@/hooks/useApi';
import type { Meal } from '@/types';

function MealsComponent() {
  const { data, isLoading, error, refetch } = useApi<Meal[]>(
    '/api/meals?date=2025-11-13'
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      {data?.map(meal => <MealCard key={meal.id} meal={meal} />)}
    </div>
  );
}
```

**With Options:**
```typescript
const { data, isLoading, error } = useApi<User>('/api/auth/me', {
  enabled: isAuthenticated,  // Only fetch when authenticated
  staleTime: 600000,         // Fresh for 10 minutes
  retry: 5,                  // Retry up to 5 times
  onSuccess: (user) => {
    console.log('User loaded:', user);
  },
  onError: (error) => {
    toast.error(error.message);
  }
});
```

**Conditional Fetching:**
```typescript
const [userId, setUserId] = useState<string | null>(null);

// Only fetches when userId is not null
const { data: userProfile } = useApi<User>(
  userId ? `/api/users/${userId}` : null
);
```

---

### 2. `useMutation<TData, TVariables>()` - Data Mutation Hook

**File:** `src/hooks/useApi.ts`

#### Purpose
Hook for POST, PUT, PATCH, DELETE requests with loading/error state management.

#### Type Signature
```typescript
function useMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: AppError, variables: TVariables) => void;
    onSettled?: (data: TData | null, error: AppError | null, variables: TVariables) => void;
  }
): UseMutationReturn<TData, TVariables>
```

#### Return Type
```typescript
interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<void>;
  data: TData | null;
  isLoading: boolean;
  error: AppError | null;
  reset: () => void;
}
```

#### Usage Examples

**Basic Mutation:**
```typescript
import { useMutation } from '@/hooks/useApi';
import { authApi } from '@/lib/api';

function LoginForm() {
  const { mutate: login, isLoading, error } = useMutation(
    authApi.login,
    {
      onSuccess: (response) => {
        console.log('Logged in:', response.user);
        navigate('/');
      },
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

**With Optimistic Updates:**
```typescript
const { mutate: toggleFavorite } = useMutation(
  mealApi.toggleFavorite,
  {
    onSuccess: (data, mealId) => {
      // Invalidate and refetch meals
      refetchMeals();
    },
    onError: (error, mealId) => {
      // Rollback optimistic update
      toast.error('Failed to update favorite');
    }
  }
);
```

---

### 3. `useAutoRefetch<T>()` - Automatic Refetch Hook

**File:** `src/hooks/useApi.ts`

#### Purpose
Wrapper around `useApi` that automatically refetches when dependencies change.

#### Type Signature
```typescript
function useAutoRefetch<T>(
  url: string | null,
  dependencies: React.DependencyList,
  options?: UseApiOptions
): UseApiReturn<T>
```

#### Usage Example
```typescript
const [date, setDate] = useState('2025-11-13');

// Automatically refetches when date changes
const { data: meals, isLoading } = useAutoRefetch<Meal[]>(
  `/api/meals?date=${date}`,
  [date]
);
```

---

### 4. `useInfiniteApi<T>()` - Infinite Scroll Hook

**File:** `src/hooks/useApi.ts`

#### Purpose
Implements infinite scrolling/pagination pattern with load more functionality.

#### Type Signature
```typescript
function useInfiniteApi<T>(
  getUrl: (page: number) => string,
  options?: UseApiOptions
): UseInfiniteApiReturn<T>
```

#### Return Type
```typescript
interface UseInfiniteApiReturn<T> extends Omit<UseApiReturn<T[]>, 'data'> {
  data: T[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  page: number;
}
```

#### Usage Example
```typescript
function InfiniteMealList() {
  const { data, loadMore, hasMore, isLoading } = useInfiniteApi<Meal>(
    (page) => `/api/meals?page=${page}&limit=20`
  );

  return (
    <div>
      {data.map(meal => <MealCard key={meal.id} meal={meal} />)}

      {hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## Domain-Specific Hooks

### 5. `useMeals()` - Meal Data Hook

**File:** `src/hooks/useMeals.ts`

#### Purpose
Specialized hook for fetching meal data with date filtering.

#### Type Signature
```typescript
function useMeals(date?: Date | string): UseApiReturn<Meal[]>
```

#### Features
- Automatic date formatting to 'YYYY-MM-DD'
- Defaults to today's date
- Built on top of `useApi`
- Returns meal array sorted by dining time

#### Usage Example
```typescript
import { useMeals } from '@/hooks/useMeals';

function MealsList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: meals, isLoading, error, refetch } = useMeals(selectedDate);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div>
      {meals?.map(meal => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
```

#### Legacy Interface
For backward compatibility:
```typescript
function useMealsLegacy() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Implementation...

  return { meals, loading, error, refetch };
}
```

---

## Form Management Hooks

### 6. `useForm<T>()` - Form State Management

**File:** `src/hooks/useForm.ts`

#### Purpose
Comprehensive form state management with validation, error handling, and field tracking.

#### Type Signature
```typescript
function useForm<T extends Record<string, any>>(options: {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;    // Default: true
  validateOnBlur?: boolean;      // Default: true
}): UseFormReturn<T>
```

#### Return Type
```typescript
interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;

  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  reset: () => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
}
```

#### Features
- **Field-level Validation**: Validate on change or blur
- **Form-level Validation**: Validate entire form
- **Touch Tracking**: Track which fields user has interacted with
- **Async Submit Handling**: Handles loading state during submission
- **Reset Functionality**: Reset form to initial values
- **Type Safety**: Fully typed with generics

#### Usage Example

**Basic Form:**
```typescript
import { useForm } from '@/hooks/useForm';
import type { LoginCredentials } from '@/types';

function LoginForm() {
  const form = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginCredentials, string>> = {};

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Invalid email format';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }

      return errors;
    },
    onSubmit: async (values) => {
      await authApi.login(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <div>
        <input
          type="email"
          value={form.values.email}
          onChange={form.handleChange('email')}
          onBlur={form.handleBlur('email')}
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>

      <div>
        <input
          type="password"
          value={form.values.password}
          onChange={form.handleChange('password')}
          onBlur={form.handleBlur('password')}
        />
        {form.touched.password && form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>

      <button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

**With Validation Utilities:**
```typescript
import { useForm } from '@/hooks/useForm';
import { validation } from '@/utils/validation';

function RegisterForm() {
  const form = useForm<RegisterData>({
    initialValues: {
      email: '',
      password: '',
      name: '',
      studentId: '',
      department: '',
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
        studentId: validation.studentId(values.studentId),
        // ... other fields
      };
    },
    onSubmit: async (values) => {
      await authApi.register(values);
    }
  });

  // ... render form
}
```

---

## Hook Composition Patterns

### Combining Multiple Hooks
```typescript
function MealManagementComponent() {
  // Data fetching
  const { data: meals, refetch } = useMeals();

  // Mutation
  const { mutate: deleteMeal } = useMutation(mealApi.delete, {
    onSuccess: () => refetch()
  });

  // Form management
  const form = useForm({
    initialValues: { /* ... */ },
    onSubmit: async (values) => {
      await mealApi.create(values);
      refetch();
    }
  });

  // ... component logic
}
```

### Custom Hook Composition
```typescript
// Create domain-specific hook by composing existing hooks
function useAuthenticatedMeals(date: string) {
  const { isAuthenticated } = useAuth();

  return useApi<Meal[]>(
    isAuthenticated ? `/api/meals?date=${date}` : null,
    {
      enabled: isAuthenticated,
      onError: (error) => {
        if (error.code === 'AUTH_FAILED') {
          // Handle auth error
        }
      }
    }
  );
}
```

---

## Best Practices

### 1. Error Handling
Always handle errors gracefully:
```typescript
const { data, error } = useApi<Meal[]>('/api/meals');

if (error) {
  // Show user-friendly error message
  return <ErrorState error={error} />;
}
```

### 2. Loading States
Provide visual feedback during data fetching:
```typescript
if (isLoading) {
  return <LoadingSpinner message="Loading meals..." />;
}
```

### 3. Conditional Fetching
Use `null` URL to disable requests:
```typescript
const { data } = useApi(shouldFetch ? '/api/data' : null);
```

### 4. Refetch on Actions
Refetch data after mutations:
```typescript
const { refetch: refetchMeals } = useMeals();

const { mutate: createMeal } = useMutation(mealApi.create, {
  onSuccess: () => refetchMeals()
});
```

### 5. Cleanup
Hooks automatically handle cleanup, but be aware of:
- Mounted refs prevent state updates on unmounted components
- Abort controllers cancel in-flight requests
- Reset functions clear state when needed

---

## Testing Hooks

### Unit Testing with `@testing-library/react-hooks`
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '@/hooks/useApi';

describe('useApi', () => {
  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useApi<Meal[]>('/api/meals'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  });
});
```

---

## Adding New Hooks

When creating new hooks:

1. **Follow naming convention**: `use` prefix (e.g., `useNutrition`)
2. **Type return values**: Always provide explicit return types
3. **Document usage**: Add JSDoc comments with examples
4. **Handle cleanup**: Use `useEffect` cleanup functions
5. **Update this spec**: Add documentation for new hooks

Example:
```typescript
/**
 * Custom hook for managing user preferences
 * @param userId - The user ID to fetch preferences for
 * @returns User preferences with update function
 *
 * @example
 * ```tsx
 * const { preferences, updatePreference, isLoading } = usePreferences(userId);
 * ```
 */
export function usePreferences(userId: string) {
  // Implementation
}
```

---

## Dependencies

- `react` - Core React hooks (useState, useEffect, useCallback, useRef)
- `@/lib/apiClient` - API client for data fetching
- `@/types` - TypeScript type definitions
- `@/utils/date` - Date formatting utilities

---

## Related Documentation

- [API Client Specification](../lib/SPEC.md)
- [Type Definitions](../types/SPEC.md)
- [Validation Utilities](../utils/SPEC.md)
- [Code Conventions](../../CODE_CONVENTIONS.md)
