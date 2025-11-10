import React from "react";
import { useSettings } from "../../context";
import { SalarySheet } from "../../services/api/salarySheetsAPI";
import { formatCurrency } from "../../utils/currencyUtils";

interface SalarySheetsTableProps {
  salarySheets: SalarySheet[];
  months: string[];
  loading: boolean;
  onMarkAsPaid: (id: number) => void;
  onEdit: (sheet: SalarySheet) => void;
  onDelete: (id: number) => void;
  onPrint: (sheet: SalarySheet) => void;
}

const SalarySheetsTable: React.FC<SalarySheetsTableProps> = ({
  salarySheets,
  months,
  loading,
  onMarkAsPaid,
  onEdit,
  onDelete,
  onPrint,
}) => {
  const { settings } = useSettings();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded border bg-white shadow">
        <thead>
          <tr>
            <th className="border px-4 py-2">Employee</th>
            <th className="border px-4 py-2">Month</th>
            <th className="border px-4 py-2">Year</th>
            <th className="border px-4 py-2">Base Salary</th>
            <th className="border px-4 py-2">Bonus</th>
            <th className="border px-4 py-2">Deduction</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {salarySheets.map((sheet) => (
            <tr key={sheet.id} className="text-center">
              <td className="flex items-center gap-2 border px-4 py-2">
                {sheet.employee.photoUrl && (
                  <img
                    src={sheet.employee.photoUrl}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <span>{sheet.employee.name}</span>
              </td>
              <td className="border px-4 py-2">{months[sheet.month - 1]}</td>
              <td className="border px-4 py-2">{sheet.year}</td>
              <td className="border px-4 py-2">
                {formatCurrency(sheet.baseSalary, settings)}
              </td>
              <td className="border px-4 py-2">
                {formatCurrency(sheet.bonus, settings)}
              </td>
              <td className="border px-4 py-2">
                {formatCurrency(sheet.deduction, settings)}
              </td>
              <td className="border px-4 py-2 font-semibold">
                {formatCurrency(
                  sheet.baseSalary + sheet.bonus - sheet.deduction,
                  settings,
                )}
              </td>
              <td className="border px-4 py-2">
                {sheet.paid ? (
                  <span className="font-semibold text-green-600">Paid</span>
                ) : (
                  <span className="font-semibold text-yellow-600">Unpaid</span>
                )}
              </td>
              <td className="flex justify-center gap-2 border px-4 py-2">
                {!sheet.paid && (
                  <button
                    className="rounded bg-green-500 px-3 py-1 text-xs text-white"
                    onClick={() => onMarkAsPaid(sheet.id)}
                  >
                    Mark as Paid
                  </button>
                )}
                <button
                  className="rounded bg-blue-500 px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => onEdit(sheet)}
                  disabled={sheet.paid}
                >
                  Edit
                </button>
                <button
                  className="rounded bg-red-500 px-3 py-1 text-xs text-white disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => onDelete(sheet.id)}
                  disabled={sheet.paid}
                >
                  Delete
                </button>
                <button
                  className="rounded bg-gray-700 px-3 py-1 text-xs text-white"
                  onClick={() => onPrint(sheet)}
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
          {salarySheets.length === 0 && !loading && (
            <tr>
              <td colSpan={9} className="py-8 text-center text-gray-500">
                No salary sheets found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalarySheetsTable;
