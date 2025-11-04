import React from "react";
import { EmployeePerformanceReport } from "../../types";
import { formatCurrency } from "../../utils/reportUtils";
import { exportTableToPDF, exportTableToCSV } from "../../utils/exportUtils";
import { useSettings } from "../../context/SettingsContext";

interface EmployeePerformanceCardProps {
  employeePerf: EmployeePerformanceReport;
  startDate: string;
  endDate: string;
}

export const EmployeePerformanceCard: React.FC<
  EmployeePerformanceCardProps
> = ({ employeePerf, startDate, endDate }) => {
  const { settings } = useSettings();

  return (
    <div className="mb-10 rounded-xl border border-blue-100 bg-white p-8 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-800">Top Employees</h2>
        <div className="flex gap-2">
          <button
            className="rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() =>
              exportTableToPDF({
                title: `Top Employees - ${startDate} to ${endDate}`,
                columns: [
                  "Name",
                  "Total Sales",
                  "Transactions",
                  "Avg Transaction",
                ],
                data: employeePerf.performance
                  .slice(0, 5)
                  .map((emp) => [
                    emp.employee.name,
                    formatCurrency(emp.totalSales),
                    emp.totalTransactions,
                    formatCurrency(emp.averageTransaction),
                  ]),
                filename: `top-employees-${startDate}-to-${endDate}.pdf`,
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
                  "Name",
                  "Total Sales",
                  "Transactions",
                  "Avg Transaction",
                ],
                data: employeePerf.performance
                  .slice(0, 5)
                  .map((emp) => [
                    emp.employee.name,
                    emp.totalSales,
                    emp.totalTransactions,
                    emp.averageTransaction,
                  ]),
                sheetName: `Top Employees ${startDate} to ${endDate}`,
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
                Name
              </th>
              <th className="px-4 py-2 text-right font-semibold text-blue-800">
                Total Sales
              </th>
              <th className="px-4 py-2 text-right font-semibold text-blue-800">
                Transactions
              </th>
              <th className="px-4 py-2 text-right font-semibold text-blue-800">
                Avg Transaction
              </th>
            </tr>
          </thead>
          <tbody>
            {employeePerf.performance.slice(0, 5).map((emp) => (
              <tr key={emp.employee.id} className="border-b">
                <td className="px-4 py-2">{emp.employee.name}</td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(emp.totalSales, settings || undefined)}
                </td>
                <td className="px-4 py-2 text-right">
                  {emp.totalTransactions}
                </td>
                <td className="px-4 py-2 text-right">
                  {formatCurrency(
                    emp.averageTransaction,
                    settings || undefined,
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
