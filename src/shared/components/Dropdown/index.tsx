// components/MultiSelectInput.tsx
import * as Popover from "@radix-ui/react-popover";
import React, { useEffect, useMemo, useRef } from "react";
import TextField from "../TextField";
import Badge from "../Tags";
import Checkbox from "../CheckBox";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectInputProps {
  options: Option[];
  disabled?: boolean;
  selectedValues: string[];
  name: string;
  onSelect: (val: string) => void;
  inputValue: string;
  onInputChange: (val: string) => void;
  placeholder?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  label: string
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  options,
  selectedValues,
  onSelect,
  inputValue,
  onInputChange,
  placeholder = "Select...",
  isOpen,
  name,
  setIsOpen,
  label,
  disabled
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const filteredAndSortedOptions = useMemo(() => {
    return options
      .filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      .sort((a, b) => {
        const aSel = selectedValues.includes(a.value);
        const bSel = selectedValues.includes(b.value);
        return aSel === bSel ? 0 : aSel ? -1 : 1;
      });
  }, [options, inputValue, selectedValues]);

  return (
    <Popover.Root open={isOpen} onOpenChange={disabled ? () => { }  : setIsOpen}>
      <Popover.Trigger asChild>
        <div className='multiselect__wrapper'>
          <TextField
            type='text'
            inputRef={inputRef}
            label={label}
            name={name}
            disabled={disabled}
            prefixIcon={
              selectedValues.length > 0 && (
                <Badge
                  variant='primary'
                  id='1'
                  tagType='chip'
                  shape='ellipse'
                  label={`${selectedValues.length} selected`}
                />
              )
            }
            value={inputValue}
            onChange={(e) => {
              onInputChange(e.target.value);
              setIsOpen(true);
            }}
            style={{ paddingLeft: selectedValues.length > 0 ? "90px" : "0" }}
            placeholder={selectedValues.length > 0 ? "" : placeholder}
          />
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content align='start' side='bottom'>
          <div className='multiselect__options'>
            {filteredAndSortedOptions.length > 0 ? (
              filteredAndSortedOptions.map((item) => {
                return (
                  <div
                    onClick={() => onSelect(item.value)}
                    key={item.value}
                    className='multiselect__option-item'
                    style={{ display: "flex", margin: "4px 0", gap: "2px" }}
                  >
                    <Checkbox
                      checked={selectedValues.includes(item.value)}
                      onChange={() => {}}
                    />
                    {item.label}
                  </div>
                );
              })
            ) : (
              <>No Option</>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default MultiSelectInput;
