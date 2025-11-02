import React from "react";
import { Link } from "react-router-dom";

interface POSHeaderProps {
  storeName?: string;
  user?: { name?: string; role?: string };
  onLogout: () => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({ storeName, user, onLogout }) => (
  <header className="bg-white shadow-sm border-b border-gray-200">
    <div className="px-4 flex items-center justify-between h-16">
      {/* Left: Store Logo and Name */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">🛒</span>
        </div>
        <span className="text-xl font-bold text-gray-900 tracking-tight">{storeName || "POS System"}</span>
        <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">{user?.role}</span>
      </div>
      {/* Right: User Info and Actions */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700 hidden sm:inline">Welcome, {user?.name}</span>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
          <Link
            to="/admin"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded transition-colors"
          >
            Admin Panel
          </Link>
        )}
        <button
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-white hover:bg-red-600 font-medium px-3 py-1 rounded transition-colors border border-red-200"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);
