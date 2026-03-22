import React from "react";

const VARIANT_CLASSES = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const SIZE_CLASSES = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <button className={`btn ${variantClass} ${sizeClass} ${className}`} type="button" {...props}>
      {children}
    </button>
  );
}
