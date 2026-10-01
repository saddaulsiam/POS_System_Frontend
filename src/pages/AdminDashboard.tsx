import React from "react";
import { useAuth } from "../context/AuthContext";
import { BackButton, RefreshButton } from "../components/common";
import { DashboardStatCard } from "../components/dashboard/DashboardStatCard";
import { RecentTransactionsList } from "../components/dashboard/RecentTransactionsList";
import { QuickActionsGrid } from "../components/dashboard/QuickActionsGrid";
import { AlertsSection } from "../components/dashboard/AlertsSection";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currencyUtils";
import { useDashboardStats } from "../services/queries";
import { AdminDashboardSkeleton } from "../components/dashboard/AdminDashboardSkeleton";

// Upgraded interactive charts
import { SalesTrendInteractive } from "../components/dashboard/SalesTrendInteractive";
import { CategoryDonutInteractive } from "../components/dashboard/CategoryDonutInteractive";
import { TopProductsBarInteractive } from "../components/dashboard/TopProductsBarInteractive";
import { PaymentMethodsInteractive } from "../components/dashboard/PaymentMethodsInteractive";

const quickActions = [
  {
    name: "Add Product",
    href: "/products/new",
    icon: "📦",
    color: "blue",
    description: "Add new inventory items",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    name: "Process Sale",
    href: "/",
    icon: "💰",
    color: "green",
    description: "Go to POS terminal",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "View Reports",
    href: "/reports",
    icon: "📊",
    color: "purple",
    description: "Detailed analytics",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    name: "Manage Staff",
    href: "/employees",
    icon: "👥",
    color: "indigo",
    description: "Employee management",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Customer List",
    href: "/customers",
    icon: "👤",
    color: "pink",
    description: "Customer database",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: "📋",
    color: "yellow",
    description: "Stock management",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "⚙️",
    color: "gray",
    description: "System configuration",
    gradient: "from-gray-500 to-gray-600",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: "📈",
    color: "teal",
    description: "Advanced insights",
    gradient: "from-teal-500 to-cyan-600",
  },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();

  // Fetch dashboard stats using React Query
  const { data: stats, isLoading, refetch } = useDashboardStats();

  // Use default values if data is not loaded yet
  const dashboardData = stats || {
    todaySales: 0,
    yesterdaySales: 0,
    weekSales: 0,
    monthSales: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalCustomers: 0,
    newCustomersThisWeek: 0,
    todayTransactions: 0,
    weekTransactions: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    recentTransactions: [],
    salesByCategory: [],
    hourlySales: [],
  };

  if (user?.role === "CASHIER") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="mb-4 text-gray-600">
            You don't have permission to access the admin dashboard.
          </p>
          <BackButton to="/" label="Back to POS" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Dashboard
            </h1>
            <p className="text-base text-slate-500 font-medium">
              Welcome back,{" "}
              <span className="font-bold text-slate-800">
                {user?.name || "Admin"}
              </span>
              ! Here is what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Refresh button and Date badge */}
            <div className="flex items-center gap-2 bg-white/80 border border-slate-100 rounded-2xl px-4 py-2.5 shadow-sm backdrop-blur-md">
              <span className="text-lg">📅</span>
              <div className="text-left leading-none">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Store Date</span>
                <span className="text-xs font-extrabold text-slate-700">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <RefreshButton onClick={() => refetch()} loading={isLoading} />
          </div>
        </div>

        {isLoading ? (
          <AdminDashboardSkeleton />
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <span>📊</span>
                <span>Key Metrics</span>
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard
                  title="Today's Sales"
                  value={formatCurrency(dashboardData.todaySales, settings)}
                  change={{ value: 12.5, isPositive: true }}
                  icon="💰"
                  color="green"
                />
                <DashboardStatCard
                  title="Total Products"
                  value={dashboardData.totalProducts}
                  icon="📦"
                  color="blue"
                />
                <DashboardStatCard
                  title="Low Stock Items"
                  value={dashboardData.lowStockCount}
                  icon="⚠️"
                  color="yellow"
                />
                <DashboardStatCard
                  title="Today's Orders"
                  value={dashboardData.todayTransactions}
                  change={{ value: 8.2, isPositive: true }}
                  icon="🛒"
                  color="purple"
                />
              </div>
            </div>

            {/* Interactive Sales Trend Section (Span Full Width) */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <span>📈</span>
                <span>Sales Performance</span>
              </h2>
              <div className="w-full">
                <SalesTrendInteractive />
              </div>
            </div>

            {/* Sales Overview */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <span>📅</span>
                <span>Sales Overview Comparisons</span>
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard
                  title="Yesterday"
                  value={formatCurrency(dashboardData.yesterdaySales, settings)}
                  icon="📅"
                  color="gray"
                />
                <DashboardStatCard
                  title="This Week"
                  value={formatCurrency(dashboardData.weekSales, settings)}
                  change={{ value: 15.3, isPositive: true }}
                  icon="📊"
                  color="blue"
                />
                <DashboardStatCard
                  title="This Month"
                  value={formatCurrency(dashboardData.monthSales, settings)}
                  change={{ value: 23.1, isPositive: true }}
                  icon="📈"
                  color="green"
                />
                <DashboardStatCard
                  title="Avg Order Value"
                  value={formatCurrency(
                    dashboardData.averageOrderValue,
                    settings,
                  )}
                  change={{ value: 5.7, isPositive: true }}
                  icon="💸"
                  color="purple"
                />
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <span>⚡</span>
                <span>Store Engagement</span>
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <DashboardStatCard
                  title="Total Customers"
                  value={dashboardData.totalCustomers}
                  change={{ value: 4.2, isPositive: true }}
                  icon="👥"
                  color="indigo"
                />
                <DashboardStatCard
                  title="New This Week"
                  value={dashboardData.newCustomersThisWeek}
                  change={{ value: 12.8, isPositive: true }}
                  icon="👋"
                  color="pink"
                />
                <DashboardStatCard
                  title="Active Products"
                  value={`${dashboardData.activeProducts}/${dashboardData.totalProducts}`}
                  icon="✅"
                  color="green"
                />
              </div>
            </div>

            {/* Interactive Charts and Analytics Details (3-Column Layout) */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <span>🔍</span>
                <span>Deep Dive Analytics</span>
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Top Products Card */}
                <TopProductsBarInteractive data={dashboardData.topSellingProducts} />

                {/* Categories Breakdown Card */}
                <CategoryDonutInteractive data={dashboardData.salesByCategory} />

                {/* Payment Methods Card */}
                <PaymentMethodsInteractive />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <span>⚡</span>
                <span>Recent Activity & Actions</span>
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RecentTransactionsList
                  transactions={dashboardData.recentTransactions}
                />
                <QuickActionsGrid actions={quickActions} />
              </div>
            </div>

            {/* Alerts and Notifications */}
            <AlertsSection
              lowStockCount={dashboardData.lowStockCount}
              outOfStockCount={dashboardData.outOfStockCount}
            />

            {/* Dashboard Footer - Quick Summary */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-lg relative overflow-hidden">
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-4 relative z-10">
                <div>
                  <p className="mb-1 text-xs text-indigo-100 font-semibold uppercase tracking-wider">
                    Total Revenue (Month)
                  </p>
                  <p className="text-3xl font-extrabold">
                    {formatCurrency(dashboardData.monthSales, settings)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-indigo-100 font-semibold uppercase tracking-wider">
                    Transactions (Week)
                  </p>
                  <p className="text-3xl font-extrabold">
                    {dashboardData.weekTransactions}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-indigo-100 font-semibold uppercase tracking-wider">Active Inventory</p>
                  <p className="text-3xl font-extrabold">
                    {dashboardData.activeProducts}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-indigo-100 font-semibold uppercase tracking-wider">Total Customers</p>
                  <p className="text-3xl font-extrabold">
                    {dashboardData.totalCustomers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
