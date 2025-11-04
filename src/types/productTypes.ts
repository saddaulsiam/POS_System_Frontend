import { Supplier } from "./supplierTypes";
import { Category } from "./categoryTypes";

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  categoryId: number;
  supplierId?: number;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isWeighted: boolean;
  isActive: boolean;
  isDeleted: boolean;
  taxRate: number;
  image?: string;
  unit?: string;
  hasVariants?: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  supplier?: Supplier;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku: string;
  barcode?: string;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}
