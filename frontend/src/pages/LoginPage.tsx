import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Button, Input } from "../components/common";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { settings } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔐 Login form submitted");

    if (!username || !pinCode) {
      console.log("⚠️ Missing credentials:", {
        username: !!username,
        pinCode: !!pinCode,
      });
      return;
    }

    console.log("🔄 Starting login process...", {
      username,
      pinCodeLength: pinCode.length,
    });
    setIsLoading(true);
    try {
      const result = await login({ username, pinCode });
      console.log("✅ Login completed successfully:", result);
    } catch (error: any) {
      console.error("❌ Login failed:", {
        error,
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    switch (role) {
      case "admin":
        setUsername("admin");
        setPinCode("1234");
        break;
      case "manager":
        setUsername("manager");
        setPinCode("5678");
        break;
      case "cashier":
        setUsername("cashier1");
        setPinCode("9999");
        break;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {settings?.storeName || "POS System"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <Input
              id="pinCode"
              name="pinCode"
              type="password"
              required
              placeholder="PIN Code"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              fullWidth
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading || !username || !pinCode}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Sign in"}
            </Button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gradient-to-br from-blue-50 to-indigo-100 px-2 text-gray-500">
                  Quick Login
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => quickLogin("admin")}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => quickLogin("manager")}
              >
                Manager
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => quickLogin("cashier")}
              >
                Cashier
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <div className="text-xs text-gray-500">
            <p className="mb-2 font-semibold">Default Credentials:</p>
            <p>Admin: admin / 1234</p>
            <p>Manager: manager / 5678</p>
            <p>Cashier: cashier1 / 9999</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
