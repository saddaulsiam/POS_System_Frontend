import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { SubscriptionGuard } from "./components/subscription";
import { useAuth } from "./context/AuthContext";

// Lazy load layout components
const Navbar = lazy(() => import("./components/common/Navbar"));
const Sidebar = lazy(() => import("./components/common/Sidebar"));

// Eager load critical pages (login, register, POS)
import LoginPage from "./pages/LoginPage";
import POSPage from "./pages/POSPage";
import RegisterPage from "./pages/RegisterPage";

// Lazy load admin/manager pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AuditLogsPage = lazy(() => import("./pages/AuditLogsPage"));
const CashDrawerPage = lazy(() => import("./pages/CashDrawerPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const CustomersPage = lazy(() => import("./pages/CustomersPage"));
const EmployeesPage = lazy(() => import("./pages/EmployeesPage"));
const InventoryPage = lazy(() => import("./pages/InventoryPage"));
const LoyaltyAdminPage = lazy(() => import("./pages/LoyaltyAdminPage"));
const NewProductPage = lazy(() => import("./pages/NewProductPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const PurchaseOrdersPage = lazy(() => import("./pages/PurchaseOrdersPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));
const SalarySheetsPage = lazy(() => import("./pages/SalarySheetsPage"));
const SalesPage = lazy(() => import("./pages/SalesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SuppliersPage = lazy(() => import("./pages/SuppliersPage"));
const BrandsPage = lazy(() => import("./pages/BrandsPage"));
const UnitsPage = lazy(() => import("./pages/UnitsPage"));
const BarcodePrintPage = lazy(() => import("./pages/BarcodePrintPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const ReturnsPage = lazy(() => import("./pages/ReturnsPage"));
const ExpensesPage = lazy(() => import("./pages/ExpensesPage"));
const ExpenseCategoriesPage = lazy(() => import("./pages/ExpenseCategoriesPage"));
const SubscriptionPurchasePage = lazy(
  () => import("./pages/SubscriptionPurchasePage"),
);

// Super Admin Layout and Pages
const SuperAdminLayout = lazy(() => import("./components/super-admin/SuperAdminLayout"));
const SuperAdminDashboard = lazy(() => import("./pages/super-admin/SuperAdminDashboard"));
const SuperAdminStores = lazy(() => import("./pages/super-admin/SuperAdminStores"));
const SuperAdminSubscriptions = lazy(() => import("./pages/super-admin/SuperAdminSubscriptions"));
const SuperAdminPayments = lazy(() => import("./pages/super-admin/SuperAdminPayments"));
const SuperAdminSettings = lazy(() => import("./pages/super-admin/SuperAdminSettings"));
const SuperAdminBroadcaster = lazy(() => import("./pages/super-admin/SuperAdminBroadcaster"));
const SuperAdminPromoCodes = lazy(() => import("./pages/super-admin/SuperAdminPromoCodes"));

const adminPaths = [
  "/dashboard",
  "/products",
  "/categories",
  "/suppliers",
  "/customers",
  "/sales",
  "/reports",
  "/inventory",
  "/employees",
  "/salary-sheets",
  "/profile",
  "/audit-logs",
  "/loyalty-admin",
  "/settings",
  "/purchase-orders",
  "/cash-drawer",
  "/notifications",
  "/barcode-print",
  "/orders",
  "/returns",
  "/expenses",
  "/expense-categories",
];

const App: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Allow access to register page
    if (location.pathname === "/register") {
      return <RegisterPage />;
    }
    return <LoginPage />;
  }

  // Intercept routing if the user is a platform Super Admin
  if (user?.role === "SUPER_ADMIN") {
    return (
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <SuperAdminLayout>
          <Routes>
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/stores" element={<SuperAdminStores />} />
            <Route
              path="/super-admin/subscriptions"
              element={<SuperAdminSubscriptions />}
            />
            <Route
              path="/super-admin/payments"
              element={<SuperAdminPayments />}
            />
            <Route
              path="/super-admin/settings"
              element={<SuperAdminSettings />}
            />
            <Route
              path="/super-admin/broadcast"
              element={<SuperAdminBroadcaster />}
            />
            <Route
              path="/super-admin/promo"
              element={<SuperAdminPromoCodes />}
            />
            <Route path="*" element={<Navigate to="/super-admin" replace />} />
          </Routes>
        </SuperAdminLayout>
      </Suspense>
    );
  }

  const isAdminPath = adminPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/"),
  );

  return (
    <>
      {isAdminPath && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}

      <div className="flex">
        {isAdminPath && (
          <Suspense fallback={null}>
            <Sidebar />
          </Suspense>
        )}

        <main
          className={`flex-1 ${isAdminPath ? "pt-16" : ""} min-h-screen bg-gray-50 print:pt-0 print:bg-white`}
        >
          <SubscriptionGuard>
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <Routes>
                <Route
                  path="/subscription"
                  element={<SubscriptionPurchasePage />}
                />

                {/* POS Interface - Main cashier interface */}
                <Route path="/" element={<POSPage />} />
                <Route path="/pos" element={<POSPage />} />

                {/* Admin/Manager Routes */}
                {(user?.role === "OWNER" ||
                  user?.role === "ADMIN" ||
                  user?.role === "MANAGER") && (
                    <>
                      <Route path="/dashboard" element={<AdminDashboard />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/new" element={<NewProductPage />} />
                      <Route path="/products/create" element={<NewProductPage />} />
                      <Route path="/products/brands" element={<BrandsPage />} />
                      <Route path="/products/units" element={<UnitsPage />} />
                      <Route path="/barcode-print" element={<BarcodePrintPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/returns" element={<ReturnsPage />} />
                      <Route path="/expenses" element={<ExpensesPage />} />
                      <Route path="/expense-categories" element={<ExpenseCategoriesPage />} />
                      <Route
                        path="/products/:id"
                        element={<ProductDetailPage />}
                      />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/suppliers" element={<SuppliersPage />} />
                      <Route path="/employees" element={<EmployeesPage />} />
                      <Route
                        path="/salary-sheets"
                        element={<SalarySheetsPage />}
                      />
                      <Route path="/customers" element={<CustomersPage />} />
                      <Route path="/sales" element={<SalesPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/inventory" element={<InventoryPage />} />
                      <Route path="/audit-logs" element={<AuditLogsPage />} />
                      <Route
                        path="/loyalty-admin"
                        element={<LoyaltyAdminPage />}
                      />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/cash-drawer" element={<CashDrawerPage />} />
                      <Route
                        path="/purchase-orders"
                        element={<PurchaseOrdersPage />}
                      />
                      <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                      />
                    </>
                  )}

                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </SubscriptionGuard>
        </main>
      </div>
    </>
  );
};

export default App;
