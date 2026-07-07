import React, { useEffect, useState } from "react";
import { Product, Category, Supplier } from "../../types";
import { Button, Modal, ConfirmModal } from "../common";
import { ProductFormModal } from "./ProductFormModal";
import type {
  BarcodePrintOptions,
  BarcodeStickerTemplate,
} from "../../utils/productUtils";
import { productsAPI } from "../../services";

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
  printBarcodeLabel: (
    product: Product,
    copies: number,
    options?: BarcodePrintOptions,
  ) => void;

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
  const [labelTemplate, setLabelTemplate] =
    useState<BarcodeStickerTemplate>("thermal-40x30");
  const [showProductName, setShowProductName] = useState(true);
  const [showSku, setShowSku] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showBarcodeText, setShowBarcodeText] = useState(false);
  const [barcodePreviewSrc, setBarcodePreviewSrc] = useState("");

  useEffect(() => {
    if (!showPrintModal) return;
    setLabelTemplate("thermal-40x30");
    setShowProductName(true);
    setShowSku(true);
    setShowPrice(true);
    setShowBarcodeText(false);
  }, [showPrintModal, printProduct]);

  useEffect(() => {
    let cancelled = false;

    const loadBarcodePreview = async () => {
      if (!showPrintModal || !printProduct) {
        setBarcodePreviewSrc("");
        return;
      }

      setBarcodePreviewSrc("");

      try {
        const dataUrl = await productsAPI.getBarcodeImage(printProduct.id);
        if (!cancelled) {
          setBarcodePreviewSrc(dataUrl);
        }
      } catch {
        if (!cancelled) {
          setBarcodePreviewSrc("");
        }
      }
    };

    void loadBarcodePreview();

    return () => {
      cancelled = true;
    };
  }, [showPrintModal, printProduct]);

  const printOptions: BarcodePrintOptions = {
    template: labelTemplate,
    showProductName,
    showSku,
    showPrice,
    showBarcodeText,
  };

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
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingId(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Print Barcode Modal */}
      {printProduct && (
        <Modal
          isOpen={showPrintModal}
          onClose={() => {
            setShowPrintModal(false);
            setPrintProduct(null);
            setPrintCopies(1);
          }}
          title={
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Custom Barcode Sticker Generator
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Design a printable barcode price sticker for:{" "}
                <strong>{printProduct.name}</strong>
              </p>
            </div>
          }
          size="3xl"
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
              <Button
                variant="primary"
                onClick={() => {
                  printBarcodeLabel(printProduct, printCopies, printOptions);
                  setShowPrintModal(false);
                  setPrintProduct(null);
                  setPrintCopies(1);
                }}
              >
                🖨️ Generate & Print
              </Button>
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Label Template
                  </label>
                  <select
                    value={labelTemplate}
                    onChange={(e) =>
                      setLabelTemplate(e.target.value as BarcodeStickerTemplate)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="thermal-40x30">Thermal 40 x 30 mm</option>
                    <option value="thermal-50x30">Thermal 50 x 30 mm</option>
                    <option value="thermal-60x40">Thermal 60 x 40 mm</option>
                    <option value="a4-sheet-3x8">
                      A4 Sheet (3 x 8 labels)
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Labels
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={printCopies}
                    onChange={(e) =>
                      setPrintCopies(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quick Select
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPrintCopies(num)}
                      className={`rounded-lg border px-3 py-2 transition-all duration-150 ${
                        printCopies === num
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPrintCopies(
                        Math.max(
                          1,
                          Math.round(printProduct.stockQuantity || 1),
                        ),
                      )
                    }
                    className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-100"
                  >
                    Current Qty (
                    {Math.max(1, Math.round(printProduct.stockQuantity || 1))})
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Sticker Content
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Product Name", showProductName, setShowProductName],
                    ["SKU Line", showSku, setShowSku],
                    ["Price Tag", showPrice, setShowPrice],
                    ["Barcode Text", showBarcodeText, setShowBarcodeText],
                  ].map(([label, value, setter]) => (
                    <label
                      key={label as string}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) =>
                          (
                            setter as React.Dispatch<
                              React.SetStateAction<boolean>
                            >
                          )(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{label as string}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Live Preview
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {labelTemplate.replace(/-/g, " ")}
                </span>
              </div>

              <div className="w-full rounded-xl border border-slate-900/10 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                {showProductName && (
                  <div className="text-center text-[13px] font-black uppercase tracking-wide text-slate-900 border-b border-slate-100 pb-1.5 mb-1.5">
                    {printProduct.name}
                  </div>
                )}
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  {barcodePreviewSrc ? (
                    <img
                      src={barcodePreviewSrc}
                      alt={`Barcode preview for ${printProduct.name}`}
                      className="h-24 w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-slate-200 text-xs font-medium text-slate-500">
                      Loading barcode preview...
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-2">
                  <div className="flex flex-col items-start leading-tight">
                    {showSku && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        SKU: {printProduct.sku}
                      </span>
                    )}
                    {showBarcodeText && (
                      <span className="font-mono text-[9px] font-bold text-slate-900 tracking-wider">
                        {printProduct.barcode ||
                          printProduct.sku ||
                          String(printProduct.id)}
                      </span>
                    )}
                  </div>
                  {showPrice && (
                    <span className="text-[15px] font-black text-slate-900 leading-none">
                      ${printProduct.sellingPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

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
