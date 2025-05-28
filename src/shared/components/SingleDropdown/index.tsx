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
  onChange: (val: string) => void;
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
  name,
  isError,
  errorText,
  required = true,
  searchable = false,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = searchable ? options.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase())) : options;

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
          <button className="dropdown__trigger dropdown__trigger__container" disabled={disabled} type="button">
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronsUpDown size={18} />
          </button>
          {isError && errorText && (
            <div  className="textField__error-text">
              {errorText}
            </div>
          )}
        </div>
      </Popover.Trigger>

      <Popover.Portal>
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
            {filteredOptions.length > 0 ? (
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
      </Popover.Portal>
    </Popover.Root>
  );
};

export default Dropdown;
