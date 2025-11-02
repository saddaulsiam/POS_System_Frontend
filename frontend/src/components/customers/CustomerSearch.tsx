import React from "react";
import { SearchBar } from "../common";

interface CustomerSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search customers by name, phone, or email..."
        showClearButton={true}
        fullWidth={true}
      />
    </div>
  );
};
