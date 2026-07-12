import React, { useState } from "react";
import { Product, ProductVariant } from "../../types";
import { Button, Badge } from "../common";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";

interface InventoryTableProps {
  products: Product[];
  isLoading: boolean;
  onAdjustStock: (product: Product, variant?: ProductVariant) => void;
  onViewHistory: (product: Product) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  isLoading,
  onAdjustStock,
  onViewHistory,
}) => {
  const [expandedProductIds, setExpandedProductIds] = useState<Record<number, boolean>>({});

  const toggleExpand = (productId: number) => {
    setExpandedProductIds((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

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
          <th className="min-w-[120px] px-3 py-2 text-right text-xs font-semibold uppercase text-gray-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, idx) => {
          const hasVariants = product.hasVariants && product.variants && product.variants.length > 0;

          let status = "In Stock";
          let variantColor: "success" | "danger" | "warning" | "info" | "default" | "primary" | "secondary" = "success";

          if (hasVariants && product.variants) {
            const totalVariants = product.variants.length;
            const outOfStockCount = product.variants.filter((v) => v.stockQuantity <= 0).length;
            const lowStockCount = product.variants.filter(
              (v) => v.stockQuantity > 0 && v.stockQuantity <= product.lowStockThreshold
            ).length;

            if (outOfStockCount === totalVariants) {
              status = "Out of Stock";
              variantColor = "danger";
            } else if (outOfStockCount > 0) {
              status = "Partially Out of Stock";
              variantColor = "warning";
            } else if (lowStockCount + outOfStockCount === totalVariants) {
              status = "Low Stock";
              variantColor = "warning";
            } else if (lowStockCount > 0) {
              status = "Low Stock (Some)";
              variantColor = "warning";
            }
          } else {
            if (product.stockQuantity <= 0) {
              status = "Out of Stock";
              variantColor = "danger";
            } else if (product.stockQuantity <= product.lowStockThreshold) {
              status = "Low Stock";
              variantColor = "warning";
            }
          }

          const isExpanded = !!expandedProductIds[product.id];

          return (
            <React.Fragment key={product.id}>
              {/* Parent Product Row */}
              <tr
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
                  <div className="flex items-center gap-2">
                    <span>{product.name}</span>
                    {hasVariants && (
                      <Badge variant="info" size="sm">
                        {product.variants?.length} variants
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="min-w-[80px] px-3 py-2 text-gray-600">
                  {product.sku}
                </td>
                <td className="min-w-[60px] px-3 py-2 text-gray-900 font-bold">
                  {product.stockQuantity}
                </td>
                <td className="min-w-[90px] px-3 py-2">
                  <Badge variant={variantColor} size="sm">
                    {status}
                  </Badge>
                </td>
                <td className="min-w-[120px] px-3 py-2">
                  <div className="flex w-full items-center justify-end gap-2">
                    {!hasVariants && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAdjustStock(product)}
                      >
                        Adjust Stock
                      </Button>
                    )}
                    {hasVariants && (
                      <span className="text-xs text-gray-400 italic">
                        Adjust variants
                      </span>
                    )}
                    {hasVariants && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(product.id)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 bg-gray-50 text-xs font-bold text-gray-600 hover:bg-gray-100"
                        title={isExpanded ? "Collapse variants" : "Expand variants"}
                      >
                        {isExpanded ? "▼" : "▶"}
                      </button>
                    )}
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

              {/* Nested Variant Rows */}
              {hasVariants && isExpanded && product.variants?.map((variant) => {
                let variantStatus = "In Stock";
                let variantColorClass: "success" | "danger" | "warning" = "success";
                if (variant.stockQuantity <= 0) {
                  variantStatus = "Out of Stock";
                  variantColorClass = "danger";
                } else if (variant.stockQuantity <= product.lowStockThreshold) {
                  variantStatus = "Low Stock";
                  variantColorClass = "warning";
                }

                return (
                  <tr
                    key={variant.id}
                    className="align-middle bg-slate-50 border-l-4 border-indigo-500 transition-colors hover:bg-slate-100/80"
                  >
                    <td className="px-3 py-2 text-center text-gray-400">
                      —
                    </td>
                    <td className="min-w-[120px] px-3 py-2 pl-6 font-medium text-slate-700">
                      <span className="text-indigo-600 font-semibold mr-1">↳</span>
                      Variant: <span className="text-gray-900 font-bold">{variant.name}</span>
                    </td>
                    <td className="min-w-[80px] px-3 py-2 text-slate-500 font-mono text-xs">
                      {variant.sku}
                    </td>
                    <td className="min-w-[60px] px-3 py-2 text-slate-900 font-semibold">
                      {variant.stockQuantity}
                    </td>
                    <td className="min-w-[90px] px-3 py-2">
                      <Badge variant={variantColorClass} size="sm">
                        {variantStatus}
                      </Badge>
                    </td>
                    <td className="min-w-[120px] px-3 py-2">
                      <div className="flex w-full items-center justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onAdjustStock(product, variant)}
                        >
                          Adjust Variant Stock
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
