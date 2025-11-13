# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Vite for fast builds)
- **Production build**: `npm run build`
- **Start production**: `npm start`
- **Linting**: `npm run lint` (uses ESLint)
- **Testing**: `npm test` (uses Vitest)
- **Test UI**: `npm run test:ui`
- **Test coverage**: `npm run test:coverage`

The app runs on `http://localhost:5173` by default (Vite dev server).

## Project Architecture

This is a React 19 application with Vite 5, React Router 7, TypeScript, and Tailwind CSS 4, built as a meal information display system.

### Key Structure

- **Routing**: Uses React Router 7 (`src/pages/` directory structure)
- **Build Tool**: Vite 5 for fast development and optimized production builds
- **Component Architecture**: Modular components split into logical directories:
  - `src/components/ui/` - Reusable UI components (LoadingSpinner, EmptyState, ErrorState, CustomDatePicker)
  - `src/components/meal/` - Domain-specific meal components (MealCard, MealFilters)
  - `src/components/auth/` - Authentication components (LoginForm, RegisterForm)
  - `src/components/layout/` - Layout components (Header, MainLayout)
  - `src/components/common/` - Common components (ErrorBoundary)
- **Custom Hooks**:
  - `src/hooks/useApi.ts` - Generic API data fetching with caching, retry logic, and error handling
  - `src/hooks/useMeals.ts` - Meal data fetching hook
  - `src/hooks/useNutrition.ts` - Nutrition data fetching hook
  - `src/hooks/useForm.ts` - Form state management and validation

### Data Flow

- **API Client**: `src/lib/apiClient.ts` - Centralized API client with:
  - Token refresh logic for authentication
  - Request/response interceptors
  - Timeout handling
  - Retry mechanism with exponential backoff
- **API Integration**: `src/lib/api.ts` - API functions for meals, nutrition, and auth endpoints
- **Custom Hooks**: All data fetching goes through `useApi` hook for consistent caching and error handling
- **State Management**:
  - React Context API for authentication state (`AuthContext`)
  - Custom hooks (useApi, useMeals, useNutrition) for data fetching with built-in caching
  - React useState for local component state
- **Filtering**: Client-side filtering by date and meal time (breakfast/lunch/dinner)

### Design System

- **Mobile-First**: Responsive design prioritizing mobile experience
- **Color Scheme**: Orange/red gradient theme for food-related branding
- **Interactive Elements**: Hover animations, smooth transitions, touch-friendly buttons
- **Typography**: System font stack for optimal performance
- **Styling**: Tailwind CSS 4 with utility-first approach

### Error Handling Pattern

The app implements comprehensive error handling:
- Loading states with spinner component
- Empty states with actionable suggestions
- Error states with retry functionality
- Graceful API failure handling

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured (`@/*` maps to `src/*`)
- Vite client types included
- ES2020 target with ESNext modules

### Testing

- **Framework**: Vitest 4 with jsdom environment
- **Testing Library**: @testing-library/react for component testing
- **Test Files**: `*.test.ts` or `*.test.tsx` files
- **Coverage**: Available via `npm run test:coverage`
- **Current Tests**:
  - `src/utils/date.test.ts` - Date utility functions (14 tests)
  - `src/utils/validation.test.ts` - Form validation rules (18 tests)

### Constants

- Centralized in `src/constants/index.ts`
- Includes dining time labels, API timeouts, recommended calories, etc.
- Import and use constants instead of hardcoding values