'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        isCompact ? 'py-6' : isMinimal ? 'py-2' : 'py-12',
        className
      )}
    >
      {/* Animated Icon Container */}
      <div
        className={cn(
          'relative mb-4',
          isCompact ? 'h-12 w-12' : isMinimal ? 'h-8 w-8' : 'h-20 w-20'
        )}
      >
        {/* Gradient Background Circle */}
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5',
            'animate-pulse'
          )}
        />
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon
            className={cn(
              'text-primary/60',
              isCompact ? 'h-6 w-6' : isMinimal ? 'h-4 w-4' : 'h-10 w-10'
            )}
          />
        </div>
      </div>

      {/* Title */}
      <h3
        className={cn(
          'font-semibold text-foreground',
          isCompact ? 'text-sm' : isMinimal ? 'text-xs' : 'text-lg'
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && !isMinimal && (
        <p
          className={cn(
            'mt-1 text-muted-foreground max-w-xs',
            isCompact ? 'text-xs' : 'text-sm'
          )}
        >
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && !isMinimal && (
        <Button
          onClick={action.onClick}
          size={isCompact ? 'sm' : 'default'}
          className={cn('mt-4', 'bg-gradient-to-r from-primary to-primary/90')}
        >
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
