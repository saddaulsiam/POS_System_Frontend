import React from "react";
import { formatCurrency } from "../../utils/reportUtils";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";
import { useSettings } from "../../context/SettingsContext";

interface SalesRangeCardProps {
  salesRange: any;
  startDate: string;
  endDate: string;
}

export const SalesRangeCard: React.FC<SalesRangeCardProps> = ({
  salesRange,
  startDate,
  endDate,
}) => {
  const { settings } = useSettings();

  return (
    <div className="mb-10 rounded-xl border border-blue-100 bg-white p-8 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800">
          Sales{" "}
          <span className="text-base text-gray-500">
            ({startDate} to {endDate})
          </span>
        </h2>
        <div className="flex gap-2">
          <button
            className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() =>
              exportTableToPDF({
                title: `Sales Range - ${startDate} to ${endDate}`,
                columns: ["Total Sales", "Transactions", "Tax", "Discount"],
                data: [
                  [
                    formatCurrency(salesRange.summary?.totalSales ?? 0),
                    salesRange.summary?.totalTransactions ?? 0,
                    formatCurrency(salesRange.summary?.totalTax ?? 0),
                    formatCurrency(salesRange.summary?.totalDiscount ?? 0),
                  ],
                ],
                filename: `sales-range-${startDate}-to-${endDate}.pdf`,
              })
            }
          >
            Download PDF
          </button>
          <button
            className="rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
            onClick={() =>
              exportTableToCSV({
                columns: ["Total Sales", "Transactions", "Tax", "Discount"],
                data: [
                  [
                    salesRange.summary?.totalSales ?? 0,
                    salesRange.summary?.totalTransactions ?? 0,
                    salesRange.summary?.totalTax ?? 0,
                    salesRange.summary?.totalDiscount ?? 0,
                  ],
                ],
                sheetName: `Sales Range ${startDate} to ${endDate}`,
              })
            }
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Total Sales</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(
              salesRange.summary?.totalSales ?? 0,
              settings || undefined,
            )}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Transactions</div>
          <div className="text-2xl font-bold text-blue-900">
            {salesRange.summary?.totalTransactions ?? 0}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Tax</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(
              salesRange.summary?.totalTax ?? 0,
              settings || undefined,
            )}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Discount</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(
              salesRange.summary?.totalDiscount ?? 0,
              settings || undefined,
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
