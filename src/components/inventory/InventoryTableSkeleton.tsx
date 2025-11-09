import React from "react";

// Reusable skeleton row component
const SkeletonRow: React.FC = () => (
  <tr className="align-middle transition-colors hover:bg-blue-50">
    <td className="w-16 px-3 py-2">
      <div className="h-12 w-12 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="min-w-[120px] px-3 py-2">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="min-w-[80px] px-3 py-2">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="min-w-[60px] px-3 py-2">
      <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="min-w-[90px] px-3 py-2">
      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
    </td>
    <td className="min-w-[120px] px-3 py-2">
      <div className="flex gap-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </td>
  </tr>
);

export const InventoryTableSkeleton: React.FC = () => {
  return (
    <table className="min-w-full overflow-hidden rounded-lg border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="w-16 px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Image
          </th>
          <th className="min-w-[120px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Name
          </th>
          <th className="min-w-[80px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            SKU
          </th>
          <th className="min-w-[60px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Stock
          </th>
          <th className="min-w-[90px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Status
          </th>
          <th className="min-w-[120px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(8)].map((_, index) => (
          <SkeletonRow key={index} />
        ))}
      </tbody>
    </table>
  );
};
