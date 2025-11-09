import React from "react";

export const AdminDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-300" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-gradient-to-br from-white to-gray-50 p-6 shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
              </div>
              <div className="mb-2 h-10 w-28 animate-pulse rounded bg-gray-300" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-6 h-8 w-40 animate-pulse rounded bg-gray-300" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 flex justify-center">
                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
              </div>
              <div className="mx-auto h-5 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 h-7 w-40 animate-pulse rounded bg-gray-300" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-gray-200 p-3"
              >
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 h-7 w-48 animate-pulse rounded bg-gray-300" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />
                  <div>
                    <div className="mb-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-6 h-7 w-56 animate-pulse rounded bg-gray-300" />
        <div className="h-80 w-full animate-pulse rounded bg-gray-200" />
      </div>

      {/* Top Products & Recent Sales */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 h-7 w-40 animate-pulse rounded bg-gray-300" />
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[...Array(3)].map((_, j) => (
                      <th key={j} className="px-4 py-3">
                        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, j) => (
                    <tr key={j} className="border-b border-gray-100">
                      <td className="px-4 py-3">
                        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
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
        ))}
      </div>
    </div>
  );
};
