import { cn } from '@/utils/cn';

const SIZES = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
} as const;

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export default function LoadingSpinner({
  size = 'md',
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-gray-200 border-t-primary-600',
          SIZES[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {label && (
        <p className="text-sm text-gray-500 animate-pulse">{label}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
