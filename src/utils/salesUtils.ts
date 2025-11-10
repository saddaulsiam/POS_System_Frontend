import { Customer, Employee } from "../types";

export const getCustomerName = (
  customerId: number | undefined,
  customers: Customer[],
): string => {
  if (!customerId) return "Walk-in Customer";
  const customer = customers.find((c) => c.id === customerId);
  return customer?.name || "Unknown Customer";
};

export const getEmployeeName = (
  employeeId: number,
  employees: Employee[],
): string => {
  const employee = employees.find((e) => e.id === employeeId);
  return employee?.name || "Unknown Employee";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};
