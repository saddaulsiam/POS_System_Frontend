import React from "react";
import { toast } from "react-hot-toast";
import { Category, Supplier, Brand } from "../../types";
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
  brands: Brand[];
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
  brands,
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
            name="brandId"
            label="Brand"
            value={form.brandId}
            onChange={handleFormChange}
            fullWidth
            options={[
              { value: "", label: "Select brand (optional)" },
              ...brands.map((brand) => ({
                value: brand.id,
                label: brand.name,
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
        {/* Toggles */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Weighted Product</h3>
                <p className="text-xs text-gray-500">Sold by weight (e.g. kg, lb).</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  name="isWeighted"
                  type="checkbox"
                  checked={form.isWeighted}
                  onChange={handleFormChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>
            
            {form.isWeighted && (
              <div className="mt-3 border-t border-gray-200 pt-3">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Weight Unit <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={form.unit}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="lb">Pound (lb)</option>
                  <option value="oz">Ounce (oz)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 h-fit">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Active Status</h3>
              <p className="text-xs text-gray-500">Enable or disable product.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleFormChange}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>
        </div>

        {/* Default Discount Section */}
        <div className="md:col-span-2">
          <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-orange-700">
              🏷️ Default Discount (auto-applied at POS)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={form.discountType || "NONE"}
                  onChange={handleFormChange}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  <option value="NONE">No Discount</option>
                  <option value="FIXED">Fixed Amount (৳)</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                </select>
              </div>
              {form.discountType && form.discountType !== "NONE" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">
                    Discount Value{" "}
                    {form.discountType === "PERCENTAGE" ? "(%)" : "(৳)"}
                  </label>
                  <input
                    name="discountValue"
                    type="number"
                    min="0"
                    max={form.discountType === "PERCENTAGE" ? 100 : undefined}
                    step="0.01"
                    value={form.discountValue || ""}
                    onChange={handleFormChange}
                    placeholder={
                      form.discountType === "PERCENTAGE" ? "e.g. 10" : "e.g. 50"
                    }
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <div className="mt-1 flex flex-col gap-0.5 text-xs">
                    <span className="text-gray-400">
                      {form.discountType === "PERCENTAGE"
                        ? "% off the selling price per item"
                        : "Fixed ৳ off per item at POS"}
                    </span>
                    {(parseFloat(form.purchasePrice) || 0) > 0 && (
                      <span className="font-semibold text-amber-700">
                        🛡️ Max allowed discount:{" "}
                        {form.discountType === "PERCENTAGE"
                          ? `${(parseFloat(form.sellingPrice) || 0) > 0 ? Math.floor((((parseFloat(form.sellingPrice) || 0) - (parseFloat(form.purchasePrice) || 0)) / (parseFloat(form.sellingPrice) || 1)) * 100 * 10) / 10 : 0}%`
                          : `৳${Math.max(0, (parseFloat(form.sellingPrice) || 0) - (parseFloat(form.purchasePrice) || 0)).toFixed(2)}`}{" "}
                        (Buy price: ৳{parseFloat(form.purchasePrice).toFixed(2)})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 md:col-span-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
