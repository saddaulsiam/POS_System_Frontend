import React from "react";
import { SearchBar } from "../common";
import { Category, Brand } from "../../types";

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  categories: Category[];
  brands: Brand[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  categories,
  brands,
}) => {
  return (
    <div className="flex w-full gap-2 md:w-auto">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or SKU..."
        className="w-full md:w-64"
      />
      <select
        className="rounded border px-3 py-2"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        className="rounded border px-3 py-2"
        value={brandFilter}
        onChange={(e) => setBrandFilter(e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
};
