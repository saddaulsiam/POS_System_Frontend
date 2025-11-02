import React, { useState, useEffect } from "react";
import { salesAPI, customersAPI, employeesAPI } from "../services";
import { Sale, Customer, Employee } from "../types";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { SalesFilters } from "../components/sales/SalesFilters";
import { SalesTable } from "../components/sales/SalesTable";
import { SaleDetailsModal } from "../components/sales/SaleDetailsModal";
import { VoidSaleModal } from "../components/sales/VoidSaleModal";
import { Pagination } from "../components/sales/Pagination";
import { getCustomerName, getEmployeeName } from "../utils/salesUtils";

const SalesPage: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [voidLoading, setVoidLoading] = useState(false);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | "">("");
  const [selectedEmployee, setSelectedEmployee] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [receiptId, setReceiptId] = useState("");

  useEffect(() => {
    loadSales();
  }, [
    currentPage,
    dateFrom,
    dateTo,
    selectedCustomer,
    selectedEmployee,
    receiptId,
  ]);

  useEffect(() => {
    loadCustomers();
    loadEmployees();
  }, []);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      let response;
      if (receiptId.trim() !== "") {
        // Search by receipt ID
        const sale = await salesAPI.getByReceiptId(receiptId.trim());
        response = { data: sale ? [sale] : [], pagination: { totalPages: 1 } };
      } else {
        response = await salesAPI.getAll({
          page: currentPage,
          limit: 20,
          startDate: dateFrom || undefined,
          endDate: dateTo || undefined,
          customerId: selectedCustomer || undefined,
          employeeId: selectedEmployee || undefined,
        });
      }
      const { data = [], pagination } = response || {};
      setSales(data);
      // Map backend keys to frontend state for pagination
      let pages = 1;
      let items = 0;
      if (pagination) {
        if ("pages" in pagination) pages = Number((pagination as any).pages);
        else if ("totalPages" in pagination)
          pages = Number((pagination as any).totalPages);
        if ("total" in pagination) items = Number((pagination as any).total);
        else if ("totalItems" in pagination)
          items = Number((pagination as any).totalItems);
      }
      setTotalPages(pages);
      setTotalItems(items);
    } catch (error: any) {
      console.error("Error loading sales:", error);
      toast.error(error?.response?.data?.error || "Failed to load sales");
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await customersAPI.getAll({ limit: 100 });
      setCustomers(response.data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await employeesAPI.getAll();
      setEmployees(data || []);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleViewDetails = async (sale: Sale) => {
    try {
      const detailedSale = await salesAPI.getById(sale.id);
      setSelectedSale(detailedSale);
      setShowDetails(true);
    } catch (error) {
      console.error("Error loading sale details:", error);
      toast.error("Failed to load sale details");
    }
  };

  const handleRefund = async (sale: Sale) => {
    if (
      !confirm(
        `Are you sure you want to process a refund for sale #${sale.receiptId}?`,
      )
    ) {
      return;
    }

    try {
      const refundData = {
        items: (sale.saleItems ?? []).map((item) => ({
          saleItemId: item.id,
          quantity: item.quantity,
        })),
        reason: "Customer return",
      };
      await salesAPI.processRefund(sale.id, refundData);
      toast.success("Refund processed successfully");
      loadSales();
    } catch (error: any) {
      console.error("Error processing refund:", error);
      toast.error(error?.response?.data?.error || "Failed to process refund");
    }
  };

  const handleVoidSale = (sale: Sale) => {
    setSelectedSale(sale);
    setShowVoidModal(true);
  };

  const handleVoidConfirm = async (
    reason: string,
    password: string,
    restoreStock: boolean,
  ) => {
    if (!selectedSale) return;

    try {
      setVoidLoading(true);
      await salesAPI.voidSale(selectedSale.id, {
        reason,
        password,
        restoreStock,
      });
      toast.success(`Sale #${selectedSale.receiptId} has been voided`);
      setShowVoidModal(false);
      setSelectedSale(null);
      loadSales();
    } catch (error: any) {
      console.error("Error voiding sale:", error);
      toast.error(error?.response?.data?.error || "Failed to void sale");
    } finally {
      setVoidLoading(false);
    }
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSelectedCustomer("");
    setSelectedEmployee("");
    setReceiptId("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Sales History</h1>

        {/* Filters */}
        <SalesFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          selectedCustomer={selectedCustomer}
          selectedEmployee={selectedEmployee}
          receiptId={receiptId}
          customers={customers}
          employees={employees}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onCustomerChange={setSelectedCustomer}
          onEmployeeChange={setSelectedEmployee}
          onReceiptIdChange={setReceiptId}
          onClearFilters={clearFilters}
        />

        {/* Sales Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <SalesTable
            sales={sales}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            onRefund={handleRefund}
            onVoid={handleVoidSale}
            userRole={user?.role}
            getCustomerName={(customerId) =>
              getCustomerName(customerId, customers)
            }
            getEmployeeName={(employeeId) =>
              getEmployeeName(employeeId, employees)
            }
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Sale Details Modal */}
      <SaleDetailsModal
        sale={selectedSale}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        getCustomerName={(customerId) => getCustomerName(customerId, customers)}
        getEmployeeName={(employeeId) => getEmployeeName(employeeId, employees)}
      />

      {/* Void Sale Modal */}
      <VoidSaleModal
        sale={selectedSale}
        isOpen={showVoidModal}
        onClose={() => {
          setShowVoidModal(false);
          setSelectedSale(null);
        }}
        onConfirm={handleVoidConfirm}
        requirePassword={settings?.requirePasswordOnVoid || false}
        isLoading={voidLoading}
      />
    </div>
  );
};

export default SalesPage;
