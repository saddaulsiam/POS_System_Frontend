export interface Brand {
  id: number;
  name: string;
  icon?: string | null;
  storeId: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}
