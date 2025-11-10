import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-300";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    none: "",
  };

  const style: React.CSSProperties = {
    width: width || (variant === "text" ? "100%" : undefined),
    height:
      height ||
      (variant === "text" ? "1rem" : variant === "circular" ? "3rem" : "3rem"),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

// Skeleton Card Component
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`rounded-lg bg-white p-6 shadow ${className}`}>
      <div className="space-y-4">
        <Skeleton height="1.5rem" width="60%" />
        <Skeleton height="1rem" width="40%" />
        <div className="space-y-2 pt-2">
          <Skeleton height="1rem" />
          <Skeleton height="1rem" />
          <Skeleton height="1rem" width="80%" />
        </div>
      </div>
    </div>
  );
};

// Skeleton Table Row
export const SkeletonTableRow: React.FC<{ columns?: number }> = ({
  columns = 5,
}) => {
  return (
    <tr className="border-b border-gray-200">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton height="1rem" />
        </td>
      ))}
    </tr>
  );
};

// Skeleton Table
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 5, className = "" }) => {
  return (
    <div className={`overflow-hidden rounded-lg bg-white shadow ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <Skeleton height="1rem" width="70%" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonTableRow key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Full Page Skeleton Loader
export const SkeletonLoader: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = "Loading...", className = "" }) => {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-gray-50 ${className}`}
    >
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Skeleton for Product Cards
export const SkeletonProductCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`rounded-lg bg-white p-4 shadow ${className}`}>
      <Skeleton variant="rectangular" height="12rem" className="mb-4" />
      <Skeleton height="1.25rem" width="70%" className="mb-2" />
      <Skeleton height="1rem" width="50%" className="mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton height="1.5rem" width="30%" />
        <Skeleton variant="rectangular" height="2rem" width="25%" />
      </div>
    </div>
  );
};

// Skeleton for Stats Card
export const SkeletonStatsCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`rounded-lg bg-white p-6 shadow ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton height="1rem" width="60%" className="mb-3" />
          <Skeleton height="2rem" width="40%" />
        </div>
        <Skeleton variant="circular" width="3rem" height="3rem" />
      </div>
    </div>
  );
};

// Skeleton for Product Detail Page
export const SkeletonProductDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Skeleton height="2.5rem" width="10rem" className="mb-4" />

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton height="2.5rem" width="60%" className="mb-2" />
              <Skeleton height="1.25rem" width="30%" />
            </div>
            <Skeleton variant="rectangular" width="5rem" height="2rem" />
          </div>
        </div>

        {/* Product Info Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Variants Section */}
        <SkeletonProductVariants />

        {/* Description */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <Skeleton height="1.5rem" width="30%" className="mb-3" />
          <Skeleton height="1rem" className="mb-2" />
          <Skeleton height="1rem" className="mb-2" />
          <Skeleton height="1rem" width="80%" />
        </div>
      </div>
    </div>
  );
};

// Skeleton for Product Variants Section
export const SkeletonProductVariants: React.FC = () => {
  return (
    <div className="rounded-lg bg-white shadow">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex-1">
          <Skeleton height="1.5rem" width="12rem" className="mb-2" />
          <Skeleton height="1rem" width="25rem" />
        </div>
        <Skeleton variant="rectangular" width="9rem" height="2.5rem" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <Skeleton height="1rem" width="4rem" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton height="1rem" width="3rem" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton height="1rem" width="5rem" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton height="1rem" width="5rem" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton height="1rem" width="3rem" />
              </th>
              <th className="px-6 py-3 text-left">
                <Skeleton height="1rem" width="4rem" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {[1, 2, 3].map((index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <Skeleton height="1rem" width="6rem" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton height="1rem" width="4rem" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton height="1rem" width="5rem" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton height="1rem" width="5rem" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton height="1rem" width="3rem" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Skeleton
                      variant="rectangular"
                      width="4rem"
                      height="2rem"
                    />
                    <Skeleton
                      variant="rectangular"
                      width="4rem"
                      height="2rem"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
