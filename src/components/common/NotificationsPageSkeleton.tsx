import React from "react";

const NotificationCardSkeleton: React.FC = () => (
  <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-all duration-150 md:flex-row md:items-center">
    <div className="mb-3 flex items-center md:mb-0">
      <div className="mr-4 h-12 w-12 animate-pulse rounded-full bg-gray-200" />
      <div className="flex-1">
        <div className="mb-2 h-5 w-48 animate-pulse rounded bg-gray-300" />
        <div className="h-4 w-64 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
    </div>
  </div>
);

export const NotificationsPageSkeleton: React.FC = () => {
  return (
    <div className="grid gap-4">
      {[...Array(6)].map((_, index) => (
        <NotificationCardSkeleton key={index} />
      ))}
    </div>
  );
};
