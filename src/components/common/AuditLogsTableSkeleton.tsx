import React from "react";

// Reusable skeleton row component
const SkeletonRow: React.FC = () => (
  <tr className="border-b transition hover:bg-blue-50">
    <td className="p-2">
      <div className="mx-auto h-4 w-12 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-28 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-200" />
    </td>
    <td className="p-2">
      <div className="mx-auto h-8 w-16 animate-pulse rounded bg-gray-200" />
    </td>
  </tr>
);

export const AuditLogsTableSkeleton: React.FC = () => {
  return (
    <>
      {[...Array(10)].map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </>
  );
};
