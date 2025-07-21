import { SelectDropdown } from '@/components/ui/SelectDropdown';

interface TagSelectDropdownProps {
  items: string[];
  selectedItems: string[];
  onItemsChange: (tags: string[]) => void;
  label: string;
}

export function TagSelectDropdown(props: TagSelectDropdownProps) {
  const tagOptions = props.items.map(item => ({
    value: item,
    label: item,
  }));

  return (
    <SelectDropdown
      id="tag-dropdown"
      label={props.label}
      options={tagOptions}
      selectedValues={props.selectedItems}
      onSelectionChange={props.onItemsChange}
      placeholder="Select tags..."
      multiple
    />
  );
}
