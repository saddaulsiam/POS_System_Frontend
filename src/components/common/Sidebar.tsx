import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// --- SVG Icon Components ---
const Icon = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Products: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M20 7l-8-4-8 4m16 0v10l-8 4m0-14v14M4 7v10l8 4" />
    </svg>
  ),
  Categories: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  Suppliers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Inventory: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  PurchaseOrders: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  CashDrawer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  ),
  Sales: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
    </svg>
  ),
  Reports: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Analytics: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Loyalty: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Employees: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  Salary: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  Customers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  AuditLogs: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-[18px] w-[18px]">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// --- Nav structure with groups and subItems ---
type SubItem = { to: string; label: string };
type NavItem = {
  label: string;
  icon: any;
  color: string;
  bg: string;
  roles: string[];
  to?: string;
  subItems?: SubItem[];
};
type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: Icon.Dashboard, color: "text-violet-500", bg: "bg-violet-50", roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER", "STAFF"] }
    ]
  },
  {
    label: "Catalog",
    items: [
      {
        label: "Products",
        icon: Icon.Products,
        color: "text-blue-500",
        bg: "bg-blue-50",
        roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER", "STAFF"],
        subItems: [
          { to: "/products", label: "Product List" },
          { to: "/products/create", label: "Add Product" },
          { to: "/products/brands", label: "Brands" },
          { to: "/products/units", label: "Units" }
        ]
      },
      { to: "/categories", label: "Categories", icon: Icon.Categories, color: "text-cyan-500", bg: "bg-cyan-50", roles: ["OWNER", "ADMIN", "MANAGER"] },
      { to: "/suppliers", label: "Suppliers", icon: Icon.Suppliers, color: "text-teal-500", bg: "bg-teal-50", roles: ["OWNER", "ADMIN", "MANAGER"] }
    ]
  },
  {
    label: "Operations",
    items: [
      { to: "/inventory", label: "Inventory", icon: Icon.Inventory, color: "text-amber-500", bg: "bg-amber-50", roles: ["OWNER", "ADMIN", "MANAGER", "STAFF"] },
      { to: "/purchase-orders", label: "Purchase Orders", icon: Icon.PurchaseOrders, color: "text-orange-500", bg: "bg-orange-50", roles: ["OWNER", "ADMIN", "MANAGER"] },
      { to: "/barcode-print", label: "Print Barcode", icon: Icon.Products, color: "text-indigo-500", bg: "bg-indigo-50", roles: ["OWNER", "ADMIN", "MANAGER"] },
    ]
  },
  {
    label: "Finance & Sales",
    items: [
      {
        label: "Sales",
        icon: Icon.Sales,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"],
        subItems: [
          { to: "/sales", label: "Sales POS" },
          { to: "/orders", label: "Sales History" },
          { to: "/returns", label: "Returns / Refunds" }
        ]
      },
      { to: "/cash-drawer", label: "Cash Drawer", icon: Icon.CashDrawer, color: "text-green-500", bg: "bg-green-50", roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"] },
      {
        label: "Expense Management",
        icon: Icon.Reports,
        color: "text-red-500",
        bg: "bg-red-50",
        roles: ["OWNER", "ADMIN", "MANAGER"],
        subItems: [
          { to: "/expenses", label: "Expenses" },
          { to: "/expense-categories", label: "Categories" }
        ]
      },
      {
        to: "/reports",
        label: "Reports",
        icon: Icon.Reports,
        color: "text-purple-500",
        bg: "bg-purple-50",
        roles: ["OWNER", "ADMIN", "MANAGER"],
      },
      {
        to: "/analytics",
        label: "Analytics",
        icon: Icon.Analytics,
        color: "text-fuchsia-500",
        bg: "bg-fuchsia-50",
        roles: ["OWNER", "ADMIN", "MANAGER"],
      }
    ]
  },
  {
    label: "People",
    items: [
      { to: "/customers", label: "Customers", icon: Icon.Customers, color: "text-sky-500", bg: "bg-sky-50", roles: ["OWNER", "ADMIN", "MANAGER", "CASHIER"] },
      { to: "/employees", label: "Employees", icon: Icon.Employees, color: "text-rose-500", bg: "bg-rose-50", roles: ["OWNER", "ADMIN", "MANAGER"] },
      { to: "/salary-sheets", label: "Salary Sheets", icon: Icon.Salary, color: "text-fuchsia-500", bg: "bg-fuchsia-50", roles: ["OWNER", "ADMIN", "MANAGER"] },
      { to: "/loyalty-admin", label: "Loyalty Program", icon: Icon.Loyalty, color: "text-pink-500", bg: "bg-pink-50", roles: ["OWNER", "ADMIN", "MANAGER"] },
    ]
  },
  {
    label: "System",
    items: [
      { to: "/audit-logs", label: "Audit Logs", icon: Icon.AuditLogs, color: "text-gray-500", bg: "bg-gray-100", roles: ["OWNER", "ADMIN", "MANAGER"] },
    ]
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const userRole = user?.role || "";

  // Auto-open active dropdown on load
  React.useEffect(() => {
    let activeDropdownFound = false;
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.subItems?.some((sub) => location.pathname === sub.to)) {
          setOpenDropdown(item.label);
          activeDropdownFound = true;
          break;
        }
      }
      if (activeDropdownFound) break;
    }
  }, [location.pathname]);

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0);

  const canSeeSettings = ["OWNER", "ADMIN", "MANAGER"].includes(userRole);

  const handleMenuClick = (item: NavItem) => {
    if (item.subItems) {
      if (isCollapsed) {
        setIsCollapsed(false);
        setOpenDropdown(item.label);
      } else {
        setOpenDropdown((prev) => (prev === item.label ? null : item.label));
      }
    }
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] flex-col border-r border-gray-100 bg-white shadow-sm transition-all duration-300 print:hidden ${isCollapsed ? "w-[60px]" : "w-64"
          }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-2.5 top-4 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md transition hover:bg-gray-50 hover:shadow-lg"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <Icon.ChevronRight /> : <Icon.ChevronLeft />}
        </button>

        {/* Scrollable nav */}
        <nav
          className={`flex flex-1 flex-col gap-1 px-2 py-3 ${isCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"
            }`}
        >
          {visibleGroups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-2" : ""}>
              {/* Group Label */}
              {!isCollapsed && (
                <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                  {group.label}
                </p>
              )}
              {isCollapsed && gi > 0 && <div className="mx-2 my-2 border-t border-gray-100" />}

              <div className="flex flex-col gap-0.5">
                {group.items.map((item, idx) => {
                  const isParentActive =
                    item.to === location.pathname || item.subItems?.some((sub) => location.pathname === sub.to);
                  const isOpen = openDropdown === item.label && !isCollapsed;

                  return (
                    <div key={idx} className="group/menu relative">
                      {item.to ? (
                        <Link
                          to={item.to}
                          title={isCollapsed ? item.label : ""}
                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-150 ${isParentActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                            } ${isCollapsed ? "justify-center" : ""}`}
                        >
                          {isParentActive && !isCollapsed && (
                            <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-blue-300" />
                          )}
                          <span
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all ${isParentActive ? "bg-white/20 text-white" : `${item.bg} ${item.color}`
                              }`}
                          >
                            <item.icon />
                          </span>
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleMenuClick(item)}
                          title={isCollapsed ? item.label : ""}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-150 ${isParentActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                            } ${isCollapsed ? "justify-center" : ""}`}
                        >
                          {isParentActive && !isCollapsed && (
                            <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-blue-300" />
                          )}
                          <span
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all ${isParentActive ? "bg-white/20 text-white" : `${item.bg} ${item.color}`
                              }`}
                          >
                            <item.icon />
                          </span>
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 truncate text-left">{item.label}</span>
                              <span
                                className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""
                                  }`}
                              >
                                <Icon.ChevronRight />
                              </span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Expanded Accordion Submenu */}
                      {!isCollapsed && item.subItems && (
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "mt-1 max-h-64 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                          <div className="ml-[22px] flex flex-col gap-0.5 border-l-2 border-gray-100 py-1 pl-3">
                            {item.subItems.map((sub, sIdx) => {
                              const isSubActive = location.pathname === sub.to;
                              return (
                                <Link
                                  key={sIdx}
                                  to={sub.to}
                                  className={`block rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${isSubActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                                    }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Collapsed Hover Flyout Submenu */}
                      {isCollapsed && item.subItems && (
                        <div className="absolute left-[calc(100%+8px)] top-0 z-50 hidden w-48 rounded-lg border border-gray-100 bg-white p-2 shadow-xl group-hover/menu:block">
                          <p className="mb-2 border-b border-gray-100 pb-1 px-2 text-xs font-bold text-gray-800">
                            {item.label}
                          </p>
                          <div className="flex flex-col gap-0.5">
                            {item.subItems.map((sub, sIdx) => {
                              const isSubActive = location.pathname === sub.to;
                              return (
                                <Link
                                  key={sIdx}
                                  to={sub.to}
                                  className={`block rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors ${isSubActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                    }`}
                                >
                                  {sub.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings at bottom (fixed outside scrollable area) */}
        {canSeeSettings && (
          <div className="mt-auto border-t border-gray-100 p-2">
            {!isCollapsed && (
              <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Preferences
              </p>
            )}
            <Link
              to="/settings"
              title={isCollapsed ? "Settings" : ""}
              className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-150 ${location.pathname === "/settings"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all ${location.pathname === "/settings" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
              >
                <Icon.Settings />
              </span>
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </div>
        )}
      </aside>

      {/* Spacer for content layout */}
      <div className={`${isCollapsed ? "w-[60px]" : "w-56"} flex-shrink-0 transition-all duration-300 print:hidden`} />
    </>
  );
};

export default Sidebar;
