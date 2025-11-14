import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import NotificationBell from "./NotificationBell";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <span className="text-2xl">🛒</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            {settings?.storeName || "POS System"}
          </span>
          <Badge size="sm" variant="info">
            {user?.role}
          </Badge>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          <NotificationBell />

          {/* User Name */}
          <span className="hidden text-sm font-medium text-gray-700 md:inline-flex">
            {user?.name}
          </span>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 sm:flex">
            <Link to="/">
              <Button>POS Terminal</Button>
            </Link>
            <Button
              onClick={logout}
              variant="ghost"
              size="md"
              className="flex items-center justify-center border-red-300 text-red-600 hover:bg-red-100 focus:ring-red-400"
            >
              Logout
              <LogOut className="ml-1.5 size-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100 focus:outline-none"
              aria-label="Open menu"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                  onClick={() => setMenuOpen(false)}
                >
                  🏪 POS Terminal
                </Link>
                <Button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  variant="ghost"
                  size="md"
                  className="flex items-center justify-center border-red-300 text-red-600 hover:bg-red-100 focus:ring-red-400"
                >
                  Logout
                  <LogOut className="ml-1.5 size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
