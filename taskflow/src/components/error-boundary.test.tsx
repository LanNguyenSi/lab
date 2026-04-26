import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './error-boundary';
import { I18nProvider } from '@/lib/i18n';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="child">No error</div>;
};

const renderWithI18n = (ui: React.ReactElement) => {
  return render(<I18nProvider>{ui}</I18nProvider>);
};

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('renders children when there is no error', () => {
    renderWithI18n(
      <ErrorBoundary>
        <div data-testid="child">Test Child</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders error fallback when child throws', () => {
    renderWithI18n(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(
        /An unexpected error occurred\. Please try again or contact support/
      )
    ).toBeInTheDocument();
  });

  it('has retry button', () => {
    renderWithI18n(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
  });

  it('has reload button', () => {
    renderWithI18n(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    expect(reloadButton).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div data-testid="custom">Custom Error</div>;

    renderWithI18n(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('logs error to console', () => {
    renderWithI18n(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});
