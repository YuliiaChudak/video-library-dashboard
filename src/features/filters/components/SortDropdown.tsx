import { SelectDropdown } from '@/components/ui/SelectDropdown';
import { OrderByValues, SortOrder } from '@/db/types';

interface SortDropdownProps {
  value: SortOrder;
  onChange: (val: SortOrder) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const sortOptions = [
    { value: OrderByValues.Newest, label: 'Newest First' },
    { value: OrderByValues.Oldest, label: 'Oldest First' },
  ];

  const handleSelectionChange = (selectedValues: string[]) => {
    if (selectedValues.length > 0) {
      onChange(selectedValues[0] as SortOrder);
    }
  };

  return (
    <SelectDropdown
      id="sort-dropdown"
      label="Sort by"
      options={sortOptions}
      selectedValues={value ? [value] : []}
      onSelectionChange={handleSelectionChange}
      placeholder="Select sort order..."
      multiple={false}
    />
  );
}
