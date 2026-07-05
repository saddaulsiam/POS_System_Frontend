import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { Product, Category } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";
import { ProductsSkeleton } from "./POSPageSkeleton";
import { Button } from "../common";

interface POSProductListProps {
  products: Product[];
  categories: Category[];
  selectedCategory: number | null;
  onProductClick: (product: Product) => void;
  isLoadingProducts?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export const POSProductList: React.FC<POSProductListProps> = ({
  products,
  categories,
  selectedCategory,
  onProductClick,
  isLoadingProducts = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}) => {
  const { settings } = useSettings();
  const observerTarget = React.useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          onLoadMore
        ) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  const categoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : "All Products";

  if (isLoadingProducts) {
    return (
      <div className="mt-6">
        <h4 className="text-md mb-3 font-medium text-gray-900">{categoryName}</h4>
        <ProductsSkeleton />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-base font-medium text-gray-900">
          No products available
        </h3>
        <p className="mb-4 text-sm text-gray-500">
          {selectedCategory
            ? `No products found in this category`
            : `Add products to start making sales`}
        </p>
        {!selectedCategory && (
          <Link
            to="/products/new"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-md mb-3 font-medium text-gray-900">{categoryName}</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            disabled={product.stockQuantity <= 0 && !product.hasVariants}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white p-0 text-left shadow transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-20 md:h-28">
              {/* Product Image - Full Height on Left */}
              <div className="h-full w-20 flex-shrink-0 bg-gray-100 p-1.5 md:w-28 md:p-2.5">
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
                  <div className="flex h-full w-full items-center justify-center text-xl text-gray-400 md:text-2xl">
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

              {/* Product Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-2.5 md:p-3.5">
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

      {/* Load More Indicator */}
      {hasNextPage && (
        <div ref={observerTarget} className="mt-4 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <svg
                className="h-5 w-5 animate-spin text-blue-500"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading more products...
            </div>
          ) : (
            <Button onClick={onLoadMore} variant="ghost">
              Load More Products
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
