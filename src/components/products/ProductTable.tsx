import React from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { Category, Product, Supplier } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";
import { Badge, Button } from "../common";
import { ProductTableSkeleton } from "./ProductTableSkeleton";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  isLoading: boolean;
  canWrite: boolean;
  deletingId: number | null;
  onPrint: (product: Product) => void;
  onEdit: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
  onQuickSale?: (product: Product) => void;
  onRestore?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  suppliers,
  isLoading,
  canWrite,
  deletingId,
  onPrint,
  onEdit,
  onToggleStatus,
  onDelete,
  onAddNew,
  onQuickSale,
  onRestore,
}) => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Products List{" "}
            <span className="ml-2 text-sm font-normal text-gray-500">
              (0 items)
            </span>
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-400"
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
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No Products Found
          </h3>
          <p className="mb-6 text-gray-500">
            Get started by adding your first product
          </p>
          {canWrite && (
            <Button variant="primary" onClick={onAddNew}>
              + Add Product
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Helper to get full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith("http")) return imagePath;
    // Change this to your backend URL if different
    const backendUrl = process.env.VITE_BACKEND_URL;
    return backendUrl + imagePath;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Products List{" "}
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({products.length} items)
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                SKU / Barcode
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {products.map((product) => (
              <tr
                key={product.id}
                className={`transition-colors hover:bg-gray-50 ${product.isDeleted ? "bg-red-50 text-gray-400" : ""}`}
              >
                {/* Product Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {product.image ? (
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-gray-100 to-gray-200">
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
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product.name}{" "}
                        {product.hasVariants && (
                          <Badge variant="info" rounded size="sm">
                            variants
                          </Badge>
                        )}
                      </p>
                      {product.supplierId && (
                        <p className="text-xs text-gray-500">
                          Supplier:{" "}
                          {suppliers.find((s) => s.id === product.supplierId)
                            ?.name || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* SKU / Barcode Column */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{product.sku}</p>
                    {product.barcode && (
                      <p className="font-mono text-xs text-gray-500">
                        {product.barcode}
                      </p>
                    )}
                  </div>
                </td>

                {/* Category Column */}
                <td className="px-6 py-4">
                  <Badge variant="default" rounded size="sm">
                    {categories.find((c) => c.id === product.categoryId)
                      ?.name || "-"}
                  </Badge>
                </td>

                {/* Price Column */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-semibold text-green-700">
                      {formatCurrency(product.sellingPrice, settings)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cost: {formatCurrency(product.purchasePrice, settings)}
                    </p>
                  </div>
                </td>

                {/* Stock Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Badge
                      variant={
                        product.stockQuantity <= product.lowStockThreshold
                          ? "danger"
                          : product.stockQuantity <=
                              product.lowStockThreshold * 2
                            ? "warning"
                            : "success"
                      }
                      rounded
                      size="sm"
                    >
                      {product.stockQuantity} units
                    </Badge>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-6 py-4">
                  <Badge
                    variant={product.isActive ? "success" : "default"}
                    rounded
                    size="sm"
                    dot
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {product.isDeleted && onRestore && (
                      <button
                        onClick={() => onRestore(product)}
                        className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
                        title="Restore Product"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10v6a2 2 0 002 2h14a2 2 0 002-2v-6M16 6V4a2 2 0 00-2-2H10a2 2 0 00-2 2v2m4 0v4"
                          />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50"
                      title="View Details & Variants"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    {product.barcode && (
                      <button
                        onClick={() => onPrint(product)}
                        className="rounded-lg p-2 text-purple-600 transition-colors hover:bg-purple-50"
                        title="Print Barcode"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </button>
                    )}
                    {canWrite && (
                      <>
                        {onQuickSale && (
                          <button
                            onClick={() => onQuickSale(product)}
                            className="rounded-lg p-2 text-yellow-600 transition-colors hover:bg-yellow-50"
                            title="Add to Quick Sale"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(product)}
                          className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Edit Product"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => onToggleStatus(product)}
                          className={`rounded-lg p-2 transition-colors ${
                            product.isActive
                              ? "text-green-600 hover:bg-green-50"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                          title={product.isActive ? "Deactivate" : "Activate"}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {product.isActive ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          title="Delete Product"
                        >
                          {deletingId === product.id ? (
                            <svg
                              className="h-5 w-5 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
