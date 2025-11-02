import React from "react";
import { SearchBar } from "../common";

interface EmployeeSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const EmployeeSearch: React.FC<EmployeeSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <SearchBar
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search employees by name or username..."
        showClearButton={true}
        fullWidth={true}
      />
    </div>
  );
};
