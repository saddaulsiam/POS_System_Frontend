import { Customer } from "./customerTypes";
import { Employee } from "./employeeTypes";
import { Product, ProductVariant } from "./productTypes";

export interface Sale {
  id: number;
  receiptId: string;
  employeeId: number;
  customerId?: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  loyaltyDiscount?: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status?: string;
  cashReceived?: number;
  changeGiven?: number;
  notes?: string;
  employee?: Employee;
  customer?: Customer;
  saleItems?: SaleItem[];
  discountReason?: string;
  pointsEarned?: number;
  paymentSplits?: PaymentSplit[];
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  priceAtSale: number;
  discount: number;
  subtotal: number;
  product?: Product;
  productVariantId?: number;
  unitPrice?: number;
  total?: number;
  productVariant?: ProductVariant;
}

export interface ParkedSale {
  id: number;
  employeeId: number;
  customerId?: number;
  items: any[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  notes?: string;
  parkedAt: string;
  expiresAt: string;
  employee?: any;
  customer?: any;
}

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "MOBILE_PAYMENT"
  | "STORE_CREDIT"
  | "MIXED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type PurchaseOrderStatus =
  | "PENDING"
  | "ORDERED"
  | "PARTIALLY_RECEIVED"
  | "RECEIVED"
  | "CANCELLED";

export interface PaymentSplit {
  id: number;
  saleId: number;
  paymentMethod: PaymentMethod;
  amount: number;
  createdAt: string;
}

export interface CreateSaleRequest {
  customerId?: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    discount?: number;
  }>;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
  notes?: string;
  discountAmount?: number;
}

export interface ProcessPaymentRequest {
  saleId: number;
  paymentMethod: PaymentMethod;
  cashReceived?: number;
}

export interface WeighingScaleReading {
  weight: number;
  unit: "kg" | "lb";
  stable: boolean;
}

export interface QuickSaleItem {
  id: number;
  productId: number;
  displayName: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  product?: Product;
}

export interface QuickSaleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}
