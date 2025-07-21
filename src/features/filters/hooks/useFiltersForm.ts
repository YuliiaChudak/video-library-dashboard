import { usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import {
  DefaultOrderValue,
  QueryParamsNames,
} from '@/features/filters/constants';
import { useDebounce } from '@/features/filters/hooks/use-debounce';
import type { SortOrder } from '@/features/video/types';

export interface FiltersFormValues {
  search: string;
  sort: SortOrder;
  tags: string[];
}

export default function useFiltersForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    control,
    formState: { isDirty },
    watch,
    reset,
  } = useForm<FiltersFormValues>({
    defaultValues: {
      search: searchParams.get(QueryParamsNames.Search) || '',
      sort:
        (searchParams.get(QueryParamsNames.OrderBy) as SortOrder) ||
        DefaultOrderValue,
      tags:
        searchParams.get(QueryParamsNames.Tags)?.split(',').filter(Boolean) ||
        [],
    },
  });

  const values = watch();
  const debouncedSearch = useDebounce(values.search, 300);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim().length > 0) {
      params.set(QueryParamsNames.Search, debouncedSearch);
    } else {
      params.delete(QueryParamsNames.Search);
    }

    if (values.tags.length > 0) {
      const sortedTags = values.tags.sort();
      params.set(QueryParamsNames.Tags, sortedTags.join(','));
    } else {
      params.delete(QueryParamsNames.Tags);
    }

    if (values.sort !== DefaultOrderValue) {
      params.set(QueryParamsNames.OrderBy, values.sort);
    } else {
      params.delete(QueryParamsNames.OrderBy);
    }

    const newUrl = `${pathname}?${params.toString()}`;
    history.pushState(null, '', newUrl);
  }, [debouncedSearch, values.tags, values.sort, pathname]);

  const handleFiltersReset = () =>
    reset({ search: '', sort: DefaultOrderValue, tags: [] });

  return {
    control,
    isDirty,
    debouncedSearch,
    handlers: {
      resetFilters: handleFiltersReset,
    },
  };
}
