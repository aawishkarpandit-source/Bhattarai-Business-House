import { cn } from '@/utils/cn';

function shimmerClasses() {
  return 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';
}

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-gray-200',
        shimmerClasses(),
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-5 shadow-sm',
        className
      )}
    >
      <Skeleton className="mb-4 h-48 w-full rounded-xl" />
      <Skeleton className="mb-3 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-5/6" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4 rounded-md',
            i === lines - 1 ? 'w-3/5' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className, aspectRatio = '16/9' }: SkeletonProps & { aspectRatio?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-gray-200',
        shimmerClasses(),
        className
      )}
      style={{ aspectRatio }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}

export function SkeletonHero({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative h-[600px] w-full overflow-hidden bg-gray-200',
        shimmerClasses(),
        className
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="space-y-6 text-center">
          <Skeleton className="mx-auto h-8 w-48 rounded-lg" />
          <Skeleton className="mx-auto h-14 w-96 max-w-full rounded-lg" />
          <Skeleton className="mx-auto h-5 w-64 rounded-md" />
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
