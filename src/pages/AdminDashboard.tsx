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
    totalExpenses: 0,
    todayExpenses: 0,
    yesterdayExpenses: 0,
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

  // Calculate real trends
  const getChange = (current: number, previous: number) => {
    if (previous === 0) return undefined;
    const change = ((current - previous) / previous) * 100;
    return { value: Number(Math.abs(change).toFixed(1)), isPositive: change >= 0 };
  };

  const salesChange = getChange(dashboardData.todaySales, dashboardData.yesterdaySales);
  const expensesChange = getChange(dashboardData.todayExpenses || 0, dashboardData.yesterdayExpenses || 0);
  const todayNet = (dashboardData.todaySales || 0) - (dashboardData.todayExpenses || 0);
  const yesterdayNet = (dashboardData.yesterdaySales || 0) - (dashboardData.yesterdayExpenses || 0);
  const netProfitChange = getChange(todayNet, yesterdayNet);

  // Business Health Status
  const healthStatus = todayNet > 0 ? 'good' : 'warning';
  const marginPct = dashboardData.todaySales ? ((todayNet / dashboardData.todaySales) * 100).toFixed(1) : '0.0';

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
            {/* Business Health Banner */}
            <div className={`rounded-xl border p-5 ${healthStatus === 'good' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${healthStatus === 'good' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {healthStatus === 'good' ? '🚀' : '⚠️'}
                  </div>
                  <div>
                    <h3 className={`font-bold ${healthStatus === 'good' ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {healthStatus === 'good' ? 'Excellent Performance' : 'Needs Attention'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Net margin today is <span className="font-semibold text-slate-900">{marginPct}%</span>. 
                      {healthStatus === 'good' ? ' Your store is highly profitable today.' : ' Watch your expenses closely today.'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white/60 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600">
                    💡 {dashboardData.topSellingProducts[0]?.name || 'Top Product'} drives most sales
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div>
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-800">
                <span>📊</span>
                <span>Key Metrics (Today)</span>
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardStatCard
                  title="Today's Sales"
                  value={formatCurrency(dashboardData.todaySales, settings)}
                  change={salesChange}
                  icon="💰"
                  color="green"
                />
                <DashboardStatCard
                  title="Today's Expenses"
                  value={formatCurrency(dashboardData.todayExpenses || 0, settings)}
                  change={expensesChange}
                  icon="💸"
                  color="red"
                />
                <DashboardStatCard
                  title="Net Profit"
                  value={formatCurrency(todayNet, settings)}
                  change={netProfitChange}
                  icon="📈"
                  color="blue"
                />
                <DashboardStatCard
                  title="Today's Orders"
                  value={dashboardData.todayTransactions}
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
                  icon="📊"
                  color="blue"
                />
                <DashboardStatCard
                  title="This Month"
                  value={formatCurrency(dashboardData.monthSales, settings)}
                  icon="📈"
                  color="green"
                />
                <DashboardStatCard
                  title="Avg Order Value"
                  value={formatCurrency(
                    dashboardData.averageOrderValue,
                    settings,
                  )}
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
                  icon="👥"
                  color="indigo"
                />
                <DashboardStatCard
                  title="New This Week"
                  value={dashboardData.newCustomersThisWeek}
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
