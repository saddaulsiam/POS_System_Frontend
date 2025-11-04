import React from "react";
import { Link } from "react-router-dom";

interface POSHeaderProps {
  storeName?: string;
  user?: { name?: string; role?: string };
  onLogout: () => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  storeName,
  user,
  onLogout,
}) => (
  <header className="border-b border-gray-200 bg-white shadow-sm">
    <div className="flex h-16 items-center justify-between px-4">
      {/* Left: Store Logo and Name */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <span className="text-2xl">🛒</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          {storeName || "POS System"}
        </span>
        <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          {user?.role}
        </span>
      </div>
      {/* Right: User Info and Actions */}
      <div className="flex items-center space-x-4">
        <span className="hidden text-sm text-gray-700 sm:inline">
          Welcome, {user?.name}
        </span>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <Link
            to="/admin"
            className="rounded px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            Admin Panel
          </Link>
        )}
        <button
          onClick={onLogout}
          className="rounded border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);
