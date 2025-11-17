import React from "react";
import { Sale } from "../../types";
import { Badge } from "../common";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";
import { SalesTableSkeleton } from "./SalesTableSkeleton";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onViewDetails: (sale: Sale) => void;
  onRefund: (sale: Sale) => void;
  onVoid?: (sale: Sale) => void;
  userRole?: string;
  getCustomerName: (customerId?: number) => string;
  getEmployeeName: (
    employeeId: number,
    employees: any[],
    employeeObj?: any,
  ) => string;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  isLoading,
  onViewDetails,
  onRefund,
  onVoid,
  userRole,
  getCustomerName,
  getEmployeeName,
}) => {
  const { settings } = useSettings();

  if (isLoading) {
    return <SalesTableSkeleton />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Receipt ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sales.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                No sales found
              </td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    #{sale.receiptId}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(sale.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(sale.createdAt).toLocaleTimeString()}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {getCustomerName(sale.customerId)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {getEmployeeName(sale.employeeId, [], sale.employee)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(sale.finalAmount, settings)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Tax: {formatCurrency(sale.taxAmount, settings)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {sale.paymentMethod}
                  </div>
                  {sale.cashReceived && (
                    <div className="text-sm text-gray-500">
                      Cash: {formatCurrency(sale.cashReceived, settings)}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge
                    variant={
                      sale.paymentStatus === "COMPLETED"
                        ? "success"
                        : sale.paymentStatus === "REFUNDED"
                          ? "danger"
                          : "warning"
                    }
                    rounded
                  >
                    {sale.paymentStatus}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(sale)}
                    className="mr-4 text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                  {sale.paymentStatus === "COMPLETED" &&
                    sale.status !== "VOIDED" && (
                      <button
                        onClick={() => onRefund(sale)}
                        className="mr-4 text-orange-600 hover:text-orange-900"
                      >
                        Refund
                      </button>
                    )}
                  {sale.status !== "VOIDED" &&
                    (userRole === "ADMIN" || userRole === "MANAGER") &&
                    onVoid && (
                      <button
                        onClick={() => onVoid(sale)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Void
                      </button>
                    )}
                  {sale.status === "VOIDED" && (
                    <span className="font-medium text-red-500">VOIDED</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
