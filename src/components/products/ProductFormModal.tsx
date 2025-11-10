import React from "react";
import { toast } from "react-hot-toast";
import { Category, Supplier } from "../../types";
import { Button, Modal } from "../common";
import { Input, Select } from "../common/Input";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  form: any;
  handleFormChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitButtonText: string;
  categories: Category[];
  suppliers: Supplier[];
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  form,
  handleFormChange,
  handleSubmit,
  isSubmitting,
  submitButtonText,
  categories,
  suppliers,
  setImageFile,
  imagePreview,
  setImagePreview,
}) => {
  const handleClose = () => {
    onClose();
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div>
          <h2 className="pt-3 text-center text-2xl font-bold text-blue-700">
            {title}
          </h2>
          <p className="mt-1 text-center text-sm text-gray-500">{subtitle}</p>
        </div>
      }
      size="2xl"
    >
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        onSubmit={handleSubmit}
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
            label="Name"
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
            label="SKU"
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
            label="Barcode (optional, company default)"
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
            {form.id ? "Current" : "Initial"} stock available for this product.
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
            {isSubmitting ? "Saving..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
