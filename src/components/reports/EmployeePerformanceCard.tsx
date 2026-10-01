import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { EmployeePerformanceReport } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";
import { exportTableToCSV, exportTableToPDF } from "../../utils/exportUtils";

interface EmployeePerformanceCardProps {
  employeePerf: EmployeePerformanceReport;
  startDate: string;
  endDate: string;
}

export const EmployeePerformanceCard: React.FC<
  EmployeePerformanceCardProps
> = ({ employeePerf, startDate, endDate }) => {
  const { settings } = useSettings();

  // Print helper
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = employeePerf.performance.map(emp => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${emp.employee.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(emp.totalSales, settings)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${emp.totalTransactions}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(emp.averageTransaction, settings)}</td>
      </tr>`
    ).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Staff Performance Report</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 30px; color: #334155; line-height: 1.5; }
            h1 { font-size: 24px; color: #1e1b4b; margin-bottom: 2px; }
            .subtitle { font-size: 14px; color: #64748b; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
            th { text-align: left; padding: 10px; background: #f1f5f9; font-weight: 600; color: #475569; }
          </style>
        </head>
        <body>
          <h1>Staff Performance Report</h1>
          <div class="subtitle">Generated on ${new Date().toLocaleString()} for Period: ${startDate} to ${endDate}</div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th style="text-align: right;">Total Sales</th>
                <th style="text-align: right;">Transactions</th>
                <th style="text-align: right;">Avg Transaction</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
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
      {/* Header & Actions */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>👥</span>
            <span>Employee Sales Performance</span>
          </h2>
          <p className="text-sm text-slate-400">Sales volume and order counts generated per staff member</p>
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
                title: `Top Employees - ${startDate} to ${endDate}`,
                columns: [
                  "Name",
                  "Total Sales",
                  "Transactions",
                  "Avg Transaction",
                ],
                data: employeePerf.performance.map((emp) => [
                  emp.employee.name,
                  formatCurrency(emp.totalSales, settings),
                  emp.totalTransactions,
                  formatCurrency(emp.averageTransaction, settings),
                ]),
                filename: `top-employees-${startDate}-to-${endDate}.pdf`,
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
                  "Name",
                  "Total Sales",
                  "Transactions",
                  "Avg Transaction",
                ],
                data: employeePerf.performance.map((emp) => [
                  emp.employee.name,
                  emp.totalSales,
                  emp.totalTransactions,
                  emp.averageTransaction,
                ]),
                sheetName: `Top Employees ${startDate} to ${endDate}`,
              })
            }
          >
            📊 CSV
          </button>
        </div>
      </div>

      {/* Styled Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white/50 backdrop-blur-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-xs">
                Name
              </th>
              <th className="px-6 py-4 text-right font-bold text-slate-500 uppercase tracking-wider text-xs">
                Total Sales
              </th>
              <th className="px-6 py-4 text-right font-bold text-slate-500 uppercase tracking-wider text-xs">
                Transactions
              </th>
              <th className="px-6 py-4 text-right font-bold text-slate-500 uppercase tracking-wider text-xs">
                Avg Transaction
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employeePerf.performance.slice(0, 5).map((emp) => (
              <tr key={emp.employee.id} className="transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {emp.employee.name}
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-slate-800">
                  {formatCurrency(emp.totalSales, settings)}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-500">
                  {emp.totalTransactions.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-slate-600">
                  {formatCurrency(emp.averageTransaction, settings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
