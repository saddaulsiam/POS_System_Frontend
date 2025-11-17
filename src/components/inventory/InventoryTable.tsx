import React from "react";
import { Product } from "../../types";
import { Button, Badge } from "../common";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  onAdjustStock: (product: Product) => void;
  onViewHistory: (product: Product) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  isLoading,
  onAdjustStock,
  onViewHistory,
}) => {
  if (isLoading) {
    return <InventoryTableSkeleton />;
  }

  if (products.length === 0) {
    return <p className="text-gray-500">No products found</p>;
  }

  return (
    <table className="min-w-full overflow-hidden rounded-lg border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="w-16 px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Image
          </th>
          <th className="min-w-[120px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Name
          </th>
          <th className="min-w-[80px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            SKU
          </th>
          <th className="min-w-[60px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Stock
          </th>
          <th className="min-w-[90px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Status
          </th>
          <th className="min-w-[120px] px-3 py-2 text-left text-xs font-semibold uppercase text-gray-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, idx) => {
          let status = "In Stock";
          let variant: "success" | "danger" | "warning" = "success";
          if (product.stockQuantity <= 0) {
            status = "Out of Stock";
            variant = "danger";
          } else if (product.stockQuantity <= product.lowStockThreshold) {
            status = "Low Stock";
            variant = "warning";
          }

          return (
            <tr
              key={product.id}
              className={`align-middle transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}
            >
              <td className="px-3 py-2">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded border object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded border bg-gray-100 text-gray-400">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                )}
              </td>
              <td className="min-w-[120px] px-3 py-2 font-medium text-gray-900">
                {product.name}
              </td>
              <td className="min-w-[80px] px-3 py-2 text-gray-600">
                {product.sku}
              </td>
              <td className="min-w-[60px] px-3 py-2 text-gray-900">
                {product.stockQuantity}
              </td>
              <td className="min-w-[90px] px-3 py-2">
                <Badge variant={variant} size="sm">
                  {status}
                </Badge>
              </td>
              <td className="min-w-[120px] px-3 py-2">
                <div className="flex w-full items-center justify-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAdjustStock(product)}
                  >
                    Adjust Stock
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewHistory(product)}
                  >
                    History
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
