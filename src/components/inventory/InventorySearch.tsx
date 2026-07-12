import React from "react";
import { SearchBar } from "../common";
import { InventoryReport } from "../../types";

interface InventorySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  categories: string[];
  report: InventoryReport | null;
}

export const InventorySearch: React.FC<InventorySearchProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  categories,
  report,
}) => {
  // Dynamically calculate counts using the exact same resolver logic as the table
  const products = report?.products ?? [];
  const total = products.length;
  
  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  products.forEach((product) => {
    const hasVariants = product.hasVariants && product.variants && product.variants.length > 0;
    if (hasVariants && product.variants) {
      const totalVariants = product.variants.length;
      const outOfStockCount = product.variants.filter((v) => v.stockQuantity <= 0).length;
      const lowStockCount = product.variants.filter(
        (v) => v.stockQuantity > 0 && v.stockQuantity <= product.lowStockThreshold
      ).length;

      if (outOfStockCount === totalVariants) {
        outOfStock++;
      } else if (outOfStockCount > 0 || lowStockCount > 0) {
        lowStock++;
      } else {
        inStock++;
      }
    } else {
      if (product.stockQuantity <= 0) {
        outOfStock++;
      } else if (product.stockQuantity <= product.lowStockThreshold) {
        lowStock++;
      } else {
        inStock++;
      }
    }
  });

  const statusPills = [
    {
      label: "All Products",
      value: "ALL",
      count: total,
      color: "bg-slate-100 text-slate-800 border-slate-200 active:bg-slate-200",
    },
    {
      label: "In Stock",
      value: "IN_STOCK",
      count: inStock,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200 active:bg-emerald-100",
    },
    {
      label: "Low Stock",
      value: "LOW_STOCK",
      count: lowStock,
      color: "bg-amber-50 text-amber-700 border-amber-200 active:bg-amber-100",
    },
    {
      label: "Out of Stock",
      value: "OUT_OF_STOCK",
      count: outOfStock,
      color: "bg-rose-50 text-rose-700 border-rose-200 active:bg-rose-100",
    },
  ];

  return (
    <div className="space-y-6 mb-6">
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Products Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-800">{total}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>

        {/* In Stock Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Stock</p>
              <h3 className="mt-1 text-2xl font-bold text-emerald-600">{inStock}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500" />
        </div>

        {/* Low Stock Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Low Stock</p>
              <h3 className="mt-1 text-2xl font-bold text-amber-600">{lowStock}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500" />
        </div>

        {/* Out of Stock Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Out of Stock</p>
              <h3 className="mt-1 text-2xl font-bold text-rose-600">{outOfStock}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-rose-500" />
        </div>
      </div>

      {/* Single-row Search and Filters bar */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Left: Search Box */}
          <div className="w-full xl:w-80">
            <SearchBar
              value={search}
              onChange={onSearchChange}
              placeholder="Search products..."
              className="w-full bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>

          {/* Center: Quick Filters Pill Nav */}
          <div className="flex flex-wrap gap-2 items-center">
            {statusPills.map((pill) => {
              const isActive = statusFilter === pill.value;
              return (
                <button
                  key={pill.value}
                  onClick={() => onStatusFilterChange(pill.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive ? "border-slate-800 bg-slate-900 text-white shadow-sm" : `${pill.color} hover:shadow-sm`
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-200/60 text-slate-700"
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Dropdown Filters and Sort */}
          <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilterChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 shadow-sm transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
              >
                <option value="NAME_ASC">Name: A-Z</option>
                <option value="NAME_DESC">Name: Z-A</option>
                <option value="STOCK_ASC">Stock: Low-High</option>
                <option value="STOCK_DESC">Stock: High-Low</option>
              </select>
            </div>

            {/* Clear Filters Button (If any active) */}
            {(search || statusFilter !== "ALL" || categoryFilter !== "ALL" || sortBy !== "NAME_ASC") && (
              <button
                onClick={() => {
                  onSearchChange("");
                  onStatusFilterChange("ALL");
                  onCategoryFilterChange("ALL");
                  onSortByChange("NAME_ASC");
                }}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:text-red-700"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

