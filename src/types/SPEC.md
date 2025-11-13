# Type Definitions Specification

## Overview

This directory contains all TypeScript type definitions and interfaces used throughout the application. It serves as the single source of truth for type contracts across the codebase.

## Purpose

- Define domain models and entities
- Establish API contract types
- Provide shared interfaces for components and hooks
- Ensure type safety across the application

## File Structure

```
src/types/
└── index.ts          # Central type definitions export
```

## Type Categories

### 1. API Response Types

#### `ApiResponse<T>`
Generic wrapper for all API responses.

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: AppError;
}
```

**Usage:**
```typescript
const response: ApiResponse<Meal[]> = await apiClient.get('/api/meals');
```

#### `AppError`
Standardized error structure.

```typescript
interface AppError {
  code: string;          // e.g., 'AUTH_FAILED', 'VALIDATION_ERROR'
  message: string;       // Human-readable message
  status?: number;       // HTTP status code
  details?: unknown;     // Additional error context
}
```

---

### 2. Authentication Types

#### `User`
Represents an authenticated student user.

```typescript
interface User {
  id: string;
  email: string;          // Must be @koreatech.ac.kr domain
  name: string;
  studentId: string;      // Student ID number
  department?: string;
  avatar?: string;        // Profile image URL
  createdAt?: string;
  updatedAt?: string;
}
```

#### `LoginCredentials`
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

#### `RegisterData`
```typescript
interface RegisterData {
  email: string;
  password: string;
  name: string;
  studentId: string;
  department: string;
}
```

#### `AuthTokens`
```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

#### `LoginResponse`
```typescript
interface LoginResponse extends AuthTokens {
  user: User;
}
```

---

### 3. Meal Domain Types

#### `Meal`
Core meal entity.

```typescript
interface Meal {
  id: string;
  date: string;              // ISO date: 'YYYY-MM-DD'
  dining_time: MealTimeType; // 'breakfast' | 'lunch' | 'dinner'
  menu: string[];            // Array of dish names
  kcal?: number;             // Calories
  price?: number;            // Price in KRW
  place: string;             // e.g., '2캠퍼스 학생식당'
}
```

**Example:**
```typescript
const meal: Meal = {
  id: '1',
  date: '2025-11-13',
  dining_time: 'lunch',
  menu: ['김치찌개', '밥', '계란말이', '김치'],
  kcal: 850,
  price: 5000,
  place: '2캠퍼스 학생식당'
};
```

#### `MealTimeType`
```typescript
type MealTimeType = 'breakfast' | 'lunch' | 'dinner';
```

#### `MealFilter`
Filtering criteria for meal queries.

```typescript
interface MealFilter {
  date?: string;           // 'YYYY-MM-DD'
  mealTime?: MealTimeType | 'all';
  place?: string;
}
```

---

### 4. Nutrition Types

#### `NutrientInfo`
```typescript
interface NutrientInfo {
  name: string;           // e.g., 'carbohydrate'
  amount: number;         // Amount in grams
  unit: string;           // 'g', 'mg', etc.
  percentage?: number;    // Daily value percentage
}
```

#### `MealCalories`
```typescript
interface MealCalories {
  breakfast: number;
  lunch: number;
  dinner: number;
  total: number;
}
```

#### `NutritionData`
```typescript
interface NutritionData {
  date: string;
  calories: MealCalories;
  nutrients: NutrientInfo[];
  meals: Meal[];
}
```

---

### 5. Hook Return Types

#### `UseApiReturn<T>`
Return type for `useApi` hook.

```typescript
interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
  reset: () => void;
}
```

#### `UseMutationReturn<TData, TVariables>`
Return type for `useMutation` hook.

```typescript
interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<void>;
  data: TData | null;
  isLoading: boolean;
  error: AppError | null;
  reset: () => void;
}
```

---

### 6. Form Types

#### `FormState<T>`
```typescript
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}
```

#### `FormFieldError`
```typescript
interface FormFieldError {
  field: string;
  message: string;
}
```

---

### 7. UI State Types

#### `LoadingState`
```typescript
interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}
```

#### `ErrorState`
```typescript
interface ErrorState {
  hasError: boolean;
  error?: AppError;
  onRetry?: () => void;
}
```

#### `PaginationState`
```typescript
interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
```

---

### 8. Navigation Types

#### `NavigationItem`
```typescript
interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  badge?: number;
  requiresAuth?: boolean;
}
```

---

### 9. Constants

#### `MEAL_TIMES`
```typescript
const MEAL_TIMES = {
  BREAKFAST: 'breakfast' as const,
  LUNCH: 'lunch' as const,
  DINNER: 'dinner' as const,
};
```

#### `USER_ROLES`
```typescript
const USER_ROLES = {
  STUDENT: 'student' as const,
  ADMIN: 'admin' as const,
};
```

#### `API_ENDPOINTS`
Centralized endpoint definitions.

```typescript
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  MEALS: {
    BASE: '/meals',
    BY_DATE: (date: string) => `/meals?date=${date}`,
    BY_ID: (id: string) => `/meals/${id}`,
    FAVORITE: (id: string) => `/meals/${id}/favorite`,
  },
  NUTRITION: {
    BASE: '/nutrition',
    DATE_RANGE: (start: string, end: string) => `/nutrition?start=${start}&end=${end}`,
  },
};
```

---

## Type Usage Guidelines

### 1. Import Pattern
Always import types from the central location:

```typescript
import type { Meal, MealFilter, ApiResponse } from '@/types';
```

### 2. Type vs Interface
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and primitives
- Use `type` for function signatures

### 3. Null Handling
- Use `null` for intentional absence of value
- Use `undefined` for optional properties
- Use `?` for optional fields in interfaces

### 4. Generic Types
When creating reusable generic types:
```typescript
// Good: Descriptive generic names
interface ApiResponse<TData> {
  data?: TData;
}

// Avoid: Single letter generics (except standard cases like T, K, V)
```

### 5. Const Assertions
Use `as const` for literal type inference:
```typescript
const MEAL_TIMES = {
  BREAKFAST: 'breakfast' as const,
} as const;
```

---

## Validation

Types should align with runtime validation:

```typescript
// Type definition
interface User {
  email: string;
}

// Runtime validation (in utils/validation.ts)
const emailValidator = (value: string) => {
  // Email validation logic
};
```

---

## Adding New Types

When adding new types:

1. **Determine category** - Does it fit in existing categories?
2. **Follow naming conventions**:
   - PascalCase for interfaces/types
   - SCREAMING_SNAKE_CASE for constants
3. **Add JSDoc comments** for complex types
4. **Update this SPEC** with examples
5. **Consider backward compatibility**

Example:
```typescript
/**
 * Represents a favorite meal saved by a user
 * @since v1.2.0
 */
interface FavoriteMeal {
  id: string;
  userId: string;
  mealId: string;
  createdAt: string;
}
```

---

## Dependencies

This module has no runtime dependencies. It's purely TypeScript types that are compiled away.

---

## Testing

Types are validated at compile time. No runtime tests needed, but ensure:
- All types are exported properly
- No circular dependencies
- Types match API contracts (validate with API documentation)

---

## Related Documentation

- [API Specification](../../API_SPECIFICATION.md)
- [Code Conventions](../../CODE_CONVENTIONS.md)
- [Architecture Overview](../../ARCHITECTURE.md)
