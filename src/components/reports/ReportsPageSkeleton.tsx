import React from "react";

export const ReportsPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Daily Sales Card */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 h-6 w-40 animate-pulse rounded bg-gray-300" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-32 animate-pulse rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Sales Range Card */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-300" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-28 animate-pulse rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Employee Performance */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 h-6 w-56 animate-pulse rounded bg-gray-300" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {[...Array(4)].map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Performance */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-300" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {[...Array(4)].map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <div className="h-4 w-36 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
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

      {/* Inventory Summary */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 h-6 w-44 animate-pulse rounded bg-gray-300" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4">
              <div className="mb-2 h-4 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-8 w-20 animate-pulse rounded bg-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
