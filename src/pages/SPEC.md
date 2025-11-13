# Pages Specification

## Overview

This directory contains all page-level components that correspond to routes in the application. Pages orchestrate multiple components, manage page-specific state, and implement business logic.

## Purpose

- Define route-level components
- Orchestrate multiple components
- Manage page-specific state and data fetching
- Implement authentication guards
- Provide page layouts and structure

## Directory Structure

```
src/pages/
├── HomePage.tsx           # Main meal display page (/)
├── NutritionPage.tsx      # Nutrition tracking (/nutrition)
├── ProfilePage.tsx        # User profile (/profile)
├── SettingsPage.tsx       # User settings (/settings)
└── auth/
    ├── LoginPage.tsx      # Login page (/auth/login)
    └── RegisterPage.tsx   # Registration page (/auth/register)
```

---

## Main Pages

### `HomePage.tsx`

**Route:** `/`

**Purpose:** Primary interface for viewing daily meal information

**Features:**
- Date selection with calendar
- Meal time filtering (all, breakfast, lunch, dinner)
- Meal cards display in responsive grid
- Loading, error, and empty states
- Real-time data fetching
- Favorite meal toggling

**State Management:**
```typescript
const [selectedDate, setSelectedDate] = useState<Date>(new Date());
const [selectedMealTime, setSelectedMealTime] = useState<MealTimeType | 'all'>('all');
```

**Data Fetching:**
```typescript
const { data: meals, isLoading, error, refetch } = useMeals(selectedDate);
```

**Filtering Logic:**
```typescript
const filteredMeals = useMemo(() => {
  if (selectedMealTime === 'all') return meals || [];
  return meals?.filter(meal => meal.dining_time === selectedMealTime) || [];
}, [meals, selectedMealTime]);
```

**Component Structure:**
```tsx
<div className="container">
  {/* Filters */}
  <MealFilters
    selectedDate={selectedDate}
    onDateChange={setSelectedDate}
    selectedMealTime={selectedMealTime}
    onMealTimeChange={setSelectedMealTime}
  />

  {/* Loading State */}
  {isLoading && <LoadingSpinner message="Loading meals..." />}

  {/* Error State */}
  {error && <ErrorState error={error} onRetry={refetch} />}

  {/* Empty State */}
  {!isLoading && !error && filteredMeals.length === 0 && (
    <EmptyState message="No meals found" />
  )}

  {/* Meal Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {filteredMeals.map(meal => (
      <MealCard
        key={meal.id}
        meal={meal}
        onFavoriteToggle={handleFavoriteToggle}
      />
    ))}
  </div>
</div>
```

**Authentication:**
Requires authentication. Redirects to `/auth/login` if not authenticated.

---

### `NutritionPage.tsx`

**Route:** `/nutrition`

**Purpose:** Track and visualize nutrition data over time

**Features:**
- Date range selection (week, month, custom)
- Calorie tracking per meal
- Nutrient breakdown charts
- Daily/weekly/monthly views
- Export nutrition data

**State Management:**
```typescript
const [dateRange, setDateRange] = useState<{start: string; end: string}>({
  start: formatDate(addDays(new Date(), -7), 'YYYY-MM-DD'),
  end: formatDate(new Date(), 'YYYY-MM-DD')
});
const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
```

**Data Fetching:**
```typescript
const { data: nutritionData, isLoading, error } = useApi<NutritionData>(
  `/api/nutrition?start=${dateRange.start}&end=${dateRange.end}`
);
```

**Component Structure:**
```tsx
<div className="container">
  {/* Date Range Selector */}
  <div className="filters">
    <button onClick={() => setViewMode('daily')}>Daily</button>
    <button onClick={() => setViewMode('weekly')}>Weekly</button>
    <button onClick={() => setViewMode('monthly')}>Monthly</button>
  </div>

  {/* Calorie Summary */}
  <div className="calorie-cards">
    <CalorieCard
      title="Breakfast"
      calories={nutritionData?.calories.breakfast}
    />
    <CalorieCard
      title="Lunch"
      calories={nutritionData?.calories.lunch}
    />
    <CalorieCard
      title="Dinner"
      calories={nutritionData?.calories.dinner}
    />
  </div>

  {/* Nutrition Charts */}
  <div className="charts">
    <CalorieChart data={nutritionData?.meals} />
    <NutrientBreakdown nutrients={nutritionData?.nutrients} />
  </div>
</div>
```

**Authentication:**
Requires authentication.

---

### `ProfilePage.tsx`

**Route:** `/profile`

**Purpose:** Display and manage user profile information

**Features:**
- User information display
- Avatar upload
- Favorite meals list
- Profile editing
- Account settings link

**Data Fetching:**
```typescript
const { user, isLoading } = useAuth();
const { data: favoriteMeals } = useApi<Meal[]>('/api/meals/favorites');
```

**Component Structure:**
```tsx
<div className="container">
  {/* Profile Header */}
  <div className="profile-header">
    <img src={user?.avatar || defaultAvatar} alt={user?.name} />
    <h1>{user?.name}</h1>
    <p>{user?.email}</p>
    <p>{user?.department}</p>
  </div>

  {/* Profile Info */}
  <div className="profile-info">
    <InfoRow label="Student ID" value={user?.studentId} />
    <InfoRow label="Department" value={user?.department} />
    <InfoRow label="Joined" value={formatDate(user?.createdAt, 'long')} />
  </div>

  {/* Favorite Meals */}
  <section>
    <h2>Favorite Meals</h2>
    <div className="meal-list">
      {favoriteMeals?.map(meal => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  </section>

  {/* Actions */}
  <div className="actions">
    <Button onClick={handleEditProfile}>Edit Profile</Button>
    <Button variant="secondary" onClick={() => navigate('/settings')}>
      Settings
    </Button>
  </div>
</div>
```

**Authentication:**
Requires authentication.

---

### `SettingsPage.tsx`

**Route:** `/settings`

**Purpose:** User preferences and application settings

**Features:**
- Notification preferences
- Theme selection (light/dark)
- Language selection
- Default meal place selection
- Data export
- Account deletion

**State Management:**
```typescript
const [settings, setSettings] = useState({
  notifications: true,
  theme: 'light' as 'light' | 'dark',
  language: 'ko',
  defaultPlace: '2캠퍼스 학생식당'
});
```

**Component Structure:**
```tsx
<div className="container">
  <h1>Settings</h1>

  {/* Notification Settings */}
  <section>
    <h2>Notifications</h2>
    <Toggle
      label="Enable notifications"
      checked={settings.notifications}
      onChange={(checked) => setSettings({ ...settings, notifications: checked })}
    />
  </section>

  {/* Appearance */}
  <section>
    <h2>Appearance</h2>
    <Select
      label="Theme"
      value={settings.theme}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'auto', label: 'Auto' }
      ]}
      onChange={(theme) => setSettings({ ...settings, theme })}
    />
  </section>

  {/* Default Preferences */}
  <section>
    <h2>Preferences</h2>
    <Select
      label="Default Meal Place"
      value={settings.defaultPlace}
      options={placeOptions}
      onChange={(place) => setSettings({ ...settings, defaultPlace: place })}
    />
  </section>

  {/* Data Management */}
  <section>
    <h2>Data</h2>
    <Button onClick={handleExportData}>Export My Data</Button>
  </section>

  {/* Account */}
  <section>
    <h2>Account</h2>
    <Button variant="danger" onClick={handleDeleteAccount}>
      Delete Account
    </Button>
  </section>
</div>
```

**Authentication:**
Requires authentication.

---

## Authentication Pages

### `auth/LoginPage.tsx`

**Route:** `/auth/login`

**Purpose:** User login interface

**Features:**
- Email and password inputs
- Form validation
- Remember me checkbox
- Forgot password link
- Register link
- Social login (future)

**State Management:**
```typescript
const form = useForm<LoginCredentials>({
  initialValues: {
    email: '',
    password: ''
  },
  validate: (values) => ({
    email: validation.compose(validation.required, validation.email)(values.email),
    password: validation.required(values.password)
  }),
  onSubmit: async (values) => {
    await login(values);
  }
});
```

**Component Structure:**
```tsx
<div className="auth-container">
  <div className="auth-card">
    <h1>Login</h1>

    <LoginForm
      onSuccess={(user) => {
        navigate('/');
      }}
      onError={(error) => {
        toast.error(error.message);
      }}
    />

    {/* Alternative Actions */}
    <div className="auth-footer">
      <Link to="/auth/forgot-password">Forgot password?</Link>
      <p>
        Don't have an account?{' '}
        <Link to="/auth/register">Register</Link>
      </p>
    </div>
  </div>
</div>
```

**Redirect Logic:**
- If already authenticated, redirect to `/`
- After successful login, redirect to intended page or `/`

---

### `auth/RegisterPage.tsx`

**Route:** `/auth/register`

**Purpose:** New user registration

**Features:**
- Full registration form
- Real-time validation
- Email verification (Koreatech domain)
- Student ID validation
- Department selection
- Password strength indicator
- Terms of service checkbox

**State Management:**
```typescript
const form = useForm<RegisterData>({
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    studentId: '',
    department: ''
  },
  validate: (values) => ({
    email: validation.compose(
      validation.required,
      validation.email,
      validation.koreatech
    )(values.email),
    password: validation.compose(
      validation.required,
      validation.password
    )(values.password),
    confirmPassword: values.password !== values.confirmPassword
      ? 'Passwords do not match'
      : undefined,
    name: validation.required(values.name),
    studentId: validation.studentId(values.studentId),
    department: validation.required(values.department)
  }),
  onSubmit: async (values) => {
    await register(values);
  }
});
```

**Component Structure:**
```tsx
<div className="auth-container">
  <div className="auth-card">
    <h1>Register</h1>

    <form onSubmit={form.handleSubmit}>
      <FormField
        label="Email (Koreatech)"
        name="email"
        type="email"
        value={form.values.email}
        onChange={form.handleChange('email')}
        error={form.errors.email}
        required
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange('password')}
        error={form.errors.password}
        required
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.values.confirmPassword}
        onChange={form.handleChange('confirmPassword')}
        error={form.errors.confirmPassword}
        required
      />

      <FormField
        label="Name"
        name="name"
        value={form.values.name}
        onChange={form.handleChange('name')}
        error={form.errors.name}
        required
      />

      <FormField
        label="Student ID"
        name="studentId"
        value={form.values.studentId}
        onChange={form.handleChange('studentId')}
        error={form.errors.studentId}
        required
      />

      <FormField
        label="Department"
        name="department"
        type="select"
        value={form.values.department}
        onChange={form.handleChange('department')}
        options={departmentOptions}
        error={form.errors.department}
        required
      />

      <Button
        type="submit"
        isLoading={form.isSubmitting}
        disabled={!form.isValid}
        fullWidth
      >
        Register
      </Button>
    </form>

    <div className="auth-footer">
      <p>
        Already have an account?{' '}
        <Link to="/auth/login">Login</Link>
      </p>
    </div>
  </div>
</div>
```

**Redirect Logic:**
- If already authenticated, redirect to `/`
- After successful registration, auto-login and redirect to `/`

---

## Page Patterns

### Authentication Guard

Protect routes that require authentication:

```tsx
function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null; // Or redirect component
  }

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### Data Fetching Pattern

```tsx
function DataPage() {
  const { data, isLoading, error, refetch } = useApi<DataType>('/api/endpoint');

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState message="No data available" />;
  }

  return (
    <div>
      {/* Render data */}
    </div>
  );
}
```

### Form Submission Pattern

```tsx
function FormPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { /* ... */ },
    validate: (values) => { /* ... */ },
    onSubmit: async (values) => {
      try {
        await api.submit(values);
        toast.success('Submitted successfully');
        navigate('/success');
      } catch (error) {
        toast.error('Submission failed');
      }
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Form fields */}
      <Button type="submit" isLoading={form.isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

---

## Best Practices

### 1. Page Metadata
Set page title and meta tags:
```tsx
import { useEffect } from 'react';

function MyPage() {
  useEffect(() => {
    document.title = 'Page Title | Meal App';
  }, []);

  return <div>{/* Content */}</div>;
}
```

### 2. Error Boundaries
Wrap pages in error boundaries:
```tsx
<ErrorBoundary fallback={<PageErrorFallback />}>
  <MyPage />
</ErrorBoundary>
```

### 3. Loading States
Always show loading feedback:
```tsx
if (isLoading) return <LoadingSpinner />;
```

### 4. Empty States
Provide guidance when no data:
```tsx
if (data.length === 0) {
  return <EmptyState message="..." suggestion="..." />;
}
```

### 5. Mobile Responsiveness
Test on mobile devices:
```tsx
<div className="container px-4 py-6 md:px-8 md:py-10">
  {/* Responsive padding */}
</div>
```

---

## Testing Pages

### Integration Testing
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('displays meals for selected date', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/조식/)).toBeInTheDocument();
    });
  });
});
```

---

## Adding New Pages

When creating new pages:

1. **Create page component** in appropriate directory
2. **Add route** in `App.tsx` or router config
3. **Implement authentication guard** if needed
4. **Add loading/error states**
5. **Set page metadata** (title, meta tags)
6. **Add navigation links**
7. **Write integration tests**
8. **Update this SPEC**

**Template:**
```tsx
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';

export function NewPage() {
  // Set page title
  useEffect(() => {
    document.title = 'Page Title | Meal App';
  }, []);

  // Data fetching
  const { data, isLoading, error, refetch } = useApi('/api/endpoint');

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="container">
      {/* Page content */}
    </div>
  );
}
```

---

## Dependencies

- `react` - Core React library
- `react-router-dom` - Navigation
- `@/hooks` - Custom hooks (useApi, useForm, etc.)
- `@/components` - Reusable components
- `@/contexts` - Context providers (AuthContext)
- `@/lib/api` - API functions
- `@/utils` - Utility functions

---

## Related Documentation

- [Components Specification](../components/SPEC.md)
- [Hooks Specification](../hooks/SPEC.md)
- [Contexts Specification](../contexts/SPEC.md)
- [Architecture Overview](../../ARCHITECTURE.md)
- [Code Conventions](../../CODE_CONVENTIONS.md)
