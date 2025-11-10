import React from "react";
import { InventoryReport } from "../../types";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface InventorySummaryCardProps {
  inventory: InventoryReport;
}

export const InventorySummaryCard: React.FC<InventorySummaryCardProps> = ({
  inventory,
}) => {
  const { settings } = useSettings();

  return (
    <div className="mb-10 rounded-xl border border-blue-100 bg-white p-8 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800">Inventory Summary</h2>
        <div className="flex gap-2">
          <button
            className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() =>
              exportTableToPDF({
                title: `Inventory Summary`,
                columns: [
                  "Total Products",
                  "Low Stock",
                  "Out of Stock",
                  "Inventory Value",
                ],
                data: [
                  [
                    inventory.totalProducts,
                    inventory.lowStockCount,
                    inventory.outOfStockCount,
                    formatCurrency(inventory.totalInventoryValue, settings),
                  ],
                ],
                filename: `inventory-summary.pdf`,
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
                  "Total Products",
                  "Low Stock",
                  "Out of Stock",
                  "Inventory Value",
                ],
                data: [
                  [
                    inventory.totalProducts,
                    inventory.lowStockCount,
                    inventory.outOfStockCount,
                    inventory.totalInventoryValue,
                  ],
                ],
                sheetName: `Inventory Summary`,
              })
            }
          >
            Download CSV
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Total Products</div>
          <div className="text-2xl font-bold text-blue-900">
            {inventory.totalProducts}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Low Stock</div>
          <div className="text-2xl font-bold text-blue-900">
            {inventory.lowStockCount}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Out of Stock</div>
          <div className="text-2xl font-bold text-blue-900">
            {inventory.outOfStockCount}
          </div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <div className="text-xs text-gray-500">Inventory Value</div>
          <div className="text-2xl font-bold text-blue-900">
            {formatCurrency(inventory.totalInventoryValue, settings)}
          </div>
        </div>
      </div>
    </div>
  );
};
