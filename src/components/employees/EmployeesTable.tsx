import React from "react";
import { Employee } from "../../types";
import { EmployeesTableSkeleton } from "./EmployeesTableSkeleton";
import { Badge, Button } from "../common";

interface EmployeesTableProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onViewDetails?: (employee: Employee) => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  if (isLoading) {
    return <EmployeesTableSkeleton />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Photo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Joined
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Salary
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {employees.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  {employee.photo ? (
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="h-10 w-10 rounded-full border object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-500">
                      {employee.name?.charAt(0) || "?"}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                  {employee.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                  <div>
                    {employee.email || (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {employee.phone || (
                      <span className="text-gray-300">N/A</span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                  {employee.joinedDate ? (
                    new Date(employee.joinedDate).toLocaleDateString()
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                  {employee.salary !== undefined && employee.salary !== null ? (
                    `$${employee.salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                  {employee.username}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-700">
                  {employee.role}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {employee.isActive ? (
                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="sm">
                      Inactive
                    </Badge>
                  )}
                </td>
                <td className="space-x-2 whitespace-nowrap px-6 py-4 text-right">
                  {onViewDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(employee)}
                    >
                      View
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(employee)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
