import type { Employee } from "./employeeTypes";
import type { Product, ProductVariant } from "./productTypes";
import type { PurchaseOrderStatus } from "./saleTypes";
import type { Supplier } from "./supplierTypes";

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  discount?: number;
  variant?: ProductVariant;
}

export interface CashDrawer {
  id: number;
  employeeId: number;
  openingBalance: number;
  closingBalance?: number;
  expectedBalance?: number;
  difference?: number;
  status: "OPEN" | "CLOSED";
  openedAt: string;
  closedAt?: string;
  employee?: Employee;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  productId: number;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQuantity: number;
  product?: Product;
}

export interface BarcodeScanResult {
  barcode: string;
  product?: Product;
}
