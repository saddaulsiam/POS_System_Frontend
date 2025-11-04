import React from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default"
  | "primary";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  rounded?: boolean;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  rounded = false,
  dot = false,
}) => {
  const baseStyles = "inline-flex items-center font-medium";

  const variantStyles: Record<BadgeVariant, string> = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    primary: "bg-blue-600 text-white",
    default: "bg-gray-100 text-gray-800",
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const roundedStyle = rounded ? "rounded-full" : "rounded";

  const dotColorStyles: Record<BadgeVariant, string> = {
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
    info: "bg-blue-600",
    primary: "bg-white",
    default: "bg-gray-600",
  };

  const combinedClassName =
    `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyle} ${className}`.trim();

  return (
    <span className={combinedClassName}>
      {dot && (
        <span
          className={`mr-1.5 h-2 w-2 rounded-full ${dotColorStyles[variant]}`}
        />
      )}
      {children}
    </span>
  );
};
