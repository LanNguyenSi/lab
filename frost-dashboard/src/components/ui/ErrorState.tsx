// components/ui/ErrorState.tsx
import { Card } from './Card';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = 'Error', 
  message, 
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <Card title={title} className={className}>
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-slate-300 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </Card>
  );
}
