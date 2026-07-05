import React from "react";
import { Category } from "../../types";

interface POSCategoryListProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number | null) => void;
}

export const POSCategoryList: React.FC<POSCategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
}) => {
  return (
    <div className="mb-4">
      <h3 className="mb-3 text-lg font-medium text-gray-900">Categories</h3>
      <div
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .flex::-webkit-scrollbar { display: none; }
        `}} />
        <button
          onClick={() => onCategoryClick(null)}
          className={`min-w-[120px] snap-start flex-shrink-0 rounded-xl border p-3 shadow-sm transition-all hover:shadow ${
            selectedCategory === null
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="text-center">
            <div className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <span className="text-lg text-blue-600">🛒</span>
            </div>
            <p className="text-xs font-semibold text-gray-800">All Products</p>
          </div>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`min-w-[120px] snap-start flex-shrink-0 rounded-xl border p-3 shadow-sm transition-all hover:shadow ${
              selectedCategory === category.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-center">
              <div className="mx-auto mb-1.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                {category.icon ? (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="h-10 w-10 rounded-full object-cover p-0.5"
                  />
                ) : (
                  <span className="text-lg text-blue-600">📦</span>
                )}
              </div>
              <p className="text-xs font-semibold text-gray-800 truncate">
                {category.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
