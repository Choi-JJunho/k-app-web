# Components Specification

## Overview

This directory contains all React components organized by domain and purpose. Components follow a modular, reusable architecture with clear separation of concerns.

## Purpose

- Provide reusable UI components
- Encapsulate domain-specific logic
- Maintain consistent design system
- Enable component composition
- Facilitate testing and maintenance

## Directory Structure

```
src/components/
├── layout/          # Layout components (Header, Navigation)
├── meal/            # Meal domain components
├── ui/              # Reusable UI primitives
├── common/          # Shared components (Button, ErrorBoundary)
├── auth/            # Authentication components
└── form/            # Form components
```

---

## Component Categories

### 1. Layout Components (`/layout`)

#### `Header.tsx`

**Purpose:** Main application header with navigation and user menu

**Props:**
```typescript
interface HeaderProps {
  // No props - uses AuthContext internally
}
```

**Features:**
- Sticky positioning
- Logo and branding
- Navigation links (식단, 영양정보)
- User authentication status
- Login/Logout functionality
- Mobile-responsive hamburger menu

**Usage:**
```tsx
import { Header } from '@/components/layout/Header';

function App() {
  return (
    <>
      <Header />
      <main>{/* Content */}</main>
    </>
  );
}
```

---

#### `BottomNavigation.tsx`

**Purpose:** Mobile bottom navigation bar for easy thumb access

**Props:**
```typescript
interface BottomNavigationProps {
  // No props - uses react-router internally
}
```

**Features:**
- Fixed bottom position (mobile only)
- Icons for main pages
- Active route highlighting
- Touch-friendly tap targets

**Navigation Items:**
- Home (/) - 홈
- Nutrition (/nutrition) - 영양정보
- Profile (/profile) - 프로필
- Settings (/settings) - 설정

**Usage:**
```tsx
import { BottomNavigation } from '@/components/layout/BottomNavigation';

function MobileLayout() {
  return (
    <>
      <main>{/* Content */}</main>
      <BottomNavigation />
    </>
  );
}
```

---

### 2. Meal Components (`/meal`)

#### `MealCard.tsx`

**Purpose:** Display individual meal information

**Props:**
```typescript
interface MealCardProps {
  meal: Meal;
  onFavoriteToggle?: (mealId: string) => void;
  isFavorite?: boolean;
  className?: string;
}
```

**Features:**
- Orange/red gradient header
- Meal time badge (조식/중식/석식)
- Menu items list with bullet points
- Metadata badges (place, price, calories)
- Hover animations
- Favorite toggle button (optional)

**Usage:**
```tsx
import { MealCard } from '@/components/meal/MealCard';
import { useMeals } from '@/hooks/useMeals';

function MealsList() {
  const { data: meals } = useMeals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {meals?.map(meal => (
        <MealCard
          key={meal.id}
          meal={meal}
          onFavoriteToggle={(id) => console.log('Toggle', id)}
        />
      ))}
    </div>
  );
}
```

**Styling:**
- Responsive card layout
- Gradient background: `from-orange-500 to-red-500`
- Shadow on hover: `hover:shadow-lg`
- Smooth transitions

---

#### `MealFilters.tsx`

**Purpose:** Filter controls for meal list (date picker, meal time tabs)

**Props:**
```typescript
interface MealFiltersProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedMealTime: MealTimeType | 'all';
  onMealTimeChange: (mealTime: MealTimeType | 'all') => void;
  className?: string;
}
```

**Features:**
- Custom date picker with calendar
- Meal time tabs (전체, 조식, 중식, 석식)
- Active state styling
- Mobile-responsive layout

**Usage:**
```tsx
import { MealFilters } from '@/components/meal/MealFilters';
import { useState } from 'react';

function HomePage() {
  const [date, setDate] = useState(new Date());
  const [mealTime, setMealTime] = useState<MealTimeType | 'all'>('all');

  return (
    <>
      <MealFilters
        selectedDate={date}
        onDateChange={setDate}
        selectedMealTime={mealTime}
        onMealTimeChange={setMealTime}
      />
      {/* Meal list */}
    </>
  );
}
```

---

### 3. UI Components (`/ui`)

Generic, reusable UI primitives.

#### `LoadingSpinner.tsx`

**Purpose:** Loading indicator with animation

**Props:**
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';  // Default: 'medium'
  message?: string;
  className?: string;
}
```

**Usage:**
```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function DataComponent() {
  const { data, isLoading } = useApi('/api/data');

  if (isLoading) {
    return <LoadingSpinner message="Loading meals..." />;
  }

  return <div>{/* Data */}</div>;
}
```

---

#### `ErrorState.tsx`

**Purpose:** Error display with retry functionality

**Props:**
```typescript
interface ErrorStateProps {
  error: AppError | Error;
  onRetry?: () => void;
  title?: string;
  className?: string;
}
```

**Features:**
- Displays error message
- Optional retry button
- Custom error icon
- Fallback for unknown errors

**Usage:**
```tsx
import { ErrorState } from '@/components/ui/ErrorState';

function DataComponent() {
  const { data, error, refetch } = useApi('/api/data');

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="Failed to load data"
      />
    );
  }

  return <div>{/* Data */}</div>;
}
```

---

#### `EmptyState.tsx`

**Purpose:** Empty state display with suggestions

**Props:**
```typescript
interface EmptyStateProps {
  message: string;
  suggestion?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}
```

**Usage:**
```tsx
import { EmptyState } from '@/components/ui/EmptyState';

function MealsList() {
  const { data: meals } = useMeals();

  if (meals?.length === 0) {
    return (
      <EmptyState
        message="No meals found for this date"
        suggestion="Try selecting a different date"
        action={{
          label: 'Go to Today',
          onClick: () => setDate(new Date())
        }}
      />
    );
  }

  return <div>{/* Meals */}</div>;
}
```

---

#### `CustomDatePicker.tsx`

**Purpose:** Custom date selection component

**Props:**
```typescript
interface CustomDatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}
```

**Features:**
- Calendar dropdown
- Date range restrictions
- Today button
- Keyboard navigation
- Uses `react-day-picker` library

**Usage:**
```tsx
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';

function DateSelector() {
  const [date, setDate] = useState(new Date());

  return (
    <CustomDatePicker
      selected={date}
      onChange={setDate}
      minDate={new Date('2025-01-01')}
      maxDate={new Date('2025-12-31')}
    />
  );
}
```

---

### 4. Common Components (`/common`)

#### `Button.tsx`

**Purpose:** Reusable button component with variants

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

**Variants:**
- `primary` - Orange gradient background
- `secondary` - Gray outline
- `danger` - Red background
- `ghost` - Transparent with hover effect

**Usage:**
```tsx
import { Button } from '@/components/common/Button';

function ActionButtons() {
  return (
    <>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>

      <Button variant="secondary" isLoading={isSubmitting}>
        Submit
      </Button>

      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </>
  );
}
```

---

#### `ErrorBoundary.tsx`

**Purpose:** Catch and handle React component errors

**Props:**
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

**Features:**
- Catches rendering errors
- Displays fallback UI
- Logs errors
- Optional error callback for analytics

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please refresh.</div>}
      onError={(error) => {
        console.error('App error:', error);
        // Send to error tracking service
      }}
    >
      <Routes />
    </ErrorBoundary>
  );
}
```

---

### 5. Auth Components (`/auth`)

#### `LoginForm.tsx`

**Purpose:** Login form with validation

**Props:**
```typescript
interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: AppError) => void;
}
```

**Features:**
- Email and password inputs
- Form validation
- Loading state
- Error display
- Link to registration

**Usage:**
```tsx
import { LoginForm } from '@/components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginForm
      onSuccess={(user) => {
        console.log('Logged in:', user);
        navigate('/');
      }}
      onError={(error) => {
        toast.error(error.message);
      }}
    />
  );
}
```

---

### 6. Form Components (`/form`)

#### `FormField.tsx`

**Purpose:** Reusable form field wrapper with label and error

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select';
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>; // For select
  className?: string;
}
```

**Features:**
- Consistent styling across forms
- Error message display
- Required indicator
- Support for input, textarea, select

**Usage:**
```tsx
import { FormField } from '@/components/form/FormField';
import { useForm } from '@/hooks/useForm';

function MyForm() {
  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => ({ /* validation */ }),
    onSubmit: async (values) => { /* submit */ }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <FormField
        label="Email"
        name="email"
        type="email"
        value={form.values.email}
        onChange={form.handleChange('email')}
        onBlur={form.handleBlur('email')}
        error={form.errors.email}
        touched={form.touched.email}
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange('password')}
        error={form.errors.password}
        touched={form.touched.password}
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Component Best Practices

### 1. Props Interface
Always define explicit props interface:
```tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function MyComponent({ title, onClick, children }: MyComponentProps) {
  // Implementation
}
```

### 2. Default Props
Use default parameters:
```tsx
export function Button({
  variant = 'primary',
  size = 'medium',
  children
}: ButtonProps) {
  // Implementation
}
```

### 3. Forwarding Refs
Use `forwardRef` for components that need ref access:
```tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={className} {...props} />;
  }
);
```

### 4. Composition
Prefer composition over complex props:
```tsx
// Good ✅
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Avoid ❌
<Card title="Title" content="Content" />
```

### 5. Accessibility
Always consider a11y:
```tsx
<button
  onClick={handleClick}
  aria-label="Close dialog"
  disabled={isLoading}
>
  <CloseIcon />
</button>
```

### 6. Error Boundaries
Wrap components that fetch data:
```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <DataComponent />
</ErrorBoundary>
```

---

## Styling Guidelines

### Tailwind CSS Classes
- Use utility-first approach
- Extract common patterns into components
- Use `className` prop for customization

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
</div>
```

### Color Scheme
- Primary: Orange/Red gradient (`from-orange-500 to-red-500`)
- Secondary: Gray tones
- Error: Red (`text-red-600`, `bg-red-100`)
- Success: Green (`text-green-600`, `bg-green-100`)

---

## Component Testing

### Unit Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Adding New Components

When creating new components:

1. **Determine category** - Which directory does it belong to?
2. **Create component file** - Use PascalCase naming
3. **Define props interface** - Export type for reusability
4. **Add JSDoc comments** - Document purpose and usage
5. **Implement accessibility** - ARIA labels, keyboard nav
6. **Write tests** - Unit tests for logic
7. **Update this SPEC** - Document new component

**Template:**
```tsx
/**
 * Brief description of component purpose
 *
 * @example
 * ```tsx
 * <MyComponent prop1="value" prop2={123} />
 * ```
 */
interface MyComponentProps {
  prop1: string;
  prop2: number;
  children?: React.ReactNode;
}

export function MyComponent({
  prop1,
  prop2,
  children
}: MyComponentProps) {
  return (
    <div>
      {/* Implementation */}
    </div>
  );
}
```

---

## Dependencies

- `react` - Core React library
- `react-router-dom` - Routing (Link, useNavigate)
- `react-day-picker` - Date picker component
- `date-fns` - Date formatting
- `@/hooks` - Custom hooks
- `@/types` - Type definitions
- `@/contexts` - Context providers

---

## Related Documentation

- [Pages Specification](../pages/SPEC.md)
- [Hooks Specification](../hooks/SPEC.md)
- [Type Definitions](../types/SPEC.md)
- [Code Conventions](../../CODE_CONVENTIONS.md)
