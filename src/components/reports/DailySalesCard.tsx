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

  // Print helper
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const summaryData = [
      ["Total Sales", formatCurrency(daily.summary.totalSales, settings)],
      ["Transactions", daily.summary.totalTransactions],
      ["Tax Amount", formatCurrency(daily.summary.totalTax, settings)],
      ["Discount Amount", formatCurrency(daily.summary.totalDiscount, settings)]
    ];

    const productsRows = daily.topProducts.map(p => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.product?.name || `#${p.productId}`}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${p._sum.quantity} units</td>
      </tr>`
    ).join("");

    const paymentRows = daily.salesByPaymentMethod.map(pm => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${pm.paymentMethod}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(pm._sum.finalAmount, settings)}</td>
      </tr>`
    ).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Daily Sales Report - ${daily.date}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 30px; color: #334155; line-height: 1.5; }
            h1 { font-size: 24px; color: #1e1b4b; margin-bottom: 2px; }
            .subtitle { font-size: 14px; color: #64748b; margin-bottom: 30px; }
            .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 15px; margin-bottom: 40px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
            .card-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
            .card-value { font-size: 20px; font-weight: 800; color: #1e3a8a; margin-top: 5px; }
            .section-title { font-size: 16px; font-weight: 700; color: #334155; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th { text-align: left; padding: 8px; background: #f1f5f9; font-weight: 600; color: #475569; }
          </style>
        </head>
        <body>
          <h1>Daily Sales Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()} for Date: ${daily.date}</div>
          
          <div class="grid">
            ${summaryData.map(item => `
              <div class="card">
                <div class="card-label">${item[0]}</div>
                <div class="card-value">${item[1]}</div>
              </div>
            `).join("")}
          </div>

          <div style="display: grid; grid-template-cols: 1fr 1fr; gap: 40px;">
            <div>
              <div class="section-title">Top Selling Products</div>
              <table>
                <thead>
                  <tr><th>Product</th><th style="text-align: right;">Quantity Sold</th></tr>
                </thead>
                <tbody>
                  ${productsRows}
                </tbody>
              </table>
            </div>
            <div>
              <div class="section-title">Sales by Payment Method</div>
              <table>
                <thead>
                  <tr><th>Method</th><th style="text-align: right;">Final Amount</th></tr>
                </thead>
                <tbody>
                  ${paymentRows}
                </tbody>
              </table>
            </div>
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

  // Find max quantity for visual bars
  const maxQty = daily.topProducts.length > 0 
    ? Math.max(...daily.topProducts.map(p => p._sum.quantity)) 
    : 1;

  // Find max payment for visual bars
  const maxPayment = daily.salesByPaymentMethod.length > 0
    ? Math.max(...daily.salesByPaymentMethod.map(pm => pm._sum.finalAmount))
    : 1;

  return (
    <div className="mb-10 rounded-2xl border border-slate-100 bg-white/80 p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md">
      {/* Title & Actions */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>📅</span>
            <span>Today's Sales Summary</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-500">
              {daily.date}
            </span>
          </h2>
          <p className="text-sm text-slate-400">Review sales and collections completed today</p>
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
                title: `Daily Sales Report - ${daily.date}`,
                columns: ["Product", "Quantity Sold"],
                data: daily.topProducts.map((p) => [
                  p.product?.name || `#${p.productId}`,
                  p._sum.quantity,
                ]),
                filename: `daily-sales-${daily.date}.pdf`,
              })
            }
          >
            📄 PDF
          </button>
          <button
            className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 shadow-sm transition-all hover:bg-emerald-100 hover:text-emerald-700"
            onClick={() =>
              exportTableToCSV({
                columns: ["Product", "Quantity Sold"],
                data: daily.topProducts.map((p) => [
                  p.product?.name || `#${p.productId}`,
                  p._sum.quantity,
                ]),
                sheetName: `Daily Sales ${daily.date}`,
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
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sales</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {formatCurrency(daily.summary.totalSales, settings)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transactions</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {daily.summary.totalTransactions.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tax Collected</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {formatCurrency(daily.summary.totalTax, settings)}
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Discounts</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">
            {formatCurrency(daily.summary.totalDiscount, settings)}
          </div>
        </div>
      </div>

      {/* Bottom Lists with Progress indicators */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Top Products */}
        <div className="rounded-xl border border-slate-100 p-5 bg-slate-50/20">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-indigo-500">Top Selling Products</h3>
          {daily.topProducts.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">No sales recorded today</p>
          ) : (
            <div className="space-y-4">
              {daily.topProducts.slice(0, 5).map((p) => {
                const pct = (p._sum.quantity / maxQty) * 100;
                return (
                  <div key={p.productId} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{p.product?.name || `#${p.productId}`}</span>
                      <span>{p._sum.quantity} units</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl border border-slate-100 p-5 bg-slate-50/20">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-emerald-500">Collections by Method</h3>
          {daily.salesByPaymentMethod.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium">No payments received today</p>
          ) : (
            <div className="space-y-4">
              {daily.salesByPaymentMethod.map((pm) => {
                const pct = (pm._sum.finalAmount / maxPayment) * 100;
                return (
                  <div key={pm.paymentMethod} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>{pm.paymentMethod}</span>
                      <span>{formatCurrency(pm._sum.finalAmount, settings)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
