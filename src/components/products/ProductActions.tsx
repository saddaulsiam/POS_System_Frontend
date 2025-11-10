import { FC } from "react";
import { Button, Dropdown } from "../common";

interface ProductActionsProps {
  canWrite: boolean;
  onExport: () => void;
  onExportExcel: () => void;
  onImport: () => void;
  onImportExcel: () => void;
  onAddNew: () => void;
}

export const ProductActions: FC<ProductActionsProps> = ({
  canWrite,
  onExport,
  onExportExcel,
  onImport,
  onImportExcel,
  onAddNew,
}) => {
  if (!canWrite) {
    return null;
  }

  const exportItems = [
    {
      label: "Export as CSV",
      icon: "📄",
      onClick: onExport,
    },
    {
      label: "Export as Excel",
      icon: "📊",
      onClick: onExportExcel,
    },
  ];

  const importItems = [
    {
      label: "Import from CSV",
      icon: "📄",
      onClick: onImport,
    },
    {
      label: "Import from Excel",
      icon: "📊",
      onClick: onImportExcel,
    },
  ];

  return (
    <div className="flex gap-2">
      {/* Export Dropdown */}
      <Dropdown
        trigger={
          <Button
            variant="success"
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
        }
        items={exportItems}
        align="right"
      />

      {/* Import Dropdown */}
      <Dropdown
        trigger={
          <Button
            variant="warning"
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
        }
        items={importItems}
        align="right"
      />

      <Button variant="primary" onClick={onAddNew}>
        Add New Product
      </Button>
    </div>
  );
};
