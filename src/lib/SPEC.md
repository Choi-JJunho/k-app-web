# API Client Library Specification

## Overview

This directory contains the core API client implementation and high-level API functions. It provides a centralized, type-safe interface for all HTTP communications with the backend.

## Purpose

- Provide HTTP client with authentication
- Handle token management and refresh
- Implement retry logic with exponential backoff
- Abstract API endpoints into reusable functions
- Centralize error handling

## File Structure

```
src/lib/
├── apiClient.ts     # Core HTTP client class
└── api.ts           # High-level API functions
```

---

## Core API Client

### `ApiClient` Class

**File:** `src/lib/apiClient.ts`

#### Purpose
Low-level HTTP client with authentication, token management, and retry logic.

#### Class Structure
```typescript
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private accessToken: string | null;
  private refreshToken: string | null;
  private isRefreshing: boolean;
  private failedQueue: Array<any>;

  constructor(config?: ApiClientConfig);

  // HTTP Methods
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>>;
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  async upload<T>(url: string, file: File, config?: RequestConfig): Promise<ApiResponse<T>>;

  // Token Management
  setTokens(access: string, refresh: string): void;
  clearTokens(): void;
  getAccessToken(): string | null;

  // Internal Methods
  private async refreshAccessToken(): Promise<void>;
  private async request<T>(config: InternalRequestConfig): Promise<ApiResponse<T>>;
  private handleRequestError(error: any): AppError;
}
```

#### Configuration
```typescript
interface ApiClientConfig {
  baseURL?: string;        // Default: process.env.VITE_API_BASE_URL || '/api'
  timeout?: number;        // Default: 10000 (10 seconds)
}

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  retry?: number;          // Default: 3
  retryDelay?: number;     // Default: 1000ms
  timeout?: number;        // Override default timeout
}
```

#### Features

##### 1. Automatic Token Management
```typescript
// Tokens are automatically included in requests
apiClient.setTokens(accessToken, refreshToken);

// All subsequent requests include Authorization header
const response = await apiClient.get<Meal[]>('/meals');
```

##### 2. Token Refresh on 401
```typescript
// Automatically refreshes tokens when access token expires
// Queues failed requests and retries after refresh
const response = await apiClient.get<User>('/auth/me');
// If 401 → refresh token → retry request → return response
```

##### 3. Retry Logic with Exponential Backoff
```typescript
// Retries failed requests up to 3 times by default
const response = await apiClient.get<Meal[]>('/meals', {
  retry: 5,           // Retry up to 5 times
  retryDelay: 2000    // Start with 2 second delay
});

// Delay increases exponentially: 2s, 4s, 8s, 16s, 32s
```

##### 4. Request Timeout
```typescript
// Default 10 second timeout for all requests
const response = await apiClient.get<Meal[]>('/meals', {
  timeout: 5000  // Override to 5 seconds
});
```

##### 5. File Upload
```typescript
const file = document.querySelector('input[type="file"]').files[0];

const response = await apiClient.upload<{url: string}>(
  '/upload/avatar',
  file,
  {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
);
```

#### Usage Examples

**Basic GET Request:**
```typescript
import { apiClient } from '@/lib/apiClient';
import type { Meal } from '@/types';

async function fetchMeals(date: string) {
  try {
    const response = await apiClient.get<Meal[]>('/meals', {
      params: { date }
    });

    if (response.success && response.data) {
      return response.data;
    }
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    throw error;
  }
}
```

**POST Request with Data:**
```typescript
import type { LoginCredentials, LoginResponse } from '@/types';

async function login(credentials: LoginCredentials) {
  const response = await apiClient.post<LoginResponse>(
    '/auth/login',
    credentials
  );

  if (response.success && response.data) {
    // Store tokens
    apiClient.setTokens(
      response.data.accessToken,
      response.data.refreshToken
    );

    return response.data;
  }

  throw new Error(response.error?.message || 'Login failed');
}
```

**With Custom Headers:**
```typescript
const response = await apiClient.get<User[]>('/admin/users', {
  headers: {
    'X-Admin-Token': adminToken
  }
});
```

#### Error Handling

The client throws `AppError` objects:
```typescript
try {
  const response = await apiClient.get<Meal[]>('/meals');
} catch (error) {
  if (error instanceof AppError) {
    console.error('API Error:', error.code, error.message);

    switch (error.code) {
      case 'AUTH_FAILED':
        // Redirect to login
        break;
      case 'NETWORK_ERROR':
        // Show network error message
        break;
      case 'TIMEOUT':
        // Show timeout message
        break;
      default:
        // Generic error handling
    }
  }
}
```

#### Token Storage

Tokens are persisted in localStorage:
```typescript
// Automatic persistence
apiClient.setTokens(accessToken, refreshToken);
// Stored in: localStorage.getItem('access_token')
//            localStorage.getItem('refresh_token')

// Clear on logout
apiClient.clearTokens();
// Removes from localStorage
```

---

## High-Level API Functions

### API Module

**File:** `src/lib/api.ts`

#### Purpose
Domain-specific API functions that abstract endpoint details and provide type-safe interfaces.

#### Structure

```typescript
// Authentication API
export const authApi = {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User>;
  refreshToken: () => Promise<AuthTokens>;
};

// Meal API
export const mealApi = {
  getMealsByDate: (date: string) => Promise<Meal[]>;
  getMealById: (id: string) => Promise<Meal>;
  toggleFavorite: (id: string) => Promise<{isFavorite: boolean}>;
  searchMeals: (query: string) => Promise<Meal[]>;
};

// Nutrition API
export const nutritionApi = {
  getNutritionData: (startDate: string, endDate: string) => Promise<NutritionData>;
  getDailyCalories: (date: string) => Promise<MealCalories>;
};
```

#### Implementation Pattern

All API functions follow this pattern:
```typescript
export const exampleApi = {
  async functionName(params: ParamsType): Promise<ReturnType> {
    const response = await apiClient.method<ReturnType>(
      endpoint,
      data?,
      config?
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError({
      code: response.error?.code || 'UNKNOWN_ERROR',
      message: response.error?.message || 'Request failed',
      status: response.error?.status
    });
  }
};
```

---

### Authentication API

#### `authApi.login()`
```typescript
async function login(credentials: LoginCredentials): Promise<LoginResponse>
```

**Purpose:** Authenticate user and receive tokens

**Example:**
```typescript
import { authApi } from '@/lib/api';

try {
  const response = await authApi.login({
    email: 'student@koreatech.ac.kr',
    password: 'password123'
  });

  console.log('User:', response.user);
  console.log('Access Token:', response.accessToken);

  // Tokens are automatically stored in apiClient
} catch (error) {
  console.error('Login failed:', error);
}
```

#### `authApi.register()`
```typescript
async function register(data: RegisterData): Promise<LoginResponse>
```

**Purpose:** Register new user account

**Example:**
```typescript
const response = await authApi.register({
  email: 'student@koreatech.ac.kr',
  password: 'securePass123',
  name: '홍길동',
  studentId: '2021136000',
  department: '컴퓨터공학부'
});
```

#### `authApi.logout()`
```typescript
async function logout(): Promise<void>
```

**Purpose:** Logout user and clear tokens

**Example:**
```typescript
await authApi.logout();
// Tokens cleared from apiClient and localStorage
```

#### `authApi.getCurrentUser()`
```typescript
async function getCurrentUser(): Promise<User>
```

**Purpose:** Fetch current authenticated user profile

**Example:**
```typescript
const user = await authApi.getCurrentUser();
console.log('Current user:', user.name, user.email);
```

#### `authApi.refreshToken()`
```typescript
async function refreshToken(): Promise<AuthTokens>
```

**Purpose:** Manually refresh access token (usually automatic)

---

### Meal API

#### `mealApi.getMealsByDate()`
```typescript
async function getMealsByDate(date: string): Promise<Meal[]>
```

**Purpose:** Fetch all meals for a specific date

**Parameters:**
- `date` - Date in 'YYYY-MM-DD' format

**Example:**
```typescript
import { mealApi } from '@/lib/api';
import { formatDate } from '@/utils/date';

const today = formatDate(new Date(), 'YYYY-MM-DD');
const meals = await mealApi.getMealsByDate(today);

meals.forEach(meal => {
  console.log(meal.dining_time, meal.menu.join(', '));
});
```

#### `mealApi.getMealById()`
```typescript
async function getMealById(id: string): Promise<Meal>
```

**Purpose:** Fetch specific meal by ID

**Example:**
```typescript
const meal = await mealApi.getMealById('meal-123');
console.log('Menu:', meal.menu);
```

#### `mealApi.toggleFavorite()`
```typescript
async function toggleFavorite(id: string): Promise<{isFavorite: boolean}>
```

**Purpose:** Toggle favorite status for a meal

**Example:**
```typescript
const result = await mealApi.toggleFavorite('meal-123');
console.log('Is now favorite:', result.isFavorite);
```

#### `mealApi.searchMeals()`
```typescript
async function searchMeals(query: string): Promise<Meal[]>
```

**Purpose:** Search meals by menu items

**Example:**
```typescript
const meals = await mealApi.searchMeals('김치찌개');
console.log(`Found ${meals.length} meals with 김치찌개`);
```

---

### Nutrition API

#### `nutritionApi.getNutritionData()`
```typescript
async function getNutritionData(
  startDate: string,
  endDate: string
): Promise<NutritionData>
```

**Purpose:** Fetch nutrition data for a date range

**Parameters:**
- `startDate` - Start date in 'YYYY-MM-DD' format
- `endDate` - End date in 'YYYY-MM-DD' format

**Example:**
```typescript
import { nutritionApi } from '@/lib/api';
import { getWeekRange } from '@/utils/date';

const { start, end } = getWeekRange(new Date());
const data = await nutritionApi.getNutritionData(start, end);

console.log('Total calories:', data.calories.total);
console.log('Nutrients:', data.nutrients);
```

#### `nutritionApi.getDailyCalories()`
```typescript
async function getDailyCalories(date: string): Promise<MealCalories>
```

**Purpose:** Get calorie breakdown for a specific day

**Example:**
```typescript
const calories = await nutritionApi.getDailyCalories('2025-11-13');

console.log('Breakfast:', calories.breakfast);
console.log('Lunch:', calories.lunch);
console.log('Dinner:', calories.dinner);
console.log('Total:', calories.total);
```

---

## Best Practices

### 1. Use High-Level API Functions
Prefer `api.ts` functions over direct `apiClient` usage:
```typescript
// Good ✅
import { mealApi } from '@/lib/api';
const meals = await mealApi.getMealsByDate(date);

// Avoid ❌
import { apiClient } from '@/lib/apiClient';
const response = await apiClient.get(`/meals?date=${date}`);
```

### 2. Error Handling
Always wrap API calls in try-catch:
```typescript
try {
  const meals = await mealApi.getMealsByDate(date);
  // Handle success
} catch (error) {
  if (error instanceof AppError) {
    // Handle specific error codes
    switch (error.code) {
      case 'AUTH_FAILED':
        // Redirect to login
        break;
      case 'NOT_FOUND':
        // Show not found message
        break;
      default:
        // Generic error
    }
  }
}
```

### 3. Type Safety
Always specify generic types:
```typescript
// Good ✅
const response = await apiClient.get<Meal[]>('/meals');

// Avoid ❌
const response = await apiClient.get('/meals');
```

### 4. Token Management
Let the client handle tokens automatically:
```typescript
// After login, tokens are stored
await authApi.login(credentials);

// All subsequent requests automatically include tokens
const meals = await mealApi.getMealsByDate(date);

// On logout, clear tokens
await authApi.logout();
```

### 5. Use with Hooks
Combine with custom hooks for optimal DX:
```typescript
function useMeals(date: string) {
  return useApi<Meal[]>(
    `/api/meals?date=${date}`,
    {
      onError: (error) => {
        toast.error(error.message);
      }
    }
  );
}
```

---

## Testing

### Mocking API Client
```typescript
import { apiClient } from '@/lib/apiClient';

jest.mock('@/lib/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    // ... other methods
  }
}));

describe('API Tests', () => {
  it('fetches meals successfully', async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      success: true,
      data: [{ id: '1', menu: ['Test'] }]
    });

    const meals = await mealApi.getMealsByDate('2025-11-13');
    expect(meals).toHaveLength(1);
  });
});
```

### Integration Testing
```typescript
describe('API Integration', () => {
  beforeEach(() => {
    // Setup test API client
    apiClient.setTokens('test-access-token', 'test-refresh-token');
  });

  it('handles 401 and refreshes token', async () => {
    // Test token refresh flow
  });
});
```

---

## Adding New API Functions

When adding new API endpoints:

1. **Add to appropriate domain object** (authApi, mealApi, etc.)
2. **Follow type-safe pattern**:
```typescript
export const exampleApi = {
  async newFunction(params: ParamsType): Promise<ReturnType> {
    const response = await apiClient.method<ReturnType>(
      '/endpoint',
      data
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError({
      code: response.error?.code || 'UNKNOWN_ERROR',
      message: response.error?.message || 'Request failed'
    });
  }
};
```

3. **Add JSDoc documentation**:
```typescript
/**
 * Fetch user's favorite meals
 * @param userId - The user ID
 * @returns Array of favorite meals
 * @throws {AppError} When request fails
 *
 * @example
 * ```ts
 * const favorites = await mealApi.getFavorites('user-123');
 * ```
 */
async getFavorites(userId: string): Promise<Meal[]> {
  // Implementation
}
```

4. **Update this SPEC** with documentation

---

## Environment Variables

Configure API client via environment variables:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
```

---

## Error Codes

Standard error codes used throughout:

| Code | Description | Status Code |
|------|-------------|-------------|
| `AUTH_FAILED` | Authentication failed | 401 |
| `TOKEN_EXPIRED` | Access token expired | 401 |
| `REFRESH_FAILED` | Token refresh failed | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Input validation failed | 400 |
| `NETWORK_ERROR` | Network request failed | - |
| `TIMEOUT` | Request timeout | - |
| `SERVER_ERROR` | Internal server error | 500 |

---

## Dependencies

- `@/types` - TypeScript type definitions
- `@/utils/api` - API utility functions
- Browser `fetch` API - HTTP requests
- `localStorage` - Token persistence

---

## Related Documentation

- [API Specification](../../API_SPECIFICATION.md)
- [Type Definitions](../types/SPEC.md)
- [Custom Hooks](../hooks/SPEC.md)
- [Error Handling](../utils/SPEC.md)
