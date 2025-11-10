import React from "react";
import { DailySalesReport } from "../../types";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface DailySalesCardProps {
  daily: DailySalesReport;
}

export const DailySalesCard: React.FC<DailySalesCardProps> = ({ daily }) => {
  const { settings } = useSettings();

  return (
    <div className="mb-10 rounded-xl border border-blue-100 bg-white p-8 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800">
          Today's Sales{" "}
          <span className="text-base text-gray-500">({daily.date})</span>
        </h2>
        <div className="flex gap-2">
          <button
            className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() =>
              exportTableToPDF({
                title: `Daily Sales - ${daily.date}`,
                columns: ["Product", "Sold"],
                data: daily.topProducts
                  .slice(0, 5)
                  .map((p) => [
                    p.product?.name || `#${p.productId}`,
                    p._sum.quantity,
                  ]),
                filename: `daily-sales-${daily.date}.pdf`,
              })
            }
          >
            Download PDF
          </button>
          <button
            className="rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
            onClick={() =>
              exportTableToCSV({
                columns: ["Product", "Sold"],
                data: daily.topProducts
                  .slice(0, 5)
                  .map((p) => [
                    p.product?.name || `#${p.productId}`,
                    p._sum.quantity,
                  ]),
                sheetName: `Daily Sales ${daily.date}`,
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
            {formatCurrency(daily.summary.totalSales, settings)}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Transactions</div>
          <div className="text-2xl font-bold text-blue-900">
            {daily.summary.totalTransactions}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Tax</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(daily.summary.totalTax, settings)}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Discount</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(daily.summary.totalDiscount, settings)}
          </div>
        </div>
      </div>

      {/* Top Products and Payment Methods */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-semibold text-blue-700">Top Products</h3>
          <ul className="divide-y">
            {daily.topProducts.slice(0, 5).map((p) => (
              <li key={p.productId} className="flex justify-between py-1">
                <span>{p.product?.name || `#${p.productId}`}</span>
                <span className="text-gray-700">{p._sum.quantity} sold</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-semibold text-blue-700">
            Sales by Payment Method
          </h3>
          <ul className="divide-y">
            {daily.salesByPaymentMethod.map((pm) => (
              <li key={pm.paymentMethod} className="flex justify-between py-1">
                <span>{pm.paymentMethod}</span>
                <span className="text-gray-700">
                  {formatCurrency(pm._sum.finalAmount, settings)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
