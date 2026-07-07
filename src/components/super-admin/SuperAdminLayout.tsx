import { LogOut } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../common";

const adminLinks = [
  {
    to: "/super-admin",
    label: "Overview",
    icon: "📊",
  },
  {
    to: "/super-admin/stores",
    label: "Store Tenants",
    icon: "🏢",
  },
  {
    to: "/super-admin/subscriptions",
    label: "Subscriptions",
    icon: "🔁",
  },
  {
    to: "/super-admin/payments",
    label: "Billing & Payments",
    icon: "💳",
  },
  {
    to: "/super-admin/broadcast",
    label: "Broadcaster",
    icon: "📢",
  },
  {
    to: "/super-admin/promo",
    label: "Promo Codes",
    icon: "🎟️",
  },
];

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 text-gray-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-inner">
            🛡️
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-wider text-gray-900">
              Smart POS System
            </h1>
            <p className="text-xs font-medium text-gray-500">
              SaaS PLATFORM CONTROL CENTER
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="text-xs font-semibold text-gray-500">
              Global Administrator
            </p>
          </div>
          {/* <div className="h-8 w-px bg-gray-200" /> */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="md"
            className="flex items-center justify-center border-red-300 text-red-600 hover:bg-red-100 focus:ring-red-400"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white shadow-xl transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="text-xs">{isCollapsed ? "→" : "←"}</span>
          </button>

          {/* Navigation Links */}
          <nav className="flex h-full flex-col justify-between p-3">
            <div className="flex flex-col gap-1.5">
              <div className="text-4xs mb-2 px-3 py-1 font-bold uppercase tracking-widest text-gray-400">
                {!isCollapsed && "System Admin"}
              </div>
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? link.label : ""}
                  >
                    <span className="flex-shrink-0 text-xl">{link.icon}</span>
                    {!isCollapsed && (
                      <span className="whitespace-nowrap">{link.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Settings - Bottom Section */}
            {user?.role === "SUPER_ADMIN" && (
              <div className="mb-2">
                <div className="mb-2 border-t border-gray-200"></div>
                <Link
                  to="/super-admin/settings"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    location.pathname === "/super-admin/settings"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Settings" : ""}
                >
                  <span className="flex-shrink-0 text-xl">⚙️</span>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap">Settings</span>
                  )}
                </Link>
              </div>
            )}
          </nav>
        </aside>

        {/* Sidebar Spacer */}
        <div
          className={`${
            isCollapsed ? "w-16" : "w-64"
          } flex-shrink-0 transition-all duration-300`}
        />

        {/* Content Outlet */}
        <main className="min-h-[calc(100vh-4rem)] flex-1 overflow-x-hidden p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
