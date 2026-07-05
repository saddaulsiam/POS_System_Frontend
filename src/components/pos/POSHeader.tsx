import { LogOut } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "../common";

interface POSHeaderProps {
  storeName?: string;
  user?: { name?: string; role?: string };
  onLogout: () => void;
  pendingSyncCount?: number;
  onSync?: () => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  storeName,
  user,
  onLogout,
  pendingSyncCount = 0,
  onSync,
}) => (
  <header className="h-16 border-b border-gray-200 bg-white shadow-sm">
    <div className="flex h-full items-center justify-between px-4">
      {/* Left: Store Logo and Name */}
      <div className="flex items-center justify-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <span className="text-2xl">🛒</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">
          {storeName || "POS System"}
        </span>
        <Badge size="sm" variant="info">
          {user?.role}
        </Badge>
      </div>

      {/* Right: User Info and Actions */}
      <div className="flex items-center space-x-4">
        {/* Sync Status Badge */}
        <div className="flex items-center">
          {pendingSyncCount > 0 && (
            <button
              onClick={onSync}
              className="flex items-center space-x-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200 shadow-sm transition-all hover:bg-amber-100 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 animate-pulse cursor-pointer"
              title="Click to sync offline sales to server"
            >
              <span className="text-xs">🔄</span>
              <span>{pendingSyncCount} Pending Sync</span>
            </button>
          )}
        </div>
        <span className="hidden text-sm font-medium text-gray-700 sm:inline">
          Welcome, {user?.name}
        </span>
        {(user?.role === "OWNER" ||
          user?.role === "ADMIN" ||
          user?.role === "MANAGER") && (
            <Link to="/admin">
              <Button>Admin Panel</Button>
            </Link>
          )}
        <Button
          onClick={onLogout}
          variant="ghost"
          size="md"
          className="flex items-center justify-center border-red-300 text-red-600 hover:bg-red-100 focus:ring-red-400"
        >
          Logout
          <LogOut className="ml-1.5 size-4" />
        </Button>
      </div>
    </div>
  </header>
);
