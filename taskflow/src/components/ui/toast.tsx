'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-[300px] max-w-[400px] animate-in slide-in-from-bottom-2 ${
              t.variant === 'success'
                ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                : t.variant === 'error'
                  ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950'
                  : 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950'
            }`}
          >
            {t.variant === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : t.variant === 'error' ? (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  t.variant === 'success'
                    ? 'text-green-900 dark:text-green-100'
                    : t.variant === 'error'
                      ? 'text-red-900 dark:text-red-100'
                      : 'text-blue-900 dark:text-blue-100'
                }`}
              >
                {t.title}
              </p>
              {t.description && (
                <p
                  className={`text-sm mt-1 ${
                    t.variant === 'success'
                      ? 'text-green-700 dark:text-green-300'
                      : t.variant === 'error'
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-blue-700 dark:text-blue-300'
                  }`}
                >
                  {t.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1"
              onClick={() => dismiss(t.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
