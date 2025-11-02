import { Sale } from "./saleTypes";

export interface ReceiptPreview {
  sale: Sale;
  settings: StoreSettings;
}

export interface StoreSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
  taxId?: string;
  returnPolicy?: string;
}

export interface SendReceiptRequest {
  saleId: number;
  customerEmail: string;
  customerName?: string;
  includePDF?: boolean;
}

export interface PrintReceiptRequest {
  saleId: number;
  printerName?: string;
}

export type ItemCondition = "NEW" | "OPENED" | "DAMAGED" | "DEFECTIVE";
export type RefundMethod =
  | "CASH"
  | "ORIGINAL_PAYMENT"
  | "STORE_CREDIT"
  | "EXCHANGE";

export interface ReturnRequest {
  items: Array<{
    saleItemId: number;
    quantity: number;
    condition: ItemCondition;
  }>;
  reason: string;
  refundMethod: RefundMethod;
  restockingFee?: number;
  exchangeProductId?: number;
  notes?: string;
}

export interface ReturnSale extends Sale {
  returnItems?: ReturnItem[];
}

export interface ReturnItem {
  id: number;
  saleItemId: number;
  quantity: number;
  condition: ItemCondition;
  refundAmount: number;
}

export interface ReturnHistory {
  totalReturns: number;
  totalRefunded: number;
  returns: Sale[];
}
