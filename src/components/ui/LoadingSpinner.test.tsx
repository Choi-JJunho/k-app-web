import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingSpinner message="데이터를 불러오는 중..." />);
    expect(screen.getByText('데이터를 불러오는 중...')).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { container, rerender } = render(<LoadingSpinner size="sm" />);
    let spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-4', 'w-4');

    rerender(<LoadingSpinner size="md" />);
    spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-8', 'w-8');

    rerender(<LoadingSpinner size="lg" />);
    spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-12', 'w-12');
  });
});
