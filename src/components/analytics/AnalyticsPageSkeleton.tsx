import React from "react";

export const AnalyticsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 h-8 w-48 animate-pulse rounded bg-gray-300" />
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-4 flex gap-2 md:mt-0">
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
              </div>
              <div className="mb-1 h-8 w-32 animate-pulse rounded bg-gray-300" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-300" />
              <div className="h-64 w-full animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Top Products Table */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-300" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
