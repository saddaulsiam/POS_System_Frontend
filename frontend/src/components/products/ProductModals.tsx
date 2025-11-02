import React from "react";
import { toast } from "react-hot-toast";
import { Product, Category, Supplier } from "../../types";
import { Button } from "../common";
import { Input, Select } from "../common/Input";

interface ProductModalsProps {
  // Add Modal
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  form: any;
  handleFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleAddProduct: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  categories: Category[];
  suppliers: Supplier[];
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;

  // Edit Modal
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  editProduct: Product | null;
  setEditProduct: (product: Product | null) => void;
  handleUpdateProduct: (e: React.FormEvent) => void;

  // Delete Modal
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  deletingId: number | null;
  setDeletingId: (id: number | null) => void;
  confirmDeleteProduct: () => void;

  // Print Modal
  showPrintModal: boolean;
  setShowPrintModal: (show: boolean) => void;
  printProduct: Product | null;
  setPrintProduct: (product: Product | null) => void;
  printCopies: number;
  setPrintCopies: (copies: number) => void;
  printBarcodeLabel: (product: Product, copies: number) => void;

  // Import Modal
  showImportModal: boolean;
  setShowImportModal: (show: boolean) => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  isImporting: boolean;
  handleImportCSV: () => void;
  handleDownloadTemplate: () => void;
}

export const ProductModals: React.FC<ProductModalsProps> = ({
  showAddModal,
  setShowAddModal,
  form,
  handleFormChange,
  handleAddProduct,
  isSubmitting,
  categories,
  suppliers,
  setImageFile,
  imagePreview,
  setImagePreview,
  showEditModal,
  setShowEditModal,
  editProduct,
  handleUpdateProduct,
  showDeleteConfirm,
  setShowDeleteConfirm,
  setDeletingId,
  confirmDeleteProduct,
  showPrintModal,
  setShowPrintModal,
  printProduct,
  setPrintProduct,
  printCopies,
  setPrintCopies,
  printBarcodeLabel,
  showImportModal,
  setShowImportModal,
  importFile,
  setImportFile,
  isImporting,
  handleImportCSV,
  handleDownloadTemplate,
}) => {
  return (
    <>
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowAddModal(false);
                setImageFile(null);
                setImagePreview("");
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="mb-2 text-center text-2xl font-bold text-blue-700">
              Add New Product
            </h2>
            <p className="mb-4 text-center text-sm text-gray-500">
              Fill in the details below to add a new product to your inventory.
            </p>
            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={handleAddProduct}
            >
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size must be less than 5MB");
                          return;
                        }
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded border object-cover"
                    />
                  )}
                </div>
                <span className="mt-1 block text-xs text-gray-400">
                  Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
                </span>
              </div>

              <div>
                <Input
                  name="name"
                  label={"Name"}
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. Coca Cola 500ml"
                />
              </div>
              <div>
                <Input
                  name="sku"
                  label={"SKU"}
                  value={form.sku}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. CC500ML"
                />
              </div>
              <div>
                <Input
                  name="barcode"
                  label={"Barcode (optional, company default)"}
                  value={form.barcode}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 123456789012"
                  maxLength={32}
                />
              </div>
              <div>
                <Select
                  name="categoryId"
                  label="Category"
                  value={form.categoryId}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  options={[
                    { value: "", label: "Select category" },
                    ...categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <Select
                  name="supplierId"
                  label="Supplier"
                  value={form.supplierId}
                  onChange={handleFormChange}
                  fullWidth
                  options={[
                    { value: "", label: "Select supplier (optional)" },
                    ...suppliers.map((supplier) => ({
                      value: supplier.id,
                      label: supplier.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <Input
                  name="purchasePrice"
                  label="Purchase Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 10.00"
                />
                <span className="text-xs text-gray-400">
                  The cost you pay to acquire this product.
                </span>
              </div>
              <div>
                <Input
                  name="sellingPrice"
                  label="Selling Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 15.00"
                />
                <span className="text-xs text-gray-400">
                  The price at which you sell this product.
                </span>
              </div>
              <div>
                <Input
                  name="stockQuantity"
                  label="Stock Quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 100"
                />
                <span className="text-xs text-gray-400">
                  Initial stock available for this product.
                </span>
              </div>
              <div>
                <Input
                  name="lowStockThreshold"
                  label="Low Stock Threshold"
                  type="number"
                  min="0"
                  step="1"
                  value={form.lowStockThreshold}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 10"
                />
                <span className="text-xs text-gray-400">
                  Get notified when stock falls below this number.
                </span>
              </div>
              <div>
                <Input
                  name="taxRate"
                  label="Tax Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.taxRate}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 5"
                />
                <span className="text-xs text-gray-400">
                  Leave 0 if not applicable.
                </span>
              </div>
              <div className="flex space-x-10">
                <div className="mt-2 flex items-center">
                  <input
                    id="isWeighted"
                    name="isWeighted"
                    type="checkbox"
                    checked={form.isWeighted}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isWeighted" className="text-sm font-medium">
                    Weighted Product
                  </label>
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>
              <div className="mt-2 md:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowEditModal(false);
                setImageFile(null);
                setImagePreview("");
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="mb-2 text-center text-2xl font-bold text-blue-700">
              Edit Product
            </h2>
            <p className="mb-4 text-center text-sm text-gray-500">
              Update the details below and save to apply changes to this
              product.
            </p>
            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={handleUpdateProduct}
            >
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Image size must be less than 5MB");
                          return;
                        }
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 rounded border object-cover"
                    />
                  )}
                </div>
                <span className="mt-1 block text-xs text-gray-400">
                  Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
                </span>
              </div>

              <div>
                <Input
                  name="name"
                  label={"Name"}
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. Coca Cola 500ml"
                />
              </div>
              <div>
                <Input
                  name="sku"
                  label={"SKU"}
                  value={form.sku}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. CC500ML"
                />
              </div>
              <div>
                <Input
                  name="barcode"
                  label={"Barcode (optional, company default)"}
                  value={form.barcode}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 123456789012"
                  maxLength={32}
                />
              </div>
              <div>
                <Select
                  name="categoryId"
                  label="Category"
                  value={form.categoryId}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  options={[
                    { value: "", label: "Select category" },
                    ...categories.map((cat) => ({
                      value: cat.id,
                      label: cat.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <Select
                  name="supplierId"
                  label="Supplier"
                  value={form.supplierId}
                  onChange={handleFormChange}
                  fullWidth
                  options={[
                    { value: "", label: "Select supplier (optional)" },
                    ...suppliers.map((supplier) => ({
                      value: supplier.id,
                      label: supplier.name,
                    })),
                  ]}
                />
              </div>
              <div>
                <Input
                  name="purchasePrice"
                  label="Purchase Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.purchasePrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 10.00"
                />
                <span className="text-xs text-gray-400">
                  The cost you pay to acquire this product.
                </span>
              </div>
              <div>
                <Input
                  name="sellingPrice"
                  label="Selling Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellingPrice}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 15.00"
                />
                <span className="text-xs text-gray-400">
                  The price at which you sell this product.
                </span>
              </div>
              <div>
                <Input
                  name="stockQuantity"
                  label="Stock Quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stockQuantity}
                  onChange={handleFormChange}
                  required
                  fullWidth
                  placeholder="e.g. 100"
                />
                <span className="text-xs text-gray-400">
                  Current stock available for this product.
                </span>
              </div>
              <div>
                <Input
                  name="lowStockThreshold"
                  label="Low Stock Threshold"
                  type="number"
                  min="0"
                  step="1"
                  value={form.lowStockThreshold}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 10"
                />
                <span className="text-xs text-gray-400">
                  Get notified when stock falls below this number.
                </span>
              </div>
              <div>
                <Input
                  name="taxRate"
                  label="Tax Rate (%)"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.taxRate}
                  onChange={handleFormChange}
                  fullWidth
                  placeholder="e.g. 5"
                />
                <span className="text-xs text-gray-400">
                  Leave 0 if not applicable.
                </span>
              </div>
              <div className="flex space-x-10">
                <div className="mt-2 flex items-center">
                  <input
                    id="isWeighted"
                    name="isWeighted"
                    type="checkbox"
                    checked={form.isWeighted}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isWeighted" className="text-sm font-medium">
                    Weighted Product
                  </label>
                </div>
                <div className="mt-2 flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
              </div>
              <div className="mt-2 md:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeletingId(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="mb-4 text-lg font-semibold">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletingId(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDeleteProduct}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Print Barcode Modal */}
      {showPrintModal && printProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowPrintModal(false);
                setPrintProduct(null);
                setPrintCopies(1);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="mb-4 text-center text-2xl font-bold text-purple-700">
              Print Barcode Labels
            </h2>
            <p className="mb-4 text-center text-sm text-gray-600">
              Print barcode labels for: <strong>{printProduct.name}</strong>
            </p>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Number of Labels
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={printCopies}
                onChange={(e) =>
                  setPrintCopies(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-400 focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-6">
              <p className="mb-2 text-xs text-gray-500">Quick Select:</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 5, 10, 20, 50].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPrintCopies(num)}
                    className={`rounded-lg border px-3 py-2 transition-all duration-150 ${
                      printCopies === num
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Labels will be arranged on A4 paper. 18
                labels will fit per page (3 columns × 6 rows).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  setPrintProduct(null);
                  setPrintCopies(1);
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-100 px-6 py-2 font-medium text-gray-700 transition-all duration-150 hover:bg-gray-200"
              >
                Cancel
              </button>
              <Button
                variant="warning"
                onClick={() => {
                  printBarcodeLabel(printProduct, printCopies);
                  setShowPrintModal(false);
                  setPrintProduct(null);
                  setPrintCopies(1);
                }}
              >
                🖨️ Print
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowImportModal(false);
                setImportFile(null);
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="mb-4 text-center text-2xl font-bold text-purple-700">
              Import Products
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Upload a CSV file to import multiple products at once. Make sure
              your CSV follows the correct format.
            </p>

            <div className="mb-4">
              <button
                className="mb-2 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-all duration-150 hover:bg-gray-200"
                onClick={handleDownloadTemplate}
              >
                📄 Download Template CSV
              </button>
              <p className="text-xs text-gray-500">
                Download a template file to see the correct format for importing
                products.
              </p>
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">
                Select CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-purple-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
              />
              {importFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {importFile.name}
                </p>
              )}
            </div>

            <div className="mb-4 rounded border border-blue-200 bg-blue-50 p-3">
              <p className="mb-1 text-xs font-semibold text-blue-800">
                Important Notes:
              </p>
              <ul className="list-inside list-disc space-y-1 text-xs text-blue-700">
                <li>SKUs must be unique</li>
                <li>Category IDs must exist in your database</li>
                <li>Supplier IDs are optional but must exist if provided</li>
                <li>All prices must be positive numbers</li>
              </ul>
            </div>

            <Button
              variant="warning"
              fullWidth
              size="lg"
              onClick={handleImportCSV}
              disabled={!importFile || isImporting}
            >
              {isImporting ? "Importing..." : "Import Products"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
