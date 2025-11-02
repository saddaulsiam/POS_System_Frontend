import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { receiptsAPI } from "../../services/api/receiptsAPI";
import { Sale } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";

interface SaleDetailsModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  getCustomerName: (customerId?: number) => string;
  getEmployeeName: (employeeId: number) => string;
}

export const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({
  sale,
  isOpen,
  onClose,
  getCustomerName,
  getEmployeeName,
}) => {
  const { settings } = useSettings();

  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Sale Details - #{sale.receiptId}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    let content = "";
                    let isThermal = settings?.autoPrintThermal;
                    if (isThermal) {
                      content = await receiptsAPI.getThermal(sale.id);
                      // Optionally wrap in <pre> for monospace/thermal look
                      content = `<pre style='font-size:16px; font-family:monospace;'>${content}</pre>`;
                    } else {
                      content = await receiptsAPI.getHTML(sale.id);
                    }
                    const printWindow = window.open(
                      "",
                      "_blank",
                      isThermal
                        ? "width=400,height=600"
                        : "width=800,height=600",
                    );
                    if (printWindow) {
                      printWindow.document.write(content);
                      printWindow.document.close();
                      setTimeout(() => printWindow.print(), 500);
                    }
                  } catch (err) {
                    alert("Failed to load receipt for printing.");
                  }
                }}
                className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow hover:bg-blue-700"
                title="Print Receipt"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-8 0h8v4H6v-4z"
                  />
                </svg>
                Print Receipt
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Sale Info */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <p className="text-sm text-gray-900">
                {new Date(sale.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee
              </label>
              <p className="text-sm text-gray-900">
                {getEmployeeName(sale.employeeId)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer
              </label>
              <p className="text-sm text-gray-900">
                {getCustomerName(sale.customerId)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <p className="text-sm text-gray-900">{sale.paymentMethod}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h4 className="text-md mb-3 font-medium text-gray-900">Items</h4>
            <div className="overflow-hidden rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(sale.saleItems ?? []).map((item: any) => {
                    const productName = item.product?.name || "Unknown Product";
                    const variantName = item.productVariant?.name;
                    const displayName = variantName
                      ? `${productName} - ${variantName}`
                      : productName;

                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {displayName}
                          {item.productVariant && (
                            <div className="text-xs text-gray-500">
                              SKU: {item.productVariant.sku}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatCurrency(item.priceAtSale, settings)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatCurrency(item.subtotal, settings)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(sale.subtotal, settings)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>{formatCurrency(sale.taxAmount, settings)}</span>
              </div>
              {(sale.loyaltyDiscount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Loyalty Discount:</span>
                  <span>
                    -{formatCurrency(sale.loyaltyDiscount ?? 0, settings)}
                  </span>
                </div>
              )}
              {sale.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>-{formatCurrency(sale.discountAmount, settings)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-lg font-medium">
                <span>Total:</span>
                <span>{formatCurrency(sale.finalAmount, settings)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
