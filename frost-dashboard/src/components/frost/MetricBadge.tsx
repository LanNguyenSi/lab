// components/frost/MetricBadge.tsx
import clsx from 'clsx';

interface MetricBadgeProps {
  label: string;
  value: number; // 0-1 or 0-100
  isPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function MetricBadge({ 
  label, 
  value, 
  isPercentage = true,
  variant = 'default',
  size = 'md'
}: MetricBadgeProps) {
  // Normalize value to percentage if needed
  const percentage = isPercentage && value <= 1 ? value * 100 : value;
  const displayValue = Math.round(percentage);
  
  // Auto-detect variant based on value if default
  const autoVariant = variant === 'default' 
    ? displayValue >= 80 ? 'success'
    : displayValue >= 60 ? 'default'
    : displayValue >= 40 ? 'warning'
    : 'danger'
    : variant;
  
  const variantClasses = {
    default: 'bg-blue-950 border-blue-800 text-blue-200',
    success: 'bg-green-950 border-green-800 text-green-200',
    warning: 'bg-yellow-950 border-yellow-800 text-yellow-200',
    danger: 'bg-red-950 border-red-800 text-red-200',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };
  
  return (
    <div 
      className={clsx(
        'rounded-lg border inline-flex items-center gap-2',
        variantClasses[autoVariant],
        sizeClasses[size]
      )}
    >
      <span className="font-medium">{label}:</span>
      <span className="font-bold">{displayValue}%</span>
    </div>
  );
}
