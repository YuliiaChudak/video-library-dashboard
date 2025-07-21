import { Controller } from 'react-hook-form';
import useFiltersForm from '@/features/filters/hooks/useFiltersForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TagSelectDropdown } from './TagSelectDropdown';
import { SortDropdown } from './SortDropdown';

interface FiltersPanelProps {
  tags: string[];
}

export function FiltersPanel({ tags }: FiltersPanelProps) {
  const { control, handlers, isDirty } = useFiltersForm();

  return (
    <div className="flex flex-col gap-y-4 sm:flex-row sm:items-end sm:gap-x-4">
      <div className="w-full min-w-[180px] sm:flex-1">
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Search"
              value={field.value}
              onChange={field.onChange}
              id="search"
              placeholder="Search via video title..."
            />
          )}
        />
      </div>

      <div className="w-full min-w-[160px] sm:w-48">
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagSelectDropdown
              items={tags}
              selectedItems={field.value}
              onItemsChange={field.onChange}
              label="Filter by tags"
            />
          )}
        />
      </div>

      <div className="w-full min-w-[140px] sm:w-48">
        <Controller
          name="sort"
          control={control}
          render={({ field }) => (
            <SortDropdown value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="w-full min-w-[120px] sm:w-40">
        <Button
          variant="neutral"
          onClick={handlers.resetFilters}
          className="w-full"
          disabled={!isDirty}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
