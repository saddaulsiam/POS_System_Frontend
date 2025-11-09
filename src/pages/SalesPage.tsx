import React, { useState } from "react";
import { Sale } from "../types";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { SalesFilters } from "../components/sales/SalesFilters";
import { SalesTable } from "../components/sales/SalesTable";
import { SaleDetailsModal } from "../components/sales/SaleDetailsModal";
import { VoidSaleModal } from "../components/sales/VoidSaleModal";
import { Pagination } from "../components/sales/Pagination";
import { getCustomerName, getEmployeeName } from "../utils/salesUtils";
import {
  useSales,
  useSale,
  useSaleByReceiptId,
  useRefundSale,
  useVoidSale,
} from "../services/queries/salesQueries";
import { useCustomers } from "../services/queries/customersQueries";
import { useEmployees } from "../services/queries/employeesQueries";

const SalesPage: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);

  // Filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | "">("");
  const [selectedEmployee, setSelectedEmployee] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [receiptId, setReceiptId] = useState("");

  // React Query hooks
  const salesParams =
    receiptId.trim() !== ""
      ? undefined
      : {
          page: currentPage,
          limit: 20,
          startDate: dateFrom || undefined,
          endDate: dateTo || undefined,
          customerId: selectedCustomer || undefined,
          employeeId: selectedEmployee || undefined,
        };

  const { data: salesResponse, isLoading: salesLoading } =
    useSales(salesParams);
  const { data: receiptSale, isLoading: receiptLoading } =
    useSaleByReceiptId(receiptId);
  const { data: selectedSale } = useSale(selectedSaleId ?? undefined);
  const { data: customersResponse } = useCustomers({ limit: 100 });
  const { data: employeesData } = useEmployees();

  const refundSale = useRefundSale();
  const voidSale = useVoidSale();

  // Derive state
  const isLoading = receiptId.trim() !== "" ? receiptLoading : salesLoading;
  const sales =
    receiptId.trim() !== "" && receiptSale
      ? [receiptSale]
      : salesResponse?.data || [];
  const customers = customersResponse?.data || [];
  const employees = Array.isArray(employeesData) ? employeesData : [];
  const totalPages =
    receiptId.trim() !== "" ? 1 : salesResponse?.pagination?.totalPages || 1;
  const totalItems =
    receiptId.trim() !== ""
      ? receiptSale
        ? 1
        : 0
      : salesResponse?.pagination?.totalItems || 0;

  const handleViewDetails = async (sale: Sale) => {
    setSelectedSaleId(sale.id);
    setShowDetails(true);
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
      await refundSale.mutateAsync({ id: sale.id, data: refundData });
      toast.success("Refund processed successfully");
    } catch (error: any) {
      console.error("Error processing refund:", error);
      toast.error(error?.response?.data?.error || "Failed to process refund");
    }
  };

  const handleVoidSale = (sale: Sale) => {
    setSelectedSaleId(sale.id);
    setShowVoidModal(true);
  };

  const handleVoidConfirm = async (
    reason: string,
    password: string,
    restoreStock: boolean,
  ) => {
    if (!selectedSaleId) return;

    try {
      await voidSale.mutateAsync({
        id: selectedSaleId,
        data: { reason, password, restoreStock },
      });
      const receiptIdForToast =
        sales.find((s) => s.id === selectedSaleId)?.receiptId || selectedSaleId;
      toast.success(`Sale #${receiptIdForToast} has been voided`);
      setShowVoidModal(false);
      setSelectedSaleId(null);
    } catch (error: any) {
      console.error("Error voiding sale:", error);
      toast.error(error?.response?.data?.error || "Failed to void sale");
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
        sale={selectedSale || null}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        getCustomerName={(customerId) => getCustomerName(customerId, customers)}
        getEmployeeName={(employeeId) => getEmployeeName(employeeId, employees)}
      />

      {/* Void Sale Modal */}
      <VoidSaleModal
        sale={selectedSale || null}
        isOpen={showVoidModal}
        onClose={() => {
          setShowVoidModal(false);
          setSelectedSaleId(null);
        }}
        onConfirm={handleVoidConfirm}
        requirePassword={settings?.requirePasswordOnVoid || false}
        isLoading={voidSale.isPending}
      />
    </div>
  );
};

export default SalesPage;
