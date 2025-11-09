import React from "react";
import { useAuth } from "../context/AuthContext";
import { BackButton, RefreshButton } from "../components/common";
import { DashboardStatCard } from "../components/dashboard/DashboardStatCard";
import { SimpleBarChart } from "../components/dashboard/SimpleBarChart";
import { RecentTransactionsList } from "../components/dashboard/RecentTransactionsList";
import { QuickActionsGrid } from "../components/dashboard/QuickActionsGrid";
import { AlertsSection } from "../components/dashboard/AlertsSection";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currencyUtils";
import { useDashboardStats } from "../services/queries/dashboardQueries";

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

  const ChartCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <h3 className="mb-6 border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
        {title}
      </h3>
      {children}
    </div>
  );

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Welcome back,{" "}
                <span className="font-semibold text-gray-900">
                  {user?.name || "Admin"}
                </span>
                ! Here's what's happening with your store today.
              </p>
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <div className="text-right">
                <p className="text-sm text-gray-500">Today's Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-96 flex-col items-center justify-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600"></div>
            <p className="text-lg text-gray-600">Loading dashboard data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <span className="text-3xl">📊</span>
                  <span>Key Metrics</span>
                </h2>
                <RefreshButton onClick={() => refetch()} loading={isLoading} />
              </div>
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

            {/* Sales Overview */}
            <div>
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                <span className="text-3xl">📈</span>
                <span>Sales Overview</span>
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
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                <span className="text-3xl">⚡</span>
                <span>Performance Metrics</span>
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

            {/* Charts and Analytics */}
            <div>
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                <span className="text-3xl">📊</span>
                <span>Analytics & Insights</span>
              </h2>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Top Selling Products">
                  <SimpleBarChart
                    data={dashboardData.topSellingProducts.map((p) => ({
                      label: p.name,
                      value: p.totalSold,
                    }))}
                  />
                </ChartCard>

                <ChartCard title="Sales by Category">
                  <SimpleBarChart
                    data={dashboardData.salesByCategory.map((c: any) => ({
                      label: c.category,
                      value: c.percentage,
                    }))}
                  />
                </ChartCard>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                <span className="text-3xl">⚡</span>
                <span>Recent Activity</span>
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
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
              <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-4">
                <div>
                  <p className="mb-1 text-sm text-blue-100">
                    Total Revenue (Month)
                  </p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(dashboardData.monthSales, settings)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-blue-100">
                    Transactions (Week)
                  </p>
                  <p className="text-3xl font-bold">
                    {dashboardData.weekTransactions}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-blue-100">Active Inventory</p>
                  <p className="text-3xl font-bold">
                    {dashboardData.activeProducts}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-blue-100">Total Customers</p>
                  <p className="text-3xl font-bold">
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
