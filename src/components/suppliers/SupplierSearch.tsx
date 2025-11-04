import React from "react";
import { SearchBar } from "../common";

interface SupplierSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const SupplierSearch: React.FC<SupplierSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search suppliers by name, contact, phone, or email..."
        showClearButton={true}
        fullWidth={true}
      />
    </div>
  );
};
