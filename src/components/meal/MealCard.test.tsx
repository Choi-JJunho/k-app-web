import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MealCard from './MealCard';
import type { Meal } from '@/lib/api';

describe('MealCard', () => {
  const mockMeal: Meal = {
    id: '1',
    date: '2025-01-15',
    dining_time: 'breakfast',
    menu: ['계란찜', '밥', '김치'],
    kcal: '500',
    price: '5000',
    place: '학생식당',
  };

  it('should render meal information', () => {
    render(<MealCard meal={mockMeal} />);

    expect(screen.getByText('조식')).toBeInTheDocument();
    expect(screen.getByText(/학생식당/)).toBeInTheDocument();
    expect(screen.getByText(/5000원/)).toBeInTheDocument();
    expect(screen.getByText(/500kcal/)).toBeInTheDocument();
  });

  it('should render all menu items', () => {
    render(<MealCard meal={mockMeal} />);

    expect(screen.getByText('계란찜')).toBeInTheDocument();
    expect(screen.getByText('밥')).toBeInTheDocument();
    expect(screen.getByText('김치')).toBeInTheDocument();
  });

  it('should display correct dining time label for lunch', () => {
    const lunchMeal: Meal = { ...mockMeal, dining_time: 'lunch' };
    render(<MealCard meal={lunchMeal} />);

    expect(screen.getByText('중식')).toBeInTheDocument();
  });

  it('should display correct dining time label for dinner', () => {
    const dinnerMeal: Meal = { ...mockMeal, dining_time: 'dinner' };
    render(<MealCard meal={dinnerMeal} />);

    expect(screen.getByText('석식')).toBeInTheDocument();
  });
});
