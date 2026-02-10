import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { posSettingsAPI } from "../services";

interface POSSettings {
  id: number;
  storeId: number | null;
  // Feature Toggles
  enableQuickSale: boolean;
  enableSplitPayment: boolean;
  enableParkSale: boolean;
  enableCustomerSearch: boolean;
  enableBarcodeScanner: boolean;
  enableLoyaltyPoints: boolean;
  loyaltyPointsPerUnit: number;
  pointsRedemptionRate: number;
  // Store Information
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  taxId: string | null;
  // Tax & Currency
  taxRate: number;
  currencyCode: string;
  currencySymbol: string;
  currencyPosition: string;
  // Receipt Settings
  receiptFooterText: string | null;
  returnPolicy: string | null;
  printReceiptAuto: boolean;
  emailReceiptAuto: boolean;
  // Alerts & Notifications
  enableLowStockAlerts: boolean;
  lowStockThreshold: number;
  enableEmailNotifications: boolean;
  adminAlertEmail: string | null;
  // System Settings
  autoLogoutMinutes: number;
  requirePasswordOnVoid: boolean;
  enableAuditLog: boolean;
  productsPerPage: number;
  defaultView: string;
  showProductImages: boolean;
  // Add new setting for auto thermal print
  autoPrintThermal?: boolean;
  // Metadata
  updatedAt: string;
  updatedBy: number | null;
  updatedByEmployee?: {
    id: number;
    name: string;
    username: string;
  };
}

interface SettingsContextType {
  settings: POSSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<POSSettings | null>(null);
  const [loading, setLoading] = useState(false);

  const loadSettings = async () => {
    // Don't load settings if no auth token exists
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await posSettingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load POS settings:", error);
      // Set default values if loading fails
      setSettings({
        id: 0,
        storeId: null,
        enableQuickSale: true,
        enableSplitPayment: true,
        enableParkSale: true,
        enableCustomerSearch: true,
        enableBarcodeScanner: true,
        enableLoyaltyPoints: true,
        loyaltyPointsPerUnit: 10,
        pointsRedemptionRate: 100,
        storeName: "POS System",
        storeAddress: "123 Main St, City, Country",
        storePhone: "(123) 456-7890",
        storeEmail: "info@possystem.com",
        taxId: null,
        taxRate: 0,
        currencyCode: "USD",
        currencySymbol: "$",
        currencyPosition: "before",
        receiptFooterText: null,
        returnPolicy: null,
        printReceiptAuto: false,
        emailReceiptAuto: false,
        enableLowStockAlerts: true,
        lowStockThreshold: 10,
        enableEmailNotifications: true,
        adminAlertEmail: null,
        autoLogoutMinutes: 30,
        requirePasswordOnVoid: true,
        enableAuditLog: true,
        productsPerPage: 20,
        defaultView: "grid",
        showProductImages: true,
        autoPrintThermal: false,
        updatedAt: new Date().toISOString(),
        updatedBy: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load settings if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      loadSettings();
    }
  }, []); // Only run once on mount

  const refreshSettings = async () => {
    await loadSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
