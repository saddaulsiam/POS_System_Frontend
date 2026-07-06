export interface User {
  id: number;
  name: string;
  username: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "CASHIER" | "STAFF" | "SUPER_ADMIN";
  email: string;
  phone: string | null;
  storeId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  pinCode: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
