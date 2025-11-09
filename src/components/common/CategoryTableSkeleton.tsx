import React from "react";

// Reusable skeleton row component
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-gray-200 hover:bg-gray-50">
    <td className="whitespace-nowrap px-6 py-4">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-right">
      <div className="flex justify-end gap-4">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
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

export const CategoryTableSkeleton: React.FC = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <HeaderSkeleton width="w-24" align="left" />
            <HeaderSkeleton width="w-28" align="right" />
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
