import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNotifications, useMarkAsRead } from "../../services/queries";
import { Bell } from "lucide-react";

const NotificationBell: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications using React Query
  const { data: notificationsData, isLoading: loading } = useNotifications();
  const notifications = notificationsData?.data || [];
  const markAsRead = useMarkAsRead();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative rounded-full p-2 hover:bg-blue-100 focus:outline-none"
        aria-label="Notifications"
        onClick={() => setDropdownOpen((open) => !open)}
      >
        <span className="text-xl">
          <Bell className="text-gray-700" />
        </span>
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b p-3 font-semibold text-gray-700">
            Alerts & Notifications
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((n: any) => (
                <div
                  key={n.id}
                  className={`border-b px-4 py-3 last:border-b-0 ${!n.isRead ? "bg-blue-50" : ""}`}
                >
                  <div className="font-medium text-gray-800">
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
                  <div className="text-sm text-gray-600">{n.message}</div>
                  {n.product && (
                    <div className="mt-1 text-xs text-gray-400">
                      Product: {n.product.name}
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                  {!n.isRead && (
                    <button
                      className="mt-2 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                      onClick={() => markAsRead.mutate(n.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <Link
            to="/notifications"
            className="flex w-full items-center justify-center gap-1 rounded-b-lg border-t border-gray-200 bg-transparent px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            <span className="text-base">📋</span>
            <span>All notifications</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
