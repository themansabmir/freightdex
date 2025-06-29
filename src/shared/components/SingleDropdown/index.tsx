// components/Dropdown.tsx
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '..';

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
  const modifiedOptions = [{ label: 'None', value: '' }, ...options];

  const selectedOption = modifiedOptions.find((o) => o.value === value);
  const filteredOptions = searchable ? modifiedOptions.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase())) : modifiedOptions;

  useEffect(() => {
    if (open && inputRef.current && searchable) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, searchable]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div>
          <label className="dropdown__trigger__label">
            {label} {required && <span className="label__required">*</span>}
          </label>
          <button
            className={`${disabled ? 'dropdown__trigger--disabled' : ''} dropdown__trigger dropdown__trigger__container `}
            // style={{ background: disabled ? '#d5d7da' : '#fff' }}
            disabled={disabled}
            type="button"
          >
            {selectedOption?.label ? (
              <span className="dropdown__selected">{selectedOption.label}</span>
            ) : (
              <span className="dropdown__placeholder"> {placeholder}</span>
            )}
            {/* {selectedOption ? selectedOption.label : placeholder} */}
            <ChevronsUpDown size={18} />
          </button>
          {isError && errorText && <div className="textField__error-text">{errorText}</div>}
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        {!disabled && (
          <Popover.Content align="start" side="bottom" className="dropdown__content">
            {searchable && (
              <TextField
                inputRef={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                name="search"
                placeholder="Search..."
                className="dropdown__search"
              />
            )}

            <div className="dropdown__options">
              {filteredOptions.length > 0 && !disabled ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown__option ${value === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setInputValue(''); // reset search
                    }}
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
  );
};

export default Dropdown;
