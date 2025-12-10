import { RefreshCw } from "lucide-react";
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(() => {
  return (
    <div className="flex h-screen items-center justify-center">
      <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;
