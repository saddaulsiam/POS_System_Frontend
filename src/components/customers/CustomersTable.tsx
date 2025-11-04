import React from "react";
import { Customer } from "../../types";
import { Badge } from "../common";

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onViewDetails?: (customer: Customer) => void;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  isLoading,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  // Helper function to check if today is the customer's birthday
  const isBirthday = (dateOfBirth?: string): boolean => {
    if (!dateOfBirth) return false;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    return (
      today.getMonth() === birthDate.getMonth() &&
      today.getDate() === birthDate.getDate()
    );
  };

  // Helper function to calculate age
  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Loyalty Points
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Joined
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
          {customers.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No customers found
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                      {isBirthday(customer.dateOfBirth) && (
                        <span className="ml-2" title="Happy Birthday! 🎉">
                          🎂
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.address}
                      {customer.dateOfBirth &&
                        !isBirthday(customer.dateOfBirth) && (
                          <span className="ml-2 text-xs">
                            (Age: {calculateAge(customer.dateOfBirth)})
                          </span>
                        )}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {customer.phoneNumber || "No phone"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {customer.email || "No email"}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {customer.loyaltyPoints}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge
                    variant={customer.isActive ? "success" : "danger"}
                    rounded
                    size="sm"
                  >
                    {customer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  {onViewDetails && (
                    <button
                      onClick={() => onViewDetails(customer)}
                      className="mr-4 text-blue-600 hover:text-blue-900"
                    >
                      👁️ View
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(customer)}
                    className="mr-4 text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(customer)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
