import React from "react";

const SkeletonRow: React.FC = () => (
  <tr className="hover:bg-gray-50">
    <td className="px-4 py-3">
      <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3 text-right">
      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3 text-right">
      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3 text-right">
      <div className="ml-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-4 py-3 text-center">
      <div className="mx-auto h-6 w-16 animate-pulse rounded-full bg-gray-200" />
    </td>
  </tr>
);

export const CashDrawerTableSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Employee
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Opened
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Closed
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
              Opening
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
              Closing
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
              Difference
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(6)].map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
