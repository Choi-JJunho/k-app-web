# Architecture Overview

## Project Summary

**K-App-Web** is a modern web application for displaying Korea Tech University meal information with nutrition tracking capabilities. Built with React 19, Vite, TypeScript, and Tailwind CSS, it provides students with an intuitive interface to view daily meals, track nutrition, and manage their preferences.

**Tech Stack:**
- **Frontend Framework:** React 19
- **Build Tool:** Vite 5.4
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript 5
- **Date Handling:** date-fns
- **UI Components:** Custom components with react-day-picker

---

## Architecture Principles

### 1. **Separation of Concerns**
Code is organized by function and domain:
- **Components** - UI presentation
- **Hooks** - Reusable logic and state
- **Utils** - Pure helper functions
- **Lib** - External service integration (API)
- **Types** - Type definitions and contracts
- **Contexts** - Global state management

### 2. **Type Safety**
TypeScript is used throughout with strict mode enabled:
- Explicit type definitions for all data structures
- No `any` types except when absolutely necessary
- Interface-first design for contracts

### 3. **Composability**
Small, focused components that can be composed:
- Single Responsibility Principle
- Component composition over complex props
- Custom hooks for reusable logic

### 4. **Mobile-First Design**
Responsive design prioritizing mobile experience:
- Bottom navigation for thumb access
- Touch-friendly tap targets
- Progressive enhancement for desktop

### 5. **Error Resilience**
Comprehensive error handling at every layer:
- API error normalization
- Component error boundaries
- User-friendly error messages
- Retry mechanisms

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │ Nutrition│  │ Profile  │  │ Settings │   │
│  │   Page   │  │   Page   │  │   Page   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │             │             │         │
└─────────┼──────────────┼─────────────┼─────────────┼─────────┘
          │              │             │             │
          └──────────────┴─────────────┴─────────────┘
                         │
          ┌──────────────┴─────────────┐
          │     Component Layer         │
          │  ┌────────┐   ┌──────────┐ │
          │  │ Layout │   │  Domain  │ │
          │  │  UI    │   │  Logic   │ │
          │  └────────┘   └──────────┘ │
          └──────────────┬─────────────┘
                         │
          ┌──────────────┴─────────────┐
          │      Custom Hooks          │
          │  ┌────────┐   ┌──────────┐ │
          │  │ useApi │   │ useForm  │ │
          │  │useMeals│   │  etc...  │ │
          │  └────────┘   └──────────┘ │
          └──────────────┬─────────────┘
                         │
          ┌──────────────┴─────────────┐
          │      API Client Layer      │
          │  ┌────────────────────────┐│
          │  │   apiClient (HTTP)     ││
          │  │   • Token Management   ││
          │  │   • Retry Logic        ││
          │  │   • Error Handling     ││
          │  └────────────────────────┘│
          └──────────────┬─────────────┘
                         │
          ┌──────────────┴─────────────┐
          │      Backend API           │
          │  • Authentication          │
          │  • Meal Data               │
          │  • Nutrition Data          │
          └────────────────────────────┘
```

---

## Directory Structure

```
k-app-web/
├── src/
│   ├── App.tsx                # Root component with routing
│   ├── main.tsx               # Application entry point
│   │
│   ├── components/            # React components
│   │   ├── layout/            # Header, Navigation
│   │   ├── meal/              # MealCard, MealFilters
│   │   ├── ui/                # LoadingSpinner, ErrorState, etc.
│   │   ├── common/            # Button, ErrorBoundary
│   │   ├── auth/              # LoginForm
│   │   └── form/              # FormField
│   │
│   ├── pages/                 # Page-level components
│   │   ├── HomePage.tsx
│   │   ├── NutritionPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── auth/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useApi.ts          # Data fetching
│   │   ├── useMeals.ts        # Meal data hook
│   │   └── useForm.ts         # Form management
│   │
│   ├── lib/                   # External integrations
│   │   ├── apiClient.ts       # HTTP client
│   │   └── api.ts             # API functions
│   │
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication state
│   │
│   ├── utils/                 # Utility functions
│   │   ├── api.ts             # API helpers
│   │   ├── date.ts            # Date utilities
│   │   └── validation.ts      # Form validation
│   │
│   └── types/                 # TypeScript types
│       └── index.ts           # All type definitions
│
├── public/                    # Static assets
│
├── vite.config.js             # Vite configuration
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind CSS config
├── package.json               # Dependencies
│
├── ARCHITECTURE.md            # This file
├── CODE_CONVENTIONS.md        # Code style guide
├── CLAUDE.md                  # Claude Code instructions
├── API_SPECIFICATION.md       # API documentation
└── README.md                  # Project README
```

---

## Data Flow Architecture

### Request/Response Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (useApi, useMutation)
    ↓
API Client (apiClient.get/post/etc)
    ↓
HTTP Request with Auth Token
    ↓
Backend API
    ↓
HTTP Response
    ↓
API Client (error handling, retry)
    ↓
Custom Hook (state update)
    ↓
Component Re-render
    ↓
UI Update
```

### Example: Fetching Meals

```typescript
// 1. Page component
function HomePage() {
  const [date, setDate] = useState(new Date());

  // 2. Custom hook
  const { data: meals, isLoading, error } = useMeals(date);

  // 3. Render
  return <MealCard meal={meals[0]} />;
}

// Inside useMeals hook:
function useMeals(date: Date) {
  // 4. useApi hook
  return useApi<Meal[]>(
    `/api/meals?date=${formatDate(date, 'YYYY-MM-DD')}`
  );
}

// Inside useApi hook:
function useApi<T>(url: string) {
  useEffect(() => {
    // 5. API client
    apiClient.get<T>(url)
      .then(response => setData(response.data))
      .catch(error => setError(error));
  }, [url]);

  return { data, isLoading, error };
}
```

---

## Layer Responsibilities

### 1. **Presentation Layer** (`src/pages`, `src/components`)

**Responsibilities:**
- Render UI elements
- Handle user interactions
- Manage local component state
- Orchestrate components
- No direct API calls (use hooks)

**Example:**
```tsx
function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: meals, isLoading } = useMeals(selectedDate);

  return (
    <div>
      <MealFilters onDateChange={setSelectedDate} />
      {isLoading ? <LoadingSpinner /> : <MealList meals={meals} />}
    </div>
  );
}
```

---

### 2. **Logic Layer** (`src/hooks`)

**Responsibilities:**
- Encapsulate reusable logic
- Manage data fetching and caching
- Handle form state and validation
- Abstract complex operations

**Example:**
```tsx
function useMeals(date: Date) {
  const formattedDate = formatDate(date, 'YYYY-MM-DD');

  return useApi<Meal[]>(`/api/meals?date=${formattedDate}`, {
    staleTime: 300000, // 5 minutes
    retry: 3
  });
}
```

---

### 3. **API Layer** (`src/lib`)

**Responsibilities:**
- Handle HTTP communication
- Manage authentication tokens
- Implement retry logic
- Normalize errors
- Provide type-safe API functions

**Example:**
```typescript
// Low-level client
export const apiClient = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    // Token management, retry, error handling
  }
};

// High-level API
export const mealApi = {
  async getMealsByDate(date: string): Promise<Meal[]> {
    const response = await apiClient.get(`/meals?date=${date}`);
    return response.data;
  }
};
```

---

### 4. **Utility Layer** (`src/utils`)

**Responsibilities:**
- Pure helper functions
- No side effects
- Framework-agnostic
- Highly testable

**Example:**
```typescript
export function formatDate(date: Date, format: string): string {
  // Pure function - no side effects
  return /* formatted date */;
}
```

---

### 5. **Type Layer** (`src/types`)

**Responsibilities:**
- Define data contracts
- Provide type safety
- Document data structures
- Enable IntelliSense

**Example:**
```typescript
export interface Meal {
  id: string;
  date: string;
  dining_time: MealTimeType;
  menu: string[];
  kcal?: number;
  price?: number;
}
```

---

## State Management

### Global State (Context API)

Used for application-wide state that needs to be accessed by many components.

**Current Contexts:**
- **AuthContext** - User authentication state

```tsx
// Provider at app root
<AuthProvider>
  <App />
</AuthProvider>

// Access in any component
function Header() {
  const { user, logout } = useAuth();
  // ...
}
```

---

### Local State (useState)

Used for component-specific state.

```tsx
function MealFilters() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealTime, setMealTime] = useState<MealTimeType>('lunch');
  // ...
}
```

---

### Server State (useApi hook)

Used for data fetched from the server with caching.

```tsx
function HomePage() {
  const { data, isLoading, error, refetch } = useApi<Meal[]>('/api/meals');
  // Automatic caching, retry, and refetch logic
}
```

---

### Form State (useForm hook)

Used for form management with validation.

```tsx
function LoginForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => ({ /* validation */ }),
    onSubmit: async (values) => { /* submit */ }
  });
}
```

---

## Authentication Flow

### Login Process

```
1. User enters credentials
        ↓
2. LoginForm → authApi.login()
        ↓
3. API returns tokens + user data
        ↓
4. AuthContext stores tokens
        ↓
5. apiClient includes token in requests
        ↓
6. Redirect to home page
```

### Token Refresh

```
1. API request with expired token
        ↓
2. Server returns 401 Unauthorized
        ↓
3. apiClient detects 401
        ↓
4. apiClient calls refresh endpoint
        ↓
5. New access token received
        ↓
6. Original request retried with new token
        ↓
7. If refresh fails → logout user
```

### Protected Routes

```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" />;

  return <>{children}</>;
}
```

---

## Error Handling Strategy

### 1. **API Layer**
- Normalize all errors to `AppError` class
- Provide error codes for handling
- Include user-friendly messages

```typescript
try {
  const response = await apiClient.get('/meals');
} catch (error) {
  // error is AppError with code, message, status
}
```

---

### 2. **Hook Layer**
- Expose error state
- Provide retry functions
- Handle loading states

```typescript
const { data, error, refetch } = useApi('/meals');

if (error) {
  return <ErrorState error={error} onRetry={refetch} />;
}
```

---

### 3. **Component Layer**
- Display error boundaries
- Show user-friendly error messages
- Provide recovery actions

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

---

### Error Propagation

```
API Error (network, 4xx, 5xx)
        ↓
apiClient catches and normalizes → AppError
        ↓
Hook catches and sets error state
        ↓
Component renders error UI
        ↓
User sees friendly error message + retry button
```

---

## Performance Optimizations

### 1. **Code Splitting**
React Router with lazy loading for routes:
```tsx
const HomePage = lazy(() => import('./pages/HomePage'));
```

### 2. **API Request Caching**
`useApi` hook implements stale-while-revalidate:
- Data cached for 5 minutes by default
- Stale data shown immediately
- Refetch in background

### 3. **Memoization**
Use `useMemo` for expensive computations:
```tsx
const filteredMeals = useMemo(() => {
  return meals?.filter(m => m.dining_time === mealTime);
}, [meals, mealTime]);
```

### 4. **Optimized Re-renders**
- Use `React.memo` for expensive components
- Stable callback references with `useCallback`

---

## Testing Strategy

### Unit Tests
- **Utils** - Pure functions, easy to test
- **Hooks** - Test with `@testing-library/react-hooks`
- **Components** - Test with `@testing-library/react`

### Integration Tests
- **Pages** - Test complete user flows
- **API** - Mock API responses

### End-to-End Tests
- Critical user paths (login, view meals, etc.)

---

## Build and Deployment

### Development
```bash
npm run dev
# Runs on http://localhost:3000
# Hot module replacement enabled
```

### Production Build
```bash
npm run build
# Output: dist/
# Optimized and minified
```

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
```

---

## Security Considerations

### 1. **Authentication**
- JWT tokens with expiration
- Refresh token rotation
- Secure token storage (localStorage)
- Auto-logout on token expiry

### 2. **API Security**
- All requests include auth token
- HTTPS only in production
- CSRF protection (backend)

### 3. **Input Validation**
- Client-side validation (UX)
- Server-side validation (security)
- XSS prevention (React escaping)

### 4. **Data Privacy**
- No sensitive data in URLs
- Secure credential transmission
- User data encryption (backend)

---

## Scalability Considerations

### Current Scale
- Single-page application
- Client-side routing
- API-driven data

### Future Enhancements
- **State Management**: Redux/Zustand for complex state
- **Real-time Updates**: WebSocket for live meal updates
- **PWA**: Service workers for offline support
- **Internationalization**: i18n for multiple languages
- **Analytics**: User behavior tracking
- **A/B Testing**: Feature experimentation

---

## Monitoring and Observability

### Error Tracking
- Console errors logged
- Error boundaries catch render errors
- API errors normalized and tracked

### Performance Monitoring
- React DevTools for component profiling
- Network tab for API performance
- Lighthouse for web vitals

---

## Development Workflow

1. **Branch Strategy**
   - `main` - Production-ready code
   - `claude/*` - Feature branches

2. **Code Review**
   - All changes reviewed
   - TypeScript compilation must pass
   - Linting must pass

3. **Testing**
   - Unit tests for new utilities
   - Integration tests for features
   - Manual testing on multiple devices

4. **Deployment**
   - Build passes without warnings
   - Environment variables configured
   - Deploy to hosting platform

---

## Related Documentation

- [Code Conventions](./CODE_CONVENTIONS.md) - Style guide and best practices
- [API Specification](./API_SPECIFICATION.md) - Backend API documentation
- [Type Definitions](./src/types/SPEC.md) - TypeScript types
- [Components](./src/components/SPEC.md) - Component library
- [Hooks](./src/hooks/SPEC.md) - Custom hooks documentation

---

## Architecture Decision Records (ADRs)

### ADR-001: Use Vite instead of Next.js
**Decision:** Migrate from Next.js to Vite + React

**Rationale:**
- Faster development builds with Vite
- Simpler configuration
- Better HMR performance
- No need for SSR (CSR sufficient)

**Status:** Implemented

---

### ADR-002: Use React Context for Auth
**Decision:** Use React Context API instead of Redux

**Rationale:**
- Authentication is the only global state
- Context API sufficient for current needs
- Simpler implementation
- Less boilerplate

**Status:** Implemented

---

### ADR-003: Custom useApi Hook
**Decision:** Build custom data fetching hook instead of using React Query

**Rationale:**
- Full control over caching logic
- Simpler API for our use case
- Reduced bundle size
- Educational value

**Status:** Implemented

**Note:** Consider migrating to React Query if data fetching complexity grows.

---

## Conclusion

This architecture provides:
- **Maintainability** through clear separation of concerns
- **Scalability** with modular component design
- **Type Safety** with comprehensive TypeScript usage
- **Developer Experience** with hot reload and TypeScript IntelliSense
- **User Experience** with error handling and loading states

The architecture is designed to grow with the application while maintaining code quality and development velocity.
