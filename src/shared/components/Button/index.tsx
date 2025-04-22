import React from 'react';
import classNames from 'classnames';
import { ButtonType, ButtonVariant , ButtonProps} from './Button.types';


const buttonProperties: Record<ButtonType, Record<ButtonVariant, string>> = {
  solid: {
    neutral: `DS__btn__solid DS__btn--neutral`,
    primary: `DS__btn__solid DS__btn--primary`,
    success: `DS__btn__solid DS__btn--success`,
    warning: `DS__btn__solid DS__btn--warning`,
    destructive: `DS__btn__solid DS__btn--destructive`,
  },
  ghost: {
    neutral: `DS__btn__ghost DS__btn--neutral`,
    primary: `DS__btn__ghost DS__btn--primary`,
    success: `DS__btn__ghost DS__btn--success`,
    warning: `DS__btn__ghost DS__btn--warning`,
    destructive: `DS__btn__ghost DS__btn--destructive`,
  },
  outline: {
    neutral: `DS__btn__outline DS__btn--neutral`,
    primary: `DS__btn__outline DS__btn--primary`,
    success: `DS__btn__outline DS__btn--success`,
    warning: `DS__btn__outline DS__btn--warning`,
    destructive: `DS__btn__outline DS__btn--destructive`,
  },
  link: {
    neutral: `DS__btn__link DS__btn--neutral`,
    primary: `DS__btn__link DS__btn--primary`,
    success: `DS__btn__link DS__btn--success`,
    warning: `DS__btn__link DS__btn--warning`,
    destructive: `DS__btn__link DS__btn--destructive`,
  },
};

export const Button: React.FC<ButtonProps> = ({
  isIcon = false,
  variant = 'primary',
  type = 'solid',
  size = 'small',
  shape = 'elipse',
  isLoading = false,
  disabled = false,
  addClass,
  fullwidth = false,
  icon,
  onClick,
  children,
  ...props
}) => {


  const buttonClass = classNames(
    addClass,
    `DS__btn DS__btn--${size}`,

    `DS__btn--${shape}`,
    {
      'DS__btn--circle--small' : isIcon === true  && 'small' === size,
      'DS__btn--circle--medium' : isIcon === true  && 'medium' === size,
      'DS__btn--circle--large': isIcon === true && 'large' === size,
      'DS__btn--fullwidth' : fullwidth,
      'DS__btn--loading': isLoading,
      'DS__btn--disabled': disabled || isLoading,
      [buttonProperties[type][variant]]: true,
    }
  );

  const handleClickWrapper = (event: React.MouseEvent<HTMLButtonElement>)=>{
    event.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  }
  if (isIcon && !icon) {
    return 'Please pass svg Icon if isIcon is true'
  }
  return (
    <div className={''}>
      <button
        onClick={handleClickWrapper}
        className={buttonClass}
        disabled={disabled || isLoading}
        {...props}
      >
        {' '}
        {isLoading ? (
          <span className="DS__btn__loader"></span>
        ) : isIcon && icon ? (
          <span className="DS__btn__icon">{icon}</span>
        ) : (
          children
        )}
      </button>
    </div>
  );
};

export default Button;
