import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import NotificationBell from "./NotificationBell";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-700 sm:text-2xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-lg text-white sm:h-10 sm:w-10 sm:text-xl">
              🛒
            </span>
            <span className="hidden sm:inline">
              {settings?.storeName || "POS System"}
            </span>
            <span className="sm:hidden">POS</span>
          </span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          {/* User Role Badge */}
          <span className="hidden rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 sm:inline-flex">
            {user?.role}
          </span>

          {/* User Name */}
          <span className="hidden text-sm font-medium text-gray-700 md:inline-flex">
            {user?.name}
          </span>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
            >
              POS Terminal
            </Link>
            <button
              onClick={logout}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-red-300 hover:text-red-600"
            >
              Logout
            </button>
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
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
