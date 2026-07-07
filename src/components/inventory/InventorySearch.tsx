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
  return (
    <div className="mb-6 space-y-4 rounded-lg bg-slate-50 p-4 border border-slate-200/80">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name or SKU..."
          className="w-full md:w-80 bg-white"
        />
        <div className="text-sm text-gray-500 font-medium">
          Total Products:{" "}
          <span className="font-semibold text-slate-800">{report?.totalProducts ?? 0}</span> |
          Low Stock:{" "}
          <span className="font-semibold text-yellow-600">
            {report?.lowStockCount ?? 0}
          </span>{" "}
          | Out of Stock:{" "}
          <span className="font-semibold text-red-600">
            {report?.outOfStockCount ?? 0}
          </span>
        </div>
      </div>

      {/* Sorting and Filtering controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Stock Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="NAME_ASC">Name: A to Z</option>
            <option value="NAME_DESC">Name: Z to A</option>
            <option value="STOCK_ASC">Stock: Low to High</option>
            <option value="STOCK_DESC">Stock: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};
