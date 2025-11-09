import React from "react";

// Reusable skeleton row component
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="whitespace-nowrap px-6 py-4">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="whitespace-nowrap px-6 py-4">
      <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-right">
      <div className="flex justify-end gap-4">
        <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-14 animate-pulse rounded bg-gray-200" />
      </div>
    </td>
  </tr>
);

// Reusable header skeleton component
const HeaderSkeleton: React.FC<{ width: string; align?: "left" | "right" }> = ({
  width,
  align = "left",
}) => (
  <th
    className={`px-6 py-3 text-${align} text-xs font-medium uppercase tracking-wider text-gray-500`}
  >
    <div className={`h-3 ${width} animate-pulse rounded bg-gray-300`} />
  </th>
);

export const SuppliersTableSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <HeaderSkeleton width="w-32" align="left" />
            <HeaderSkeleton width="w-32" align="left" />
            <HeaderSkeleton width="w-20" align="left" />
            <HeaderSkeleton width="w-24" align="left" />
            <HeaderSkeleton width="w-28" align="left" />
            <HeaderSkeleton width="w-24" align="right" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {[...Array(8)].map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
