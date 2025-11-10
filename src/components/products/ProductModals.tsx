import React from "react";
import { Product, Category, Supplier } from "../../types";
import { Button, Modal } from "../common";
import { ProductFormModal } from "./ProductFormModal";

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
      <ProductFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        subtitle="Fill in the details below to add a new product to your inventory."
        form={form}
        handleFormChange={handleFormChange}
        handleSubmit={handleAddProduct}
        isSubmitting={isSubmitting}
        submitButtonText="Add Product"
        categories={categories}
        suppliers={suppliers}
        imageFile={null}
        setImageFile={setImageFile}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />

      {/* Edit Product Modal */}
      {editProduct && (
        <ProductFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Product"
          subtitle="Update the details below and save to apply changes to this product."
          form={form}
          handleFormChange={handleFormChange}
          handleSubmit={handleUpdateProduct}
          isSubmitting={isSubmitting}
          submitButtonText="Save Changes"
          categories={categories}
          suppliers={suppliers}
          imageFile={null}
          setImageFile={setImageFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingId(null);
        }}
        title="Confirm Deletion"
        size="sm"
        footer={
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
        }
      >
        <p>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
      </Modal>

      {/* Print Barcode Modal */}
      <Modal
        isOpen={showPrintModal && printProduct !== null}
        onClose={() => {
          setShowPrintModal(false);
          setPrintProduct(null);
          setPrintCopies(1);
        }}
        title={
          <div>
            <h2 className="text-2xl font-bold text-purple-700">
              Print Barcode Labels
            </h2>
            {printProduct && (
              <p className="mt-1 text-sm text-gray-600">
                Print barcode labels for: <strong>{printProduct.name}</strong>
              </p>
            )}
          </div>
        }
        size="md"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowPrintModal(false);
                setPrintProduct(null);
                setPrintCopies(1);
              }}
            >
              Cancel
            </Button>
            {printProduct && (
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
            )}
          </div>
        }
      >
        <div className="space-y-6">
          <div>
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

          <div>
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

          <div className="rounded border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Labels will be arranged on A4 paper. 18
              labels will fit per page (3 columns × 6 rows).
            </p>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          setImportFile(null);
        }}
        title={
          <div>
            <h2 className="text-2xl font-bold text-purple-700">
              Import Products
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Upload a CSV file to import multiple products at once. Make sure
              your CSV follows the correct format.
            </p>
          </div>
        }
        size="md"
        footer={
          <Button
            variant="warning"
            fullWidth
            size="lg"
            onClick={handleImportCSV}
            disabled={!importFile || isImporting}
          >
            {isImporting ? "Importing..." : "Import Products"}
          </Button>
        }
      >
        <div className="space-y-4">
          <div>
            <Button variant="ghost" fullWidth onClick={handleDownloadTemplate}>
              📄 Download Template CSV
            </Button>
            <p className="mt-1 text-xs text-gray-500">
              Download a template file to see the correct format for importing
              products.
            </p>
          </div>

          <div>
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

          <div className="rounded border border-blue-200 bg-blue-50 p-3">
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
        </div>
      </Modal>
    </>
  );
};
