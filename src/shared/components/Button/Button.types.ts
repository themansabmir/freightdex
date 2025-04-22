export type ButtonType = "solid" | "ghost" | "outline" | "link";
export type ButtonVariant =| "primary"| "success" | "destructive"| "warning"| "neutral";
export type ButtonSize = "small" | "medium" | "large";
type ButtonShape = "rounded" | "rectangle" | "elipse";


export interface ButtonProps {
  type?: ButtonType;
  isIcon?: boolean;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  disabled?: boolean;
  isLoading?: boolean;
  addClass?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode | string;
  btnType?: "button" | "submit";
  fullwidth?: boolean;
}
