import { Employee } from "./employeeTypes";
import { Product } from "./productTypes";

export type StockMovementType =
  | "SALE"
  | "PURCHASE"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGED"
  | "EXPIRED";
export type AlertType =
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "EXPIRING_SOON"
  | "DAMAGED";

export interface StockMovement {
  id: number;
  productId: number;
  movementType: StockMovementType;
  quantity: number;
  reason?: string;
  reference?: string;
  product?: Product;
  productVariantId?: number;
  productVariant?: any;
  fromLocation?: string;
  toLocation?: string;
  createdBy?: number;
  createdAt: string;
}

export interface StockAlert {
  id: number;
  productId: number;
  alertType: AlertType;
  message: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: number;
  createdAt: string;
  product?: Product;
  resolver?: Employee;
}

export interface StockAdjustmentRequest {
  productId: number;
  productVariantId?: number;
  quantity: number;
  reason: "DAMAGED" | "EXPIRED" | "LOST" | "FOUND" | "COUNT_ADJUSTMENT";
  notes?: string;
}

export interface StockTransferRequest {
  productId: number;
  productVariantId?: number;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  notes?: string;
}

export interface ReceivePurchaseOrderRequest {
  purchaseOrderId: number;
  items: Array<{
    purchaseOrderItemId: number;
    quantityReceived: number;
    notes?: string;
  }>;
}
