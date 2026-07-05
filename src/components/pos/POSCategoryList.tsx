import React from "react";
import { Category } from "../../types";

interface POSCategoryListProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
  onLoadMoreCategories?: () => void;
}

export const POSCategoryList: React.FC<POSCategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
  onLoadMoreCategories,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const totalItems = categories.length + 1; // +1 for "All Products"
  const showLoadMore = totalItems > 16 && !isExpanded;

  // Slice categories if we need to show the Load More button in the 16th slot
  const displayedCategories = showLoadMore ? categories.slice(0, 14) : categories;

  const handleLoadMore = () => {
    setIsExpanded(true);
    if (onLoadMoreCategories) {
      onLoadMoreCategories();
    }
  };

  return (
    <div className="mb-6">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Categories</h3>
      <div 
        className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 overflow-hidden ${
          !isExpanded ? "max-h-[236px]" : ""
        }`}
      >
        {/* 1st Item: All Products */}
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
            <p className="text-sm font-medium text-gray-900 truncate">All Products</p>
          </div>
        </button>

        {/* Categories List (14 items if collapsed, all if expanded) */}
        {displayedCategories.map((category) => (
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
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                {category.icon ? (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="h-12 w-12 rounded-full object-cover p-0.5"
                  />
                ) : (
                  <span className="text-xl text-blue-600">📦</span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {category.name}
              </p>
            </div>
          </button>
        ))}

        {/* 16th Item: Load More category button */}
        {showLoadMore && (
          <button
            onClick={handleLoadMore}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-md hover:border-blue-500"
          >
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <span className="text-xl text-blue-600">➕</span>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">Load More</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
