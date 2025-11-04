import React, { useState } from "react";
import { Button } from "../common";

interface ProductActionsProps {
  canWrite: boolean;
  onExport: () => void;
  onExportExcel: () => void;
  onImport: () => void;
  onImportExcel: () => void;
  onAddNew: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  canWrite,
  onExport,
  onExportExcel,
  onImport,
  onImportExcel,
  onAddNew,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);

  if (!canWrite) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {/* Export Dropdown */}
      <div className="relative">
        <Button
          variant="success"
          onClick={() => setShowExportMenu(!showExportMenu)}
          title="Export products"
          className="flex items-center"
        >
          📥 Export
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        {showExportMenu && (
          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              onClick={() => {
                onExport();
                setShowExportMenu(false);
              }}
              className="block w-full rounded-t-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              📄 Export as CSV
            </button>
            <button
              onClick={() => {
                onExportExcel();
                setShowExportMenu(false);
              }}
              className="block w-full rounded-b-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              📊 Export as Excel
            </button>
          </div>
        )}
      </div>

      {/* Import Dropdown */}
      <div className="relative">
        <Button
          variant="warning"
          onClick={() => setShowImportMenu(!showImportMenu)}
          title="Import products"
          className="flex items-center"
        >
          📤 Import
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
        {showImportMenu && (
          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              onClick={() => {
                onImport();
                setShowImportMenu(false);
              }}
              className="block w-full rounded-t-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              📄 Import from CSV
            </button>
            <button
              onClick={() => {
                onImportExcel();
                setShowImportMenu(false);
              }}
              className="block w-full rounded-b-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              📊 Import from Excel
            </button>
          </div>
        )}
      </div>

      <Button variant="primary" onClick={onAddNew}>
        Add New Product
      </Button>
    </div>
  );
};
