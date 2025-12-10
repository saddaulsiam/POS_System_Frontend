export interface User {
  id: number;
  name: string;
  username: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  email: string;
  phone: string;
  storeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  pinCode: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
