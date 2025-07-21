import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type SelectOption = {
  value: string;
  label: string;
};

type SelectDropdownProps = {
  id: string;
  label: string;
  options: SelectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
};

export function SelectDropdown({
  id,
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = 'Select options...',
  multiple = true,
  className = '',
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const focusedElement = dropdownRef.current?.querySelector(
        `[data-index="${focusedIndex}"]`
      ) as HTMLElement | null;
      focusedElement?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex, isOpen]);

  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const toggleOption = (optionValue: string) => {
    if (multiple) {
      const isSelected = selectedValues.includes(optionValue);
      const updatedValues = isSelected
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onSelectionChange(updatedValues);
    } else {
      onSelectionChange([optionValue]);
      closeDropdown();
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const actions: Record<string, () => void> = {
      Enter: () => {
        if (isOpen && focusedIndex >= 0) {
          toggleOption(options[focusedIndex]?.value || '');
        } else {
          setIsOpen(true);
          setFocusedIndex(0);
        }
      },
      ' ': () => actions.Enter?.(),
      Escape: () => closeDropdown(),
      ArrowDown: () => {
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
        }
      },
      ArrowUp: () => {
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(options.length - 1);
        } else {
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
        }
      },
      Home: () => {
        if (isOpen) setFocusedIndex(0);
      },
      End: () => {
        if (isOpen) setFocusedIndex(options.length - 1);
      },
    };

    const action = actions[event.key];
    if (action) {
      action();
      event.preventDefault();
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (!multiple) {
      return (
        options.find(opt => opt.value === selectedValues[0])?.label ||
        placeholder
      );
    }
    if (selectedValues.length === 1) {
      return (
        options.find(opt => opt.value === selectedValues[0])?.label ||
        placeholder
      );
    }
    return `${selectedValues.length} selected`;
  };

  const getItemClasses = (index: number, isSelected: boolean) => {
    const base =
      'flex items-center w-full px-2 py-1 text-sm rounded cursor-pointer transition-colors';
    if (isSelected) return `${base} bg-blue-50`;
    if (index === focusedIndex) return `${base} bg-gray-100`;
    return `${base} hover:bg-gray-50`;
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <button
        id={id}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setFocusedIndex(isOpen ? -1 : 0);
        }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left focus:border-transparent focus:ring-1 focus:ring-blue-500 focus:ring-offset-1"
      >
        <span
          className={
            selectedValues.length === 0 ? 'text-gray-500' : 'text-gray-900'
          }
        >
          {getDisplayText()}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="space-y-1 p-2">
            {options.length === 0 ? (
              <div className="px-2 py-1 text-sm text-gray-500">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <label
                    key={option.value}
                    data-index={index}
                    className={getItemClasses(index, isSelected)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOption(option.value)}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={isSelected ? 'text-blue-700' : 'text-gray-700'}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
