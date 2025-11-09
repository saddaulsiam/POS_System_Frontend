import React, { useState } from "react";
import { Button } from "../components/common";
import { NotificationsPageSkeleton } from "../components/common/NotificationsPageSkeleton";
import { useMarkAsRead, useNotifications } from "../services/queries";

const NotificationsPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useNotifications({ page, limit: 10 });
  const notifications = data?.data || [];
  const totalPages = data?.pagination?.pages || 1;

  const markAsRead = useMarkAsRead();

  // Mark all as read handler
  const handleMarkAllAsRead = async () => {
    await Promise.all(
      notifications
        .filter((n: any) => !n.isRead)
        .map((n: any) => markAsRead.mutateAsync(n.id)),
    );
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="sticky top-0 z-10 mb-6 flex items-center justify-between rounded-xl bg-blue-50/80 px-6 pb-5 pt-4 shadow-sm">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-blue-700">
          <span className="text-3xl">🔔</span>
          Alerts & Notifications
        </h1>
        {notifications.some((n: any) => !n.isRead) && (
          <Button
            size="sm"
            onClick={handleMarkAllAsRead}
            className="rounded-full bg-blue-600 px-5 py-2 text-base text-white shadow hover:bg-blue-700"
          >
            Mark All as Read
          </Button>
        )}
      </div>
      {isLoading ? (
        <NotificationsPageSkeleton />
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        <>
          <div className="grid gap-4">
            {notifications.map((n: any) => (
              <div
                key={n.id}
                className={`flex flex-col justify-between rounded-xl border bg-white px-5 py-4 shadow-sm transition-all duration-150 md:flex-row md:items-center ${
                  !n.isRead ? "border-blue-400 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-2xl">
                    {n.type === "low_stock" && "⚠️"}
                    {n.type === "high_stock" && "📦"}
                    {n.type === "expiry" && "⏰"}
                    {n.type === "inactive" && "🚫"}
                    {![
                      "low_stock",
                      "high_stock",
                      "expiry",
                      "inactive",
                    ].includes(n.type) && "🔔"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {n.type === "low_stock" && "Low Stock Alert"}
                      {n.type === "high_stock" && "High Stock Alert"}
                      {n.type === "expiry" && "Expiry Alert"}
                      {n.type === "inactive" && "Inactive Product Alert"}
                      {![
                        "low_stock",
                        "high_stock",
                        "expiry",
                        "inactive",
                      ].includes(n.type) && n.type}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {n.message}
                    </div>
                    {n.product && (
                      <div className="mt-1 text-xs text-gray-400">
                        Product: {n.product.name}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {!n.isRead && (
                  <div className="mt-3 flex-shrink-0 md:ml-4 md:mt-0">
                    <Button
                      size="sm"
                      className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white shadow hover:bg-blue-700"
                      onClick={() => markAsRead.mutate(n.id)}
                    >
                      Mark as Read
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              className="rounded bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="rounded bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
