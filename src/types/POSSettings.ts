export interface POSSettings {
  id: number;
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

  // Currency & Tax
  taxRate: number;
  currencyCode: string;
  currencySymbol: string;
  currencyPosition: string;

  // Receipt Settings
  receiptFooterText: string | null;
  returnPolicy: string | null;
  printReceiptAuto: boolean;
  autoPrintThermal: boolean;

  // Alerts & Notifications
  enableLowStockAlerts: boolean;
  lowStockThreshold: number;
  enableHighStockAlerts?: boolean;
  highStockThreshold?: number;
  enableProductExpiryAlerts?: boolean;
  productExpiryDays?: number;
  dailySalesTargetAlertEnabled?: boolean;
  dailySalesTargetAmount?: number;
  priceChangeAlertEnabled?: boolean;
  supplierDeliveryAlertEnabled?: boolean;
  expectedDeliveryDays?: number;
  inactiveProductAlertEnabled?: boolean;
  inactiveProductDays?: number;
  lowBalanceAlertEnabled?: boolean;
  lowBalanceThreshold?: number;
  frequentRefundsAlertEnabled?: boolean;
  frequentRefundsThreshold?: number;
  loyaltyPointsExpiryAlertEnabled?: boolean;
  loyaltyPointsExpiryDays?: number;
  systemErrorAlertEnabled?: boolean;

  // System Settings
  autoLogoutMinutes: number;
  requirePasswordOnVoid: boolean;
  enableAuditLog: boolean;
  productsPerPage: number;
  defaultView: string;
  showProductImages: boolean;

  updatedAt: string;
  updatedByEmployee?: {
    id: number;
    name: string;
    username: string;
  };
}
