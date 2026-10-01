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

  // Print helper
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const summaryData = [
      ["Total Products", inventory.totalProducts],
      ["Low Stock Items", inventory.lowStockCount],
      ["Out of Stock Items", inventory.outOfStockCount],
      ["Total Inventory Value", formatCurrency(inventory.totalInventoryValue, settings)]
    ];

    printWindow.document.write(`
      <html>
        <head>
          <title>Inventory Summary Report</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 30px; color: #334155; line-height: 1.5; }
            h1 { font-size: 24px; color: #1e1b4b; margin-bottom: 2px; }
            .subtitle { font-size: 14px; color: #64748b; margin-bottom: 30px; }
            .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin-bottom: 40px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
            .card-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
            .card-value { font-size: 20px; font-weight: 800; color: #1e3a8a; margin-top: 5px; }
          </style>
        </head>
        <body>
          <h1>Inventory Summary Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
          
          <div class="grid">
            ${summaryData.map(item => `
              <div class="card">
                <div class="card-label">${item[0]}</div>
                <div class="card-value">${item[1]}</div>
              </div>
            `).join("")}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Calculate percentages for health bar
  const outOfStockPct = inventory.totalProducts > 0 
    ? (inventory.outOfStockCount / inventory.totalProducts) * 100 
    : 0;
  const lowStockPct = inventory.totalProducts > 0 
    ? (inventory.lowStockCount / inventory.totalProducts) * 100 
    : 0;
  const healthyPct = Math.max(0, 100 - outOfStockPct - lowStockPct);

  return (
    <div className="mb-10 rounded-2xl border border-slate-100 bg-white/80 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md">
      {/* Header & Actions */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>📋</span>
            <span>Inventory Health Summary</span>
          </h2>
          <p className="text-sm text-slate-400">Current levels, values, and stock alerts of your store items</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrint}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            🖨️ Print
          </button>
          <button
            className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 shadow-sm transition-all hover:bg-indigo-100 hover:text-indigo-700"
            onClick={() =>
              exportTableToPDF({
                title: `Inventory Summary`,
                columns: [
                  "Total Products",
                  "Low Stock Alert",
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
            📄 PDF
          </button>
          <button
            className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 hover:text-emerald-700"
            onClick={() =>
              exportTableToCSV({
                columns: [
                  "Total Products",
                  "Low Stock Alert",
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
            📊 CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Products</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {inventory.totalProducts.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Low Stock Alert</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {inventory.lowStockCount.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Out of Stock</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">
            {inventory.outOfStockCount.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inventory Valuation</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {formatCurrency(inventory.totalInventoryValue, settings)}
          </div>
        </div>
      </div>

      {/* Health Progress Line */}
      <div className="rounded-xl border border-slate-100 p-5 bg-slate-50/20">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Stock Health Status</span>
          <span className="text-xs font-bold text-emerald-600">{healthyPct.toFixed(0)}% Optimal Stock</span>
        </div>
        {/* Proportional Segment Bar */}
        <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${healthyPct}%` }} title="Healthy" />
          <div className="h-full bg-amber-500 transition-all" style={{ width: `${lowStockPct}%` }} title="Low Stock" />
          <div className="h-full bg-rose-500 transition-all" style={{ width: `${outOfStockPct}%` }} title="Out of Stock" />
        </div>
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Optimal: {healthyPct.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Low Stock: {inventory.lowStockCount} items</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Out of Stock: {inventory.outOfStockCount} items</span>
          </div>
        </div>
      </div>
    </div>
  );
};
