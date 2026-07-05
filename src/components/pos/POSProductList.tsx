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
      <h4 className="text-md mb-3 font-semibold tracking-tight text-slate-800">{categoryName}</h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 p-1 -m-1">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            disabled={product.stockQuantity <= 0 && !product.hasVariants}
            className="group overflow-hidden rounded-xl border border-slate-200 bg-white p-0 text-left shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 transform hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex h-20 md:h-28">
              {/* Product Image - Full Height on Left */}
              <div className="h-full w-20 flex-shrink-0 bg-slate-50 p-1.5 md:w-28 md:p-2.5 overflow-hidden relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-size='40' text-anchor='middle' dy='.3em' fill='%239ca3af'%3E📦%3C/text%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl text-gray-400 md:text-2xl transition-transform duration-300 group-hover:scale-105">
                    <svg
                      className="h-6 w-6 text-gray-300"
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
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 p-3 md:p-4">
                <p
                  className="truncate text-sm font-semibold tracking-tight text-slate-800"
                  title={product.name}
                >
                  {product.name}
                </p>
                <p className="truncate text-[10px] font-medium text-slate-400 font-mono tracking-wider">
                  {product.sku}
                </p>
                {product.hasVariants ||
                (product.variants && product.variants.length > 0) ? (
                  <span className="w-fit rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-100">
                    Variants
                  </span>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-extrabold text-blue-600">
                      {formatCurrency(product.sellingPrice, settings)}
                    </span>
                    <span
                      className={`text-[10px] ${
                        product.stockQuantity <= 0
                          ? "font-bold text-red-500"
                          : product.stockQuantity <= 10
                          ? "font-semibold text-amber-600"
                          : "text-slate-400 font-medium"
                      }`}
                    >
                      {product.stockQuantity <= 0
                        ? "Out of Stock"
                        : `Stock: ${product.stockQuantity}`}
                    </span>
                  </div>
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
