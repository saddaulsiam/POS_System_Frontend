export interface CreateProductRequest {
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
  taxRate: number;
  image?: string;
  unit?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}
