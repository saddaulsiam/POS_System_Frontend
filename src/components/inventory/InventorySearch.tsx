import React from "react";
import { SearchBar } from "../common";
import { InventoryReport } from "../../types";

interface InventorySearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  report: InventoryReport | null;
}

export const InventorySearch: React.FC<InventorySearchProps> = ({
  search,
  onSearchChange,
  report,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search by name or SKU..."
        className="w-full md:w-80"
      />
      <div className="text-sm text-gray-500">
        Total Products:{" "}
        <span className="font-semibold">{report?.totalProducts ?? 0}</span> |
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
  );
};
