import React from "react";
import { ProductPerformanceReport } from "../../types";
import { formatCurrency } from "../../utils/reportUtils";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";
import { useSettings } from "../../context/SettingsContext";

interface ProductPerformanceCardProps {
  productPerf: ProductPerformanceReport;
  startDate: string;
  endDate: string;
}

export const ProductPerformanceCard: React.FC<ProductPerformanceCardProps> = ({
  productPerf,
  startDate,
  endDate,
}) => {
  const { settings } = useSettings();

  return (
    <div className="mb-10 rounded-xl border border-blue-100 bg-white p-8 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800">
          Top Products{" "}
          <span className="text-base text-gray-500">
            ({startDate} to {endDate})
          </span>
        </h2>
        <div className="flex gap-2">
          <button
            className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() =>
              exportTableToPDF({
                title: `Top Products - ${startDate} to ${endDate}`,
                columns: [
                  "Product",
                  "Sold",
                  "Revenue",
                  "Transactions",
                  "Est. Profit",
                ],
                data: productPerf.products
                  .slice(0, 5)
                  .map((prod) => [
                    prod.product.name,
                    prod.totalQuantitySold,
                    formatCurrency(prod.totalRevenue),
                    prod.totalTransactions,
                    formatCurrency(prod.estimatedProfit),
                  ]),
                filename: `top-products-${startDate}-to-${endDate}.pdf`,
              })
            }
          >
            Download PDF
          </button>
          <button
            className="rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
            onClick={() =>
              exportTableToCSV({
                columns: [
                  "Product",
                  "Sold",
                  "Revenue",
                  "Transactions",
                  "Est. Profit",
                ],
                data: productPerf.products
                  .slice(0, 5)
                  .map((prod) => [
                    prod.product.name,
                    prod.totalQuantitySold,
                    prod.totalRevenue,
                    prod.totalTransactions,
                    prod.estimatedProfit,
                  ]),
                sheetName: `Top Products ${startDate} to ${endDate}`,
              })
            }
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-blue-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left font-semibold text-blue-800">
                Product
              </th>
              <th className="px-4 py-2 text-right font-semibold text-blue-800">
                Sold
              </th>
              <th className="px-4 py-2 text-right font-semibold text-blue-800">
                Revenue
              </th>
              <th className="px-4 py-2 text-right font-semibold text-blue-800">
                Transactions
              </th>
              <th className="px-4 py-2 text-right font-semibold text-blue-800">
                Est. Profit
              </th>
            </tr>
          </thead>
          <tbody>
            {productPerf.products.slice(0, 5).map((prod) => (
              <tr key={prod.product.id} className="border-b">
                <td className="px-4 py-2">{prod.product.name}</td>
                <td className="px-4 py-2 text-right">
                  {prod.totalQuantitySold}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(prod.totalRevenue, settings || undefined)}
                </td>
                <td className="px-4 py-2 text-right">
                  {prod.totalTransactions}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(prod.estimatedProfit, settings || undefined)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
