import { LogOut } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "../common";

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
        <span className="hidden text-sm font-medium text-gray-700 sm:inline">
          Welcome, {user?.name}
        </span>
        {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
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
