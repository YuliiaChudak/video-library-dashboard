'use client';

import { useQuery } from '@tanstack/react-query';
import { getVideoListByCriteria } from '@/db/videos';
import type { SortOrder, Video } from '@/db/types';
import { VideoCard } from './VideoCard';
import { VideoSkeleton } from './VideoSkeleton';
import type { FiltersFormValues } from '@/features/filters/hooks/useFiltersForm';
import { FiltersPanel } from '@/features/filters/components/FiltersPanel';
import { useSearchParams } from 'next/navigation';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { DefaultOrderValue, QueryParamsNames } from '@/db/types';
import { useDebounce } from '@/features/filters/hooks/useDebounce';
import { QueryProvider } from '@/components/query/QueryProvider';

function extractValuesFromSearchParams(
  searchParams: ReadonlyURLSearchParams
): FiltersFormValues {
  const search = searchParams.get(QueryParamsNames.Search) ?? '';
  const sort = (searchParams.get(QueryParamsNames.OrderBy) ??
    DefaultOrderValue) as SortOrder;
  const tagsValue = searchParams.get(QueryParamsNames.Tags);
  let tags: string[] = [];

  if (tagsValue) {
    tags = tagsValue.split(',').sort();
  }

  return {
    search,
    sort,
    tags,
  };
}

function VideoGridImpl({ tags }: { tags: string[] }) {
  const searchParams = useSearchParams();
  const values = extractValuesFromSearchParams(searchParams);

  const debouncedSearch = useDebounce(values.search, 300);

  const { data, isLoading, error } = useQuery<Video[], Error>({
    queryKey: ['videos', values.sort, debouncedSearch, values.tags.join(',')],
    queryFn: () =>
      getVideoListByCriteria({
        orderBy: values.sort,
        searchQuery: debouncedSearch,
        tags: values.tags,
      }),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const videos = data ?? [];

  return (
    <div className="space-y-6">
      <FiltersPanel tags={tags} />

      <div className="text-sm text-gray-600">
        {videos.length} video{videos.length === 1 ? '' : 's'}
      </div>

      {error && <div className="text-red-600">Error: {error.message}</div>}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <VideoSkeleton key={i} />
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map(v => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-600">No results found.</div>
      )}
    </div>
  );
}

export function VideoGrid(props: { tags: string[] }) {
  return (
    <QueryProvider>
      <VideoGridImpl tags={props.tags} />
    </QueryProvider>
  );
}
