import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authAPI } from "../services";
import { AuthResponse, LoginRequest, User } from "../types";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useSetUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSetUser must be used within an AuthProvider");
  }
  return context.setUser;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response: AuthResponse = await authAPI.login(credentials);

      setToken(response.token);
      setUser(response.user);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success(`Welcome back, ${response.user.name} 👋`);
      return true;
    } catch (error: any) {
      console.error(
        "Login failed:",
        error?.response?.data?.message || error.message,
      );
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.dismiss();
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    setUser,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
