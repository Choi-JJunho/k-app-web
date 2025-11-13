import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  it('should render error information', () => {
    render(
      <ErrorState
        icon="⚠️"
        title="Error occurred"
        description="Something went wrong"
      />
    );

    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        icon="⚠️"
        title="Error"
        description="Failed to load"
        onRetry={onRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /다시 시도/i });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(
      <ErrorState icon="⚠️" title="Error" description="No retry available" />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
