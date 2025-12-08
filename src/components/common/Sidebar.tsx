import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: "🏠",
    roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER", "STAFF"],
  },
  {
    to: "/products",
    label: "Products",
    icon: "📦",
    roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER", "STAFF"],
  },
  {
    to: "/categories",
    label: "Categories",
    icon: "🗂️",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/suppliers",
    label: "Suppliers",
    icon: "🏪",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/inventory",
    label: "Inventory",
    icon: "📋",
    roles: ["OWNER", "ADMIN", "MANAGER", "STAFF"],
  },
  {
    to: "/purchase-orders",
    label: "Purchase Orders",
    icon: "📋",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/cash-drawer",
    label: "Cash Drawer",
    icon: "💵",
    roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"],
  },
  {
    to: "/sales",
    label: "Sales",
    icon: "💰",
    roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"],
  },
  {
    to: "/reports",
    label: "Reports",
    icon: "📊",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: "📈",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/loyalty-admin",
    label: "Loyalty Program",
    icon: "🎁",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/employees",
    label: "Employees",
    icon: "👥",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/salary-sheets",
    label: "Salary Sheets",
    icon: "💵",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
  {
    to: "/customers",
    label: "Customers",
    icon: "🧑‍🤝‍🧑",
    roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"],
  },
  {
    to: "/audit-logs",
    label: "Audit Logs",
    icon: "📜",
    roles: ["OWNER", "ADMIN", "MANAGER"],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredLinks = navLinks.filter(
    (link) => !link.roles || link.roles.includes(user?.role || ""),
  );

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-4 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md hover:bg-gray-100"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-xs">{isCollapsed ? "→" : "←"}</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex h-full flex-col overflow-y-auto p-3">
          {/* Main Navigation */}
          <div className="flex flex-1 flex-col gap-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                } ${isCollapsed ? "justify-center" : ""} `}
                title={isCollapsed ? link.label : ""}
              >
                <span className="flex-shrink-0 text-xl">{link.icon}</span>
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{link.label}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Settings - Bottom Section */}
          {(user?.role === "OWNER" ||
            user?.role === "ADMIN" ||
            user?.role === "MANAGER") && (
            <>
              <div className="my-2 border-t border-gray-200"></div>
              <Link
                to="/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/settings"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
                title={isCollapsed ? "Settings" : ""}
              >
                <span className="flex-shrink-0 text-xl">⚙️</span>
                {!isCollapsed && (
                  <span className="whitespace-nowrap">Settings</span>
                )}
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Spacer for content */}
      <div
        className={`${isCollapsed ? "w-16" : "w-64"} flex-shrink-0 transition-all duration-300`}
      />
    </>
  );
};

export default Sidebar;
