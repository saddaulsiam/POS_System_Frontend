import React from "react";
import { Product, Category } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface POSProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
  onProductClick: (product: Product) => void;
}

export const POSProductGrid: React.FC<POSProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onCategoryClick,
  onProductClick,
}) => {
  const { settings } = useSettings();

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Categories</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <button
          onClick={() => onCategoryClick(null)}
          className={`rounded-lg border p-4 shadow transition-shadow hover:shadow-md ${
            selectedCategory === null
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <span className="text-xl text-blue-600">🛒</span>
            </div>
            <p className="text-sm font-medium text-gray-900">All Products</p>
          </div>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`rounded-lg border p-4 shadow transition-shadow hover:shadow-md ${
              selectedCategory === category.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="text-xl text-blue-600">
                  {category.icon || "📦"}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {category.name}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {products.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md mb-3 font-medium text-gray-900">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : "All Products"}
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => onProductClick(product)}
                disabled={product.stockQuantity <= 0 && !product.hasVariants}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white p-0 text-left shadow transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex h-28">
                  {/* Product Image - Full Height on Left */}
                  <div className="h-full w-28 flex-shrink-0 bg-gray-100 p-2.5">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full rounded-md object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E📦%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl text-gray-400">
                        📦
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3.5">
                    <p
                      className="flex items-center gap-2 truncate text-sm font-medium text-gray-900"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {product.sku}
                    </p>
                    {product.hasVariants ||
                    (product.variants && product.variants.length > 0) ? (
                      <p className="mt-1 w-fit rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                        Variant
                      </p>
                    ) : (
                      <>
                        <p className="mt-1 text-sm font-semibold text-green-600">
                          {formatCurrency(product.sellingPrice, settings)}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            product.stockQuantity <= 0
                              ? "font-medium text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {product.stockQuantity <= 0
                            ? "Out of Stock"
                            : `Stock: ${product.stockQuantity}`}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
