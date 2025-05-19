import React from "react";
import classNames from "classnames";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical"; // default = vertical
  gap?: string; // e.g., "1rem", "8px", etc.
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export const Stack: React.FC<StackProps> = ({
  direction = "vertical",
  gap,
  align = "stretch",
  justify = "start",
  className,
  children,
  ...rest
}) => {
  const classes = classNames(
    "stack",
    direction === "horizontal" ? "hstack" : "vstack",
    `align-${align}`,
    `justify-${justify}`,
    className
  );

  return (
    <div className={classes} style={{ gap }} {...rest}>
      {children}
    </div>
  );
};
