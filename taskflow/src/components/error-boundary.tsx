'use client';

import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            {t('errorBoundary.title') || 'Something went wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t('errorBoundary.description') ||
              'An unexpected error occurred. Please try again or contact support if the problem persists.'}
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details className="bg-muted p-4 rounded-lg">
              <summary className="cursor-pointer font-medium text-sm">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap text-red-600">
                {error.message}
                {'\n'}
                {error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('errorBoundary.retry') || 'Try Again'}
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              {t('errorBoundary.reload') || 'Reload Page'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    this.logError(error, errorInfo);
  }

  logError(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      }).catch((err) => {
        console.error('Failed to log error:', err);
      });
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} reset={this.reset} />;
    }

    return this.props.children;
  }
}
