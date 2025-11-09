import React from "react";

export const SettingsPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="mb-2 h-9 w-64 animate-pulse rounded bg-gray-300" />
              <div className="h-5 w-96 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="text-right">
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-300" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 h-6 w-56 animate-pulse rounded bg-gray-300" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 h-6 w-44 animate-pulse rounded bg-gray-300" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="h-6 w-12 animate-pulse rounded-full bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 h-6 w-52 animate-pulse rounded bg-gray-300" />
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 w-44 animate-pulse rounded bg-gray-200" />
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <div className="h-11 w-24 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-11 w-32 animate-pulse rounded-lg bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
