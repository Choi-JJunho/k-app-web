# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build` 
- **Start production**: `npm start`
- **Linting**: `npm run lint` (uses ESLint)

The app runs on `http://localhost:3000` by default.

## Project Architecture

This is a Next.js 15 application with TypeScript and Tailwind CSS, built as a meal information display system.

### Key Structure

- **App Router**: Uses Next.js 13+ app directory structure (`src/app/`)
- **API Routes**: `/api/meals` endpoint for meal data fetching
- **Component Architecture**: Modular components split into logical directories:
  - `src/components/ui/` - Reusable UI components (LoadingSpinner, EmptyState, ErrorState)
  - `src/components/meal/` - Domain-specific meal components (MealCard, MealFilters)
  - `src/hooks/` - Custom React hooks for data fetching and state management

### Data Flow

- **API Layer**: `/api/meals/route.ts` serves meal data with mock data (designed to be replaced with real crawling logic)
- **Custom Hook**: `useMeals` hook manages API calls, loading states, and error handling
- **State Management**: React useState for local component state, no global state library
- **Filtering**: Client-side filtering by date and meal time (breakfast/lunch/dinner)

### Design System

- **Mobile-First**: Responsive design prioritizing mobile experience
- **Color Scheme**: Orange/red gradient theme for food-related branding
- **Interactive Elements**: Hover animations, smooth transitions, touch-friendly buttons
- **Typography**: Uses Geist font family (sans and mono variants)

### Error Handling Pattern

The app implements comprehensive error handling:
- Loading states with spinner component
- Empty states with actionable suggestions
- Error states with retry functionality
- Graceful API failure handling

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured (`@/*` maps to `src/*`)
- Next.js plugin enabled for enhanced development experience