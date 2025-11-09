import React from "react";

export const LoyaltyAdminPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-300" />
          <div className="h-4 w-96 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg bg-white p-6 shadow">
              <div className="mb-2 h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-300" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-32 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>

        {/* Tiers Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-300" />
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border-2 border-gray-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-16 animate-pulse rounded-full bg-gray-200" />
                </div>
                <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="mb-4 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offers Table */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-300" />
            <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {[...Array(6)].map((_, i) => (
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
                      <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                        <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
                      </div>
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
