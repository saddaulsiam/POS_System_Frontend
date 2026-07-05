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
  const [columns, setColumns] = React.useState(2);

  // Monitor screen width resize to dynamically compute columns matching Tailwind breakpoints
  React.useEffect(() => {
    const updateColumns = () => {
      const w = window.innerWidth;
      if (w >= 1536) setColumns(8);
      else if (w >= 1280) setColumns(6);
      else if (w >= 1024) setColumns(4);
      else if (w >= 640) setColumns(3);
      else setColumns(2);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const totalItems = categories.length + 1; // +1 for "All Products"
  const maxItems = columns * 2;
  const showLoadMore = totalItems > maxItems && !isExpanded;

  // Slice categories dynamically to leave exactly one slot for All Products and one for the Load More button
  const displayedCategories = showLoadMore ? categories.slice(0, maxItems - 2) : categories;

  const handleLoadMore = () => {
    setIsExpanded(true);
    if (onLoadMoreCategories) {
      onLoadMoreCategories();
    }
  };

  return (
    <div className="mb-6">
      <h3 className="mb-4 text-lg font-semibold tracking-tight text-slate-800">Categories</h3>
      <div 
        className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 transition-all duration-500 ease-in-out p-1 -m-1 ${
          !isExpanded ? "overflow-hidden" : ""
        }`}
      >
        {/* 1st Item: All Products */}
        <button
          onClick={() => onCategoryClick(null)}
          className={`group rounded-xl border p-4 transition-all duration-300 transform hover:-translate-y-0.5 ${
            selectedCategory === null
              ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-[0_8px_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20"
              : "border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-blue-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
          }`}
        >
          <div className="text-center">
            <div className={`mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
              selectedCategory === null
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
            }`}>
              <span className="text-xl">🛒</span>
            </div>
            <p className="text-xs font-semibold text-slate-800 tracking-wide truncate">All Products</p>
          </div>
        </button>

        {/* Categories List */}
        {displayedCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={`group rounded-xl border p-4 transition-all duration-300 transform hover:-translate-y-0.5 ${
                isSelected
                  ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-[0_8px_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20"
                  : "border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:border-blue-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
              }`}
            >
              <div className="text-center">
                <div className={`mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                }`}>
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="h-12 w-12 rounded-full object-cover p-0.5"
                    />
                  ) : (
                    <span className="text-xl">📦</span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-800 tracking-wide truncate">
                  {category.name}
                </p>
              </div>
            </button>
          );
        })}

        {/* Load More category button - Dynamically placed as the last child of exactly 2 rows */}
        {showLoadMore && (
          <button
            onClick={handleLoadMore}
            className="group rounded-xl border border-slate-100 bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 transform hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="text-center">
              <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                <span className="text-xl">➕</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 tracking-wide truncate">Load More</p>
            </div>
          </button>
        )}

        {/* Show Less category button - Placed at the very end of the categories when expanded */}
        {isExpanded && totalItems > maxItems && (
          <button
            onClick={() => setIsExpanded(false)}
            className="group rounded-xl border border-slate-100 bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-300 transform hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="text-center">
              <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                <span className="text-xl">➖</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 tracking-wide truncate">Show Less</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
