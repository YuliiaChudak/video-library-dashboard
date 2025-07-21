export function VideoSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="aspect-video w-full animate-pulse bg-gray-200" />
      <div className="p-4">
        <div className="mb-2 h-6 animate-pulse rounded bg-gray-200" />
        <div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
