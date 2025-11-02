import { Customer, Employee } from "../types";

/**
 * Get customer name from customer ID
 */
export const getCustomerName = (
  customerId: number | undefined,
  customers: Customer[],
): string => {
  if (!customerId) return "Walk-in Customer";
  const customer = customers.find((c) => c.id === customerId);
  return customer?.name || "Unknown Customer";
};

/**
 * Get employee name from employee ID
 */
export const getEmployeeName = (
  employeeId: number,
  employees: Employee[],
): string => {
  const employee = employees.find((e) => e.id === employeeId);
  return employee?.name || "Unknown Employee";
};

/**
 * Format date to locale string
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

/**
 * Format time to locale string
 */
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString();
};

/**
 * Format date and time to locale string
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

/**
 * Format currency value
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
