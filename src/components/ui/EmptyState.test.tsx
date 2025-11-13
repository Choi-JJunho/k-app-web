import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('should render icon, title and description', () => {
    render(
      <EmptyState
        icon="📭"
        title="No data"
        description="There is no data to display"
      />
    );

    expect(screen.getByText('📭')).toBeInTheDocument();
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.getByText('There is no data to display')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    render(
      <EmptyState
        icon="📭"
        title="No data"
        description="Add some data"
        action={<button>Add Data</button>}
      />
    );

    expect(screen.getByRole('button', { name: 'Add Data' })).toBeInTheDocument();
  });

  it('should not render action when not provided', () => {
    render(
      <EmptyState icon="📭" title="No data" description="No action available" />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
