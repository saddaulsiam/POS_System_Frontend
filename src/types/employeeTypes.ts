export interface EmployeeForm {
  name: string;
  username: string;
  pinCode: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  email?: string;
  phone?: string;
  photo?: string;
  joinedDate?: string;
  salary?: number;
  contractDetails?: string;
  notes?: string;
}

export interface Employee {
  id: number;
  name: string;
  username: string;
  role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  email?: string;
  phone?: string;
  photo?: string;
  joinedDate?: string;
  salary?: number;
  contractDetails?: string;
  notes?: string;
}
