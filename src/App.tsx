import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import CashDrawerPage from "./pages/CashDrawerPage";
import CategoriesPage from "./pages/CategoriesPage";
import CustomersPage from "./pages/CustomersPage";
import EmployeesPage from "./pages/EmployeesPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import LoyaltyAdminPage from "./pages/LoyaltyAdminPage";
import NewProductPage from "./pages/NewProductPage";
import NotificationsPage from "./pages/NotificationsPage";
import POSPage from "./pages/POSPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage";
import RegisterPage from "./pages/RegisterPage";
import ReportsPage from "./pages/ReportsPage";
import SalarySheetsPage from "./pages/SalarySheetsPage";
import SalesPage from "./pages/SalesPage";
import SettingsPage from "./pages/SettingsPage";
import SuppliersPage from "./pages/SuppliersPage";

const adminPaths = [
  "/admin",
  "/products",
  "/categories",
  "/suppliers",
  "/customers",
  "/sales",
  "/reports",
  "/analytics",
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

  const isAdminPath = adminPaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/"),
  );

  return (
    <>
      {isAdminPath && <Navbar />}

      <div className="flex">
        {isAdminPath && <Sidebar />}

        <main
          className={`flex-1 ${isAdminPath ? "pt-16" : ""} min-h-screen bg-gray-50`}
        >
          <Routes>
            {/* POS Interface - Main cashier interface */}
            <Route path="/" element={<POSPage />} />
            <Route path="/pos" element={<POSPage />} />

            {/* Admin/Manager Routes */}
            {(user?.role === "OWNER" ||
              user?.role === "ADMIN" ||
              user?.role === "MANAGER") && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/new" element={<NewProductPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/suppliers" element={<SuppliersPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/salary-sheets" element={<SalarySheetsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/loyalty-admin" element={<LoyaltyAdminPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/cash-drawer" element={<CashDrawerPage />} />
                <Route
                  path="/purchase-orders"
                  element={<PurchaseOrdersPage />}
                />
                <Route path="/notifications" element={<NotificationsPage />} />
              </>
            )}

            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default App;
