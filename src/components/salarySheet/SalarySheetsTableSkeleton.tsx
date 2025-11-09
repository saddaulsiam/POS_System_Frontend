import React from "react";

// Reusable skeleton row component
const SkeletonRow: React.FC = () => (
  <tr className="text-center">
    <td className="border px-4 py-2">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto h-6 w-16 animate-pulse rounded-full bg-gray-200" />
    </td>
    <td className="border px-4 py-2">
      <div className="mx-auto flex justify-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-8 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </td>
  </tr>
);

export const SalarySheetsTableSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded border bg-white shadow">
        <thead>
          <tr>
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">Month</th>
            <th className="border px-4 py-2">Year</th>
            <th className="border px-4 py-2">Base Salary</th>
            <th className="border px-4 py-2">Bonus</th>
            <th className="border px-4 py-2">Deduction</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
