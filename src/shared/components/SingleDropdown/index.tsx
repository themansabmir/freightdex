// components/Dropdown.tsx
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import TextField  from '../TextField'; // Assuming TextField is correctly imported

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value: string | null;
  onChange: (val: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  name?: string;
  searchable?: boolean;
  required?: boolean;
  errorText?: string;
  isError?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  label,
  isError,
  errorText,
  required = true,
  searchable = false,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref to store option elements

  const modifiedOptions = [{ label: 'None', value: '' }, ...options];

  const selectedOption = modifiedOptions.find((o) => o.value === value);
  const filteredOptions = searchable
    ? modifiedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : modifiedOptions;

  // Focus the search input or the first option when the popover opens
  useEffect(() => {
    if (open) {
      if (searchable && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 0);
      } else if (!searchable && filteredOptions.length > 0) {
        const selectedIndex = filteredOptions.findIndex(
          (option) => option.value === value
        );
        const focusIndex = selectedIndex !== -1 ? selectedIndex : 0;
        setTimeout(() => optionRefs.current[focusIndex]?.focus(), 0);
      }
    }
  }, [open, searchable, filteredOptions, value]);

  // Helper function to focus an option by index
  const focusOption = (index: number) => {
    if (optionRefs.current[index]) {
      optionRefs.current[index]?.focus();
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' && !open) {
      e.preventDefault(); // Prevent default scroll behavior
      setOpen(true);
    }
  };

  const handleOptionKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (index < filteredOptions.length - 1) {
          focusOption(index + 1);
        } else {
          focusOption(0); // Wrap around to the first option
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          focusOption(index - 1);
        } else if (searchable && inputRef.current) {
          // If at the top option and searchable, move focus to search input
          inputRef.current.focus();
        } else {
          focusOption(filteredOptions.length - 1); // Wrap around to the last option
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onChange(filteredOptions[index].value);
        setOpen(false);
        setInputValue('');
        break;
      case 'Escape':
      case 'Tab':
        e.preventDefault();
        setOpen(false);
        setInputValue('');
        break;
      default:
        break;
    }
  };

  const handleSearchInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
      e.preventDefault();
      focusOption(0); // Move focus to the first option
    }
    // Optionally, you might want to handle other keys for the search input here,
    // like Enter to select the currently hovered (though not visually indicated) or first option.
  };


  return (
    <div>
      {label && (
        <label className="dropdown__trigger__label">
          {label} {required && <span className="label__required">*</span>}
        </label>
      )}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={`${disabled ? 'dropdown__trigger--disabled' : ''} dropdown__trigger dropdown__trigger__container `}
            disabled={disabled}
            type="button"
            onKeyDown={handleTriggerKeyDown}
          >
            {selectedOption?.label ? (
              <span className="dropdown__selected">{selectedOption.label}</span>
            ) : (
              <span className="dropdown__placeholder"> {placeholder}</span>
            )}
            <ChevronsUpDown size={18} />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          {!disabled && (
            <Popover.Content align="start" side="bottom" className="dropdown__content">
              {searchable && (
                <TextField
                  inputRef={inputRef}
                  value={inputValue}
                  showClear={false}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                  onKeyDown={handleSearchInputKeyDown}
                  name="search"
                  placeholder="Search..."
                  className="dropdown__search"
                />
              )}

              <div className="dropdown__options">
                {filteredOptions.length > 0 && !disabled ? (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      role="option"
                      aria-selected={value === option.value}
                      tabIndex={0}
                      className={`dropdown__option ${value === option.value ? 'selected' : ''}`}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                        setInputValue('');
                      }}
                      onKeyDown={(e) => handleOptionKeyDown(e, index)}
                    >
                      <span>{option.label}</span>
                      {value === option.value && <Check size={18} />}
                    </div>
                  ))
                ) : (
                  <div className="dropdown__option empty">No options found</div>
                )}
              </div>
            </Popover.Content>
          )}
        </Popover.Portal>
      </Popover.Root>
      {isError && errorText && <div className="textField__error-text">{errorText}</div>}
    </div>
  );
};

export default Dropdown;