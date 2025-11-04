import React from "react";
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "default" | "icon-only";
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  variant = "default",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed";

  const iconOnlyClasses =
    "inline-flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";

  const finalClasses = variant === "icon-only" ? iconOnlyClasses : baseClasses;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${finalClasses} ${className}`}
      title="Refresh"
      type="button"
    >
      <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
      {variant === "default" && <span>Refresh</span>}
    </button>
  );
};
