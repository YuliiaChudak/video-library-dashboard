import { VideoSkeleton } from '@/features/video/components/VideoSkeleton';

export function VideoGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters skeleton */}
      <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-end">
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="h-10 w-full animate-pulse rounded bg-gray-200 lg:w-48"></div>
        <div className="h-10 w-full animate-pulse rounded bg-gray-200 lg:w-48"></div>
        <div className="h-10 w-24 w-full animate-pulse rounded bg-gray-200 lg:w-auto"></div>
      </div>

      {/* Video count skeleton */}
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>

      {/* Video grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
