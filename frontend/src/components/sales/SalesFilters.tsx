import React from "react";
import { Input } from "../common";
import { Customer, Employee } from "../../types";
interface SalesFiltersProps {
  dateFrom: string;
  dateTo: string;
  selectedCustomer: number | "";
  selectedEmployee: number | "";
  receiptId: string;
  customers: Customer[];
  employees: Employee[];
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onCustomerChange: (value: number | "") => void;
  onEmployeeChange: (value: number | "") => void;
  onReceiptIdChange: (value: string) => void;
  onClearFilters: () => void;
}

export const SalesFilters: React.FC<SalesFiltersProps> = ({
  dateFrom,
  dateTo,
  selectedCustomer,
  selectedEmployee,
  receiptId,
  customers,
  employees,
  onDateFromChange,
  onDateToChange,
  onCustomerChange,
  onEmployeeChange,
  onReceiptIdChange,
  onClearFilters,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Input
            label="Receipt ID"
            type="text"
            value={receiptId}
            // onChange={(e) => onReceiptIdChange(e.target.value)}
            // onBlur={(e) => onReceiptIdChange(e.target.value)}
            onChange={(e) => onReceiptIdChange(e.target.value)}
            placeholder="Enter Receipt ID"
            fullWidth
            className="h-[42px]"
          />
          <Input
            label="Date From"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            fullWidth
            className="h-[42px]"
          />
          <Input
            label="Date To"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            fullWidth
            className="h-[42px]"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) =>
                onCustomerChange(
                  e.target.value === "" ? "" : parseInt(e.target.value),
                )
              }
              className="h-[42px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Customers</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) =>
                onEmployeeChange(
                  e.target.value === "" ? "" : parseInt(e.target.value),
                )
              }
              className="h-[42px] w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Employees</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end lg:ml-4">
          <button
            onClick={onClearFilters}
            className="flex h-[42px] items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600 shadow-sm transition hover:bg-gray-100"
            style={{ minWidth: 120 }}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
