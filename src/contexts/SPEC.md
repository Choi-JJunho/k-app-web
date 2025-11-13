# Contexts Specification

## Overview

This directory contains React Context providers for global state management. Contexts provide shared state and functionality across the component tree without prop drilling.

## Purpose

- Manage global application state
- Provide authentication state
- Share user data across components
- Enable centralized state updates
- Avoid prop drilling

## File Structure

```
src/contexts/
└── AuthContext.tsx     # Authentication state management
```

---

## AuthContext

### Purpose
Manages user authentication state, token storage, and authentication-related actions throughout the application.

### File: `src/contexts/AuthContext.tsx`

---

### Context Structure

#### `AuthContextType`

```typescript
interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

---

### Provider Component

#### `AuthProvider`

Wraps the application to provide authentication context.

**Props:**
```typescript
interface AuthProviderProps {
  children: React.ReactNode;
}
```

**Usage:**
```tsx
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
```

---

### Hook: `useAuth()`

Custom hook to access authentication context.

**Return Type:**
```typescript
function useAuth(): AuthContextType
```

**Usage:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/auth/login">Login</Link>
      )}
    </header>
  );
}
```

**Error Handling:**
Throws error if used outside `AuthProvider`:
```typescript
const auth = useAuth(); // ❌ Error: useAuth must be used within AuthProvider
```

Always wrap components that use `useAuth()` with `AuthProvider`:
```tsx
<AuthProvider>
  <ComponentThatUsesAuth />
</AuthProvider>
```

---

## State Properties

### `user: User | null`

Current authenticated user object.

**Type:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
  department?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Usage:**
```tsx
const { user } = useAuth();

if (user) {
  console.log('User ID:', user.id);
  console.log('Email:', user.email);
  console.log('Name:', user.name);
}
```

---

### `isAuthenticated: boolean`

Indicates whether user is currently authenticated.

**Usage:**
```tsx
const { isAuthenticated } = useAuth();

if (isAuthenticated) {
  // User is logged in
  return <Dashboard />;
} else {
  // User is not logged in
  return <LoginPrompt />;
}
```

---

### `isLoading: boolean`

Indicates whether authentication state is being loaded or verified.

**Use Cases:**
- Initial app load (checking for stored tokens)
- Login/logout operations
- Token refresh

**Usage:**
```tsx
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAuthenticated) {
  return <Navigate to="/auth/login" />;
}

return <ProtectedContent />;
```

---

## Action Methods

### `login(credentials)`

Authenticate user with email and password.

**Signature:**
```typescript
async function login(credentials: LoginCredentials): Promise<void>
```

**Parameters:**
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}
```

**Behavior:**
1. Calls authentication API
2. Stores tokens in `apiClient` and `localStorage`
3. Sets user state
4. Sets `isAuthenticated` to `true`

**Usage:**
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Success - user is now authenticated
      navigate('/');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

**Throws:**
- `AppError` with code `'AUTH_FAILED'` if credentials are invalid
- Network errors if API is unreachable

---

### `logout()`

Logout current user and clear authentication state.

**Signature:**
```typescript
async function logout(): Promise<void>
```

**Behavior:**
1. Calls logout API endpoint
2. Clears tokens from `apiClient` and `localStorage`
3. Sets `user` to `null`
4. Sets `isAuthenticated` to `false`
5. Redirects to login page (optional)

**Usage:**
```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="user-menu">
      <span>{user?.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

---

### `refreshUser()`

Manually refresh user data from server.

**Signature:**
```typescript
async function refreshUser(): Promise<void>
```

**Behavior:**
1. Fetches current user data from API
2. Updates `user` state with fresh data
3. Useful after profile updates

**Usage:**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function ProfileEditForm() {
  const { refreshUser } = useAuth();

  const handleSave = async (updatedData: Partial<User>) => {
    try {
      await api.updateProfile(updatedData);
      // Refresh user data to reflect changes
      await refreshUser();
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## Internal Implementation Details

### Token Persistence

Tokens are automatically persisted to `localStorage`:

```typescript
// On login
localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', refreshToken);

// On logout
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

### Auto Token Refresh

The context integrates with `apiClient` which automatically:
- Detects expired tokens (401 responses)
- Refreshes access token using refresh token
- Retries failed requests
- Logs out user if refresh fails

**Refresh Interval:**
Access tokens are automatically refreshed every 15 minutes (configurable).

```typescript
useEffect(() => {
  if (!isAuthenticated) return;

  const interval = setInterval(async () => {
    try {
      await authApi.refreshToken();
    } catch (error) {
      // Refresh failed - logout user
      await logout();
    }
  }, 15 * 60 * 1000); // 15 minutes

  return () => clearInterval(interval);
}, [isAuthenticated]);
```

---

## Usage Patterns

### Protected Route Pattern

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving intended destination
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Usage in router
<Route
  path="/"
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  }
/>
```

---

### Conditional Rendering Pattern

```tsx
import { useAuth } from '@/contexts/AuthContext';

function Navigation() {
  const { isAuthenticated, user } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link>
      {isAuthenticated ? (
        <>
          <Link to="/nutrition">Nutrition</Link>
          <Link to="/profile">Profile</Link>
          <span>Welcome, {user?.name}</span>
        </>
      ) : (
        <>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/register">Register</Link>
        </>
      )}
    </nav>
  );
}
```

---

### Login Flow Pattern

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get intended destination before login
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // Will redirect via useEffect above
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
```

---

## Testing

### Mocking AuthContext

```tsx
import { render, screen } from '@testing-library/react';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/contexts/AuthContext';

const mockAuthContext: AuthContextType = {
  user: {
    id: '1',
    email: 'test@koreatech.ac.kr',
    name: 'Test User',
    studentId: '2021136000'
  },
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshUser: jest.fn()
};

describe('Component with Auth', () => {
  it('displays user name when authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Header />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });
});
```

---

## Best Practices

### 1. Always Use `useAuth()` Hook
Never access context directly:
```tsx
// Good ✅
const { user } = useAuth();

// Bad ❌
const auth = useContext(AuthContext);
```

### 2. Check Loading State
Always handle loading state:
```tsx
const { isAuthenticated, isLoading } = useAuth();

if (isLoading) return <LoadingSpinner />;
```

### 3. Handle Errors
Wrap auth actions in try-catch:
```tsx
try {
  await login(credentials);
} catch (error) {
  // Handle error
}
```

### 4. Cleanup on Unmount
Context automatically handles cleanup, but be aware of side effects:
```tsx
useEffect(() => {
  // Side effect using auth
  return () => {
    // Cleanup
  };
}, [user]);
```

---

## Adding New Contexts

When creating additional contexts:

1. **Create context file** in `src/contexts/`
2. **Define context type interface**
3. **Create provider component**
4. **Create custom hook** (e.g., `useTheme()`, `useNotifications()`)
5. **Add to App root** (wrap providers)
6. **Update this SPEC**

**Template:**
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// 1. Define context type
interface MyContextType {
  state: SomeState;
  actions: () => void;
}

// 2. Create context
const MyContext = createContext<MyContextType | undefined>(undefined);

// 3. Provider component
export function MyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SomeState>(/* initial */);

  const value: MyContextType = {
    state,
    actions: () => {
      // Implementation
    }
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// 4. Custom hook
export function useMyContext() {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

---

## Future Contexts

Potential contexts to add:

- **ThemeContext** - Dark/light theme management
- **NotificationContext** - In-app notifications
- **PreferencesContext** - User preferences
- **SocketContext** - WebSocket connections
- **I18nContext** - Internationalization

---

## Dependencies

- `react` - Core React library (createContext, useContext)
- `@/lib/api` - API functions (authApi)
- `@/lib/apiClient` - API client for token management
- `@/types` - TypeScript type definitions

---

## Related Documentation

- [API Client Specification](../lib/SPEC.md)
- [Type Definitions](../types/SPEC.md)
- [Pages Specification](../pages/SPEC.md)
- [Hooks Specification](../hooks/SPEC.md)
- [Architecture Overview](../../ARCHITECTURE.md)
