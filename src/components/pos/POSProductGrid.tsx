import React from "react";
import { Category, Product } from "../../types";
import NewStoreMessage from "./NewStoreMessage";
import { POSCategoryList } from "./POSCategoryList";
import POSPageSkeleton from "./POSPageSkeleton";
import { POSProductList } from "./POSProductList";

interface POSProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
  onProductClick: (product: Product) => void;
  isLoading?: boolean;
  isLoadingProducts?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export const POSProductGrid: React.FC<POSProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onCategoryClick,
  onProductClick,
  isLoading = false,
  isLoadingProducts = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
}) => {
  // Don't show empty state during initial loading
  if (isLoading) return <POSPageSkeleton />;

  // Check if store is completely new (no categories and no products)
  const isNewStore = categories.length === 0 && products.length === 0;

  // New store welcome screen
  if (isNewStore) return <NewStoreMessage />;

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Category List */}
      <POSCategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryClick={onCategoryClick}
      />

      {/* Product List Grid */}
      <POSProductList
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        onProductClick={onProductClick}
        isLoadingProducts={isLoadingProducts}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </div>
  );
};
