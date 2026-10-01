import React from "react";
import { formatCurrency } from "../../utils/currencyUtils";
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

  // Print helper
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const summaryData = [
      ["Total Sales", formatCurrency(salesRange.summary?.totalSales ?? 0, settings)],
      ["Transactions", salesRange.summary?.totalTransactions ?? 0],
      ["Tax Collected", formatCurrency(salesRange.summary?.totalTax ?? 0, settings)],
      ["Discounts Given", formatCurrency(salesRange.summary?.totalDiscount ?? 0, settings)]
    ];

    printWindow.document.write(`
      <html>
        <head>
          <title>Sales Range Report - ${startDate} to ${endDate}</title>
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
          <h1>Sales Range Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()} for Period: ${startDate} to ${endDate}</div>
          
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

  return (
    <div className="mb-10 rounded-2xl border border-slate-100 bg-white/80 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md">
      {/* Title & Actions */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>📊</span>
            <span>Period Sales summary</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
              {startDate} to {endDate}
            </span>
          </h2>
          <p className="text-sm text-slate-400">Total revenue generated over the selected date range</p>
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
                title: `Sales Range Report - ${startDate} to ${endDate}`,
                columns: ["Total Sales", "Transactions", "Tax", "Discount"],
                data: [
                  [
                    formatCurrency(salesRange.summary?.totalSales ?? 0, settings),
                    salesRange.summary?.totalTransactions ?? 0,
                    formatCurrency(salesRange.summary?.totalTax ?? 0, settings),
                    formatCurrency(salesRange.summary?.totalDiscount ?? 0, settings),
                  ],
                ],
                filename: `sales-range-${startDate}-to-${endDate}.pdf`,
              })
            }
          >
            📄 PDF
          </button>
          <button
            className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 hover:text-emerald-700"
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
            📊 CSV
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {formatCurrency(salesRange.summary?.totalSales ?? 0, settings)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Transactions</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {(salesRange.summary?.totalTransactions ?? 0).toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax Collected</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {formatCurrency(salesRange.summary?.totalTax ?? 0, settings)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Discounts</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {formatCurrency(salesRange.summary?.totalDiscount ?? 0, settings)}
          </div>
        </div>
      </div>
    </div>
  );
};
