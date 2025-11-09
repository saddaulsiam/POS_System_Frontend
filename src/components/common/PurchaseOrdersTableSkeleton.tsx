import React from "react";

const SkeletonRow: React.FC = () => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="px-6 py-4 text-center">
      <div className="mx-auto h-6 w-24 animate-pulse rounded-full bg-gray-200" />
    </td>
    <td className="px-6 py-4 text-right">
      <div className="ml-auto flex justify-end gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 w-8 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    </td>
  </tr>
);

export const PurchaseOrdersTableSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
              PO #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Supplier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Order Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
              Expected Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
              Total Amount
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(8)].map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
