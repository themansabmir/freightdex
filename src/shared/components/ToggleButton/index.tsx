import React, { useId, useState } from 'react';
import classNames from 'classnames';


export interface ToggleButtonProps {
  label: string,
  id?: string;
  disabled?: boolean;
  variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'destructive';
  size?: 'small' | 'medium' ;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  ariaLabel?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  defaultChecked = false,
  onChange,
  ariaLabel = 'Toggle button',
  disabled =false
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  const buttonClasses = classNames('toggle-button', {
    [`toggle-button--${variant}`]: variant,
    [`toggle-button--${size}`]: size,
    'toggle-button--checked': checked,
  });

  const thumbClasses = classNames('toggle-button__thumb', {
    'toggle-button__thumb--checked': checked,
  });
  const generatedId = useId();

  return (
    <div className='flex items-center gap-2 mb-4'>
      {label && (
        <label
          htmlFor={generatedId} // Link the label to the button using its ID
          className="sub_label"
        >
          {label}
        </label>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        className={buttonClasses}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className={thumbClasses} />
      </button>
    </div>
  );
};

export default ToggleButton;
