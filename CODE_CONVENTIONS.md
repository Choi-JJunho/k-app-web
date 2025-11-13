# Code Conventions

## Overview

This document defines coding standards, naming conventions, and best practices for the K-App-Web project. Following these conventions ensures consistency, maintainability, and code quality across the codebase.

---

## Table of Contents

1. [File and Folder Naming](#file-and-folder-naming)
2. [TypeScript Conventions](#typescript-conventions)
3. [React Conventions](#react-conventions)
4. [Component Structure](#component-structure)
5. [Styling Conventions](#styling-conventions)
6. [State Management](#state-management)
7. [API and Data Fetching](#api-and-data-fetching)
8. [Error Handling](#error-handling)
9. [Testing Conventions](#testing-conventions)
10. [Git Commit Messages](#git-commit-messages)
11. [Code Comments](#code-comments)

---

## File and Folder Naming

### File Naming

**Components, Pages, Contexts:**
- Use **PascalCase** for React components
- Extension: `.tsx` for components, `.ts` for utilities

```
✅ Good:
- MealCard.tsx
- HomePage.tsx
- AuthContext.tsx

❌ Bad:
- mealCard.tsx
- home-page.tsx
- authcontext.tsx
```

**Utilities, Hooks, Types:**
- Use **camelCase** for utility files and hooks
- Extension: `.ts` for non-JSX files, `.tsx` for hooks with JSX

```
✅ Good:
- useApi.ts
- validation.ts
- date.ts
- apiClient.ts

❌ Bad:
- UseApi.ts
- Validation.ts
- api-client.ts
```

**Test Files:**
- Same name as file being tested with `.test.tsx` or `.spec.tsx` suffix

```
✅ Good:
- MealCard.test.tsx
- useApi.test.ts
- validation.spec.ts
```

---

### Folder Naming

- Use **lowercase with hyphens** for multi-word folders
- Use **camelCase** for single-word domain folders

```
✅ Good:
- components/
- meal-management/
- auth/

❌ Bad:
- Components/
- MealManagement/
- Auth-Components/
```

---

## TypeScript Conventions

### Type Definitions

**Interfaces vs Types:**

Use `interface` for:
- Object shapes that may be extended
- Public API contracts
- Component props

Use `type` for:
- Union types
- Intersection types
- Mapped types
- Primitive aliases

```typescript
// ✅ Good: Interface for extendable objects
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  role: 'admin';
}

// ✅ Good: Type for unions
type Status = 'pending' | 'success' | 'error';

// ✅ Good: Type for mapped types
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

---

### Naming Conventions

**Interfaces and Types:**
- Use **PascalCase**
- Avoid `I` prefix for interfaces

```typescript
// ✅ Good
interface User {}
type ApiResponse<T> = {};

// ❌ Bad
interface IUser {}
type apiResponse<T> = {};
```

**Type Parameters (Generics):**
- Use descriptive names for clarity
- Use single letters for standard cases: `T`, `K`, `V`

```typescript
// ✅ Good: Descriptive
interface ApiResponse<TData> {
  data: TData;
}

// ✅ Good: Standard generic
function identity<T>(value: T): T {
  return value;
}

// ❌ Bad: Unclear
interface ApiResponse<A> {
  data: A;
}
```

---

### Type Annotations

**Function Parameters and Returns:**
- Always annotate function parameters
- Annotate return types for public functions
- Optional for simple, obvious returns

```typescript
// ✅ Good
function formatDate(date: Date, format: string): string {
  return /* ... */;
}

// ✅ Good: Obvious return type
function isToday(date: Date) {
  return date.toDateString() === new Date().toDateString();
}

// ❌ Bad: Missing parameter types
function formatDate(date, format) {
  return /* ... */;
}
```

**Variables:**
- Let TypeScript infer when obvious
- Annotate when type is not immediately clear

```typescript
// ✅ Good: Inference
const name = 'John'; // string inferred

// ✅ Good: Explicit when needed
const [data, setData] = useState<Meal[] | null>(null);

// ❌ Bad: Unnecessary annotation
const count: number = 5;
```

---

### Avoid `any`

Never use `any` unless absolutely necessary. Use `unknown` for truly unknown types.

```typescript
// ✅ Good
function processData(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
}

// ❌ Bad
function processData(data: any) {
  return data.toUpperCase(); // No type safety
}
```

---

### Type Imports

Use `import type` for type-only imports:

```typescript
// ✅ Good
import type { User, Meal } from '@/types';
import { formatDate } from '@/utils/date';

// ❌ Bad
import { User, Meal, formatDate } from '@/somewhere';
```

---

## React Conventions

### Component Definition

**Function Components:**
- Use function declaration for named components
- Use arrow functions for inline components

```typescript
// ✅ Good: Named component
export function MealCard({ meal }: MealCardProps) {
  return <div>{meal.menu}</div>;
}

// ✅ Good: Inline component
const renderHeader = () => <h1>Title</h1>;

// ❌ Bad: Don't use React.FC
export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return <div>{meal.menu}</div>;
};
```

---

### Props Interface

Define props interface before component:

```typescript
// ✅ Good
interface MealCardProps {
  meal: Meal;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

export function MealCard({ meal, onFavoriteToggle, className }: MealCardProps) {
  // Implementation
}
```

---

### Props Destructuring

Destructure props in function parameters:

```typescript
// ✅ Good
function Button({ label, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}

// ❌ Bad
function Button(props: ButtonProps) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

---

### Default Props

Use default parameters instead of `defaultProps`:

```typescript
// ✅ Good
function Button({
  variant = 'primary',
  size = 'medium',
  children
}: ButtonProps) {
  // Implementation
}

// ❌ Bad (deprecated)
Button.defaultProps = {
  variant: 'primary',
  size: 'medium'
};
```

---

### Event Handlers

**Naming:**
- Prefix with `handle` for component methods
- Prefix with `on` for props

```typescript
// ✅ Good
interface ButtonProps {
  onClick?: () => void;  // Prop
  onSubmit?: () => void;
}

function Form({ onSubmit }: FormProps) {
  // Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// ❌ Bad
function Form({ handleSubmit }: FormProps) { // Wrong prop name
  const onClick = () => {}; // Unclear naming
}
```

---

### Hooks Usage

**Hooks Order:**
1. State hooks (`useState`, `useReducer`)
2. Context hooks (`useAuth`, `useTheme`)
3. Ref hooks (`useRef`)
4. Effect hooks (`useEffect`, `useLayoutEffect`)
5. Custom hooks
6. Callback/memo hooks (`useCallback`, `useMemo`)

```typescript
// ✅ Good: Organized order
function MyComponent() {
  // 1. State
  const [count, setCount] = useState(0);

  // 2. Context
  const { user } = useAuth();

  // 3. Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // 4. Effects
  useEffect(() => {
    // Side effect
  }, []);

  // 5. Custom hooks
  const { data } = useApi('/endpoint');

  // 6. Callbacks
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <div onClick={handleClick}>{count}</div>;
}
```

---

### Conditional Rendering

```typescript
// ✅ Good: Simple conditions
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}

// ✅ Good: Ternary for either/or
{isAuthenticated ? <Dashboard /> : <Login />}

// ✅ Good: Early return for complex conditions
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorState error={error} />;
if (!data) return <EmptyState />;

return <DataDisplay data={data} />;

// ❌ Bad: Nested ternaries
{isLoading ? <Spinner /> : error ? <Error /> : <Data />}
```

---

## Component Structure

### File Organization

```typescript
// 1. Imports - External libraries first, then internal
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Meal } from '@/types';
import { useMeals } from '@/hooks/useMeals';
import { MealCard } from '@/components/meal/MealCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// 2. Types and Interfaces
interface HomePageProps {
  initialDate?: Date;
}

// 3. Constants (if needed)
const ITEMS_PER_PAGE = 10;

// 4. Component
export function HomePage({ initialDate = new Date() }: HomePageProps) {
  // 4a. Hooks
  const [date, setDate] = useState(initialDate);
  const { data: meals, isLoading } = useMeals(date);

  // 4b. Derived state
  const mealCount = meals?.length ?? 0;

  // 4c. Event handlers
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  // 4d. Effects
  useEffect(() => {
    document.title = 'Home | Meal App';
  }, []);

  // 4e. Render conditions
  if (isLoading) return <LoadingSpinner />;

  // 4f. Main render
  return (
    <div>
      <h1>Meals ({mealCount})</h1>
      {meals?.map(meal => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}

// 5. Helper functions (if component-specific)
function formatMealTime(time: string): string {
  return /* ... */;
}
```

---

### Component Size

- Keep components under **200 lines** when possible
- Extract sub-components if growing too large
- Move complex logic to custom hooks

```typescript
// ❌ Bad: 500-line component with everything

// ✅ Good: Split into smaller components
function HomePage() {
  return (
    <>
      <HomeHeader />
      <HomeFilters />
      <HomeMealList />
    </>
  );
}
```

---

## Styling Conventions

### Tailwind CSS

**Class Organization:**
1. Layout (display, position, sizing)
2. Spacing (margin, padding)
3. Typography (font, text)
4. Visual (color, background, border)
5. Effects (shadow, transition, transform)

```tsx
// ✅ Good: Organized classes
<div className="
  flex items-center justify-between
  p-4 mb-2
  text-lg font-semibold
  bg-white border border-gray-200 rounded-lg
  shadow-sm hover:shadow-md transition-shadow
">
  Content
</div>

// ❌ Bad: Random order
<div className="bg-white text-lg shadow-sm p-4 flex border rounded-lg">
```

---

### Responsive Design

Use mobile-first approach:

```tsx
// ✅ Good: Mobile-first
<div className="
  grid grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

---

### Custom Classes

Extract repeated patterns:

```css
/* styles.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors;
  }
}
```

---

## State Management

### Local State

Use `useState` for component-specific state:

```typescript
// ✅ Good
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

### Global State

Use Context API for application-wide state:

```typescript
// ✅ Good
const { user, isAuthenticated } = useAuth();
```

---

### Server State

Use `useApi` hook for server data:

```typescript
// ✅ Good
const { data, isLoading, error, refetch } = useApi<Meal[]>('/api/meals');
```

---

### Form State

Use `useForm` hook for forms:

```typescript
// ✅ Good
const form = useForm({
  initialValues: { email: '', password: '' },
  validate: (values) => ({ /* ... */ }),
  onSubmit: async (values) => { /* ... */ }
});
```

---

## API and Data Fetching

### Use High-Level API Functions

```typescript
// ✅ Good
import { mealApi } from '@/lib/api';
const meals = await mealApi.getMealsByDate(date);

// ❌ Bad
import { apiClient } from '@/lib/apiClient';
const response = await apiClient.get(`/meals?date=${date}`);
```

---

### Error Handling

Always handle errors:

```typescript
// ✅ Good
const { data, error, refetch } = useApi('/meals');

if (error) {
  return <ErrorState error={error} onRetry={refetch} />;
}

// ❌ Bad
const { data } = useApi('/meals');
// No error handling
```

---

### Loading States

Always show loading feedback:

```typescript
// ✅ Good
if (isLoading) {
  return <LoadingSpinner message="Loading meals..." />;
}

// ❌ Bad
// No loading indicator
```

---

## Error Handling

### Try-Catch for Async Operations

```typescript
// ✅ Good
async function handleSubmit() {
  try {
    await mealApi.create(data);
    toast.success('Created successfully');
  } catch (error) {
    if (error instanceof AppError) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  }
}

// ❌ Bad
async function handleSubmit() {
  await mealApi.create(data); // Unhandled error
  toast.success('Created');
}
```

---

### Error Boundaries

Wrap risky components:

```tsx
// ✅ Good
<ErrorBoundary fallback={<ErrorFallback />}>
  <DataComponent />
</ErrorBoundary>
```

---

## Testing Conventions

### File Naming

```
src/components/MealCard.tsx
src/components/MealCard.test.tsx
```

---

### Test Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MealCard } from './MealCard';

describe('MealCard', () => {
  // Setup
  const mockMeal = {
    id: '1',
    menu: ['김치찌개', '밥'],
    dining_time: 'lunch' as const
  };

  // Tests
  it('renders meal menu items', () => {
    render(<MealCard meal={mockMeal} />);
    expect(screen.getByText('김치찌개')).toBeInTheDocument();
  });

  it('calls onFavoriteToggle when clicked', () => {
    const handleToggle = jest.fn();
    render(<MealCard meal={mockMeal} onFavoriteToggle={handleToggle} />);

    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(handleToggle).toHaveBeenCalledWith('1');
  });
});
```

---

### Test Naming

Use descriptive test names:

```typescript
// ✅ Good
it('displays error message when API call fails', () => {});
it('disables submit button when form is invalid', () => {});

// ❌ Bad
it('works', () => {});
it('test1', () => {});
```

---

## Git Commit Messages

### Format

```
<type>: <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
# ✅ Good
feat: add meal favorite toggle functionality

Implemented favorite button in MealCard component with toggle
functionality. Favorites are persisted to backend API.

Closes #123

# ✅ Good
fix: resolve authentication token refresh issue

Token refresh was failing due to incorrect header format.
Updated apiClient to use Bearer token format.

# ❌ Bad
update stuff
fix bug
WIP
```

---

### Subject Line Rules

1. Use imperative mood ("add" not "added")
2. Don't capitalize first letter
3. No period at the end
4. Limit to 50 characters

```bash
# ✅ Good
feat: add user profile avatar upload

# ❌ Bad
Added user profile avatar upload feature.
```

---

## Code Comments

### When to Comment

**DO comment:**
- Complex algorithms
- Non-obvious business logic
- Workarounds or hacks
- Public API documentation (JSDoc)

**DON'T comment:**
- Obvious code
- What the code does (code should be self-documenting)
- Commented-out code (use git history)

---

### Comment Style

**JSDoc for public APIs:**

```typescript
/**
 * Formats a date according to the specified format
 *
 * @param date - The date to format
 * @param format - The desired format ('YYYY-MM-DD', 'korean', etc.)
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date(), 'YYYY-MM-DD') // '2025-11-13'
 * ```
 */
export function formatDate(date: Date, format: string): string {
  // Implementation
}
```

**Inline comments for complex logic:**

```typescript
// ✅ Good: Explains WHY
// Debounce search to avoid excessive API calls
const debouncedSearch = useDebounce(searchTerm, 500);

// ❌ Bad: Explains WHAT (code is self-evident)
// Set count to 0
setCount(0);
```

---

## Code Review Checklist

Before submitting code for review, ensure:

- [ ] TypeScript compilation passes without errors
- [ ] ESLint passes without warnings
- [ ] All tests pass
- [ ] New functionality has tests
- [ ] Code follows naming conventions
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Loading states are shown
- [ ] Responsive design tested
- [ ] No console.log statements left in code
- [ ] Code is self-documenting or has comments
- [ ] Commit messages follow convention

---

## Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Enforcement

These conventions are enforced through:

1. **ESLint** - Automated linting
2. **TypeScript** - Type checking
3. **Prettier** - Code formatting
4. **Code Review** - Manual review process

---

## Updates to Conventions

This document is living and may be updated. When making changes:

1. Propose changes via pull request
2. Discuss with team
3. Update document
4. Notify team of changes

Last updated: 2025-11-13
