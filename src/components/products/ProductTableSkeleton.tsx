import React from "react";

// Reusable skeleton row component
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 animate-pulse rounded-md bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </td>
    <td className="p-4">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-4">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-4">
      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
      </div>
    </td>
    <td className="p-4">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-4">
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-8 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </td>
  </tr>
);

// Reusable header skeleton component
const HeaderSkeleton: React.FC<{ width: string }> = ({ width }) => (
  <th className="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left">
    <div className={`h-4 ${width} animate-pulse rounded bg-gray-300`} />
  </th>
);

export const ProductTableSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-300" />
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <HeaderSkeleton width="w-32" />
              <HeaderSkeleton width="w-24" />
              <HeaderSkeleton width="w-20" />
              <HeaderSkeleton width="w-16" />
              <HeaderSkeleton width="w-24" />
              <HeaderSkeleton width="w-20" />
              <HeaderSkeleton width="w-28" />
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
