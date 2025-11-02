import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ProductVariant, Product } from "../../types";
import { productVariantsAPI } from "../../services";
import { Button } from "../common";

interface ProductVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  variant?: ProductVariant | null;
  onSuccess: () => void;
}

export const ProductVariantModal: React.FC<ProductVariantModalProps> = ({
  isOpen,
  onClose,
  product,
  variant,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (variant) {
      setFormData({
        name: variant.name,
        sku: variant.sku,
        barcode: variant.barcode || "",
        purchasePrice: variant.purchasePrice.toString(),
        sellingPrice: variant.sellingPrice.toString(),
        stockQuantity: variant.stockQuantity?.toString() || "0",
        isActive: variant.isActive,
      });
    } else {
      setFormData({
        name: "",
        sku: "",
        barcode: "",
        purchasePrice: product.purchasePrice.toString(),
        sellingPrice: product.sellingPrice.toString(),
        stockQuantity: "0",
        isActive: true,
      });
    }
  }, [variant, product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Variant name is required");
      return;
    }
    if (!formData.sku.trim()) {
      toast.error("SKU is required");
      return;
    }
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      toast.error("Valid purchase price is required");
      return;
    }
    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      toast.error("Valid selling price is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        productId: product.id,
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim() || undefined,
        purchasePrice: parseFloat(formData.purchasePrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        isActive: formData.isActive,
      };

      if (variant) {
        await productVariantsAPI.update(variant.id, data);
        toast.success("Variant updated successfully");
      } else {
        await productVariantsAPI.create(data);
        toast.success("Variant created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving variant:", error);
      toast.error(
        error.response?.data?.error || "Failed to save product variant",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <button
          className="absolute right-4 top-4 text-xl text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          {variant ? "Edit" : "Add"} Product Variant
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Product: <span className="font-semibold">{product.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Variant Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Variant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Small, Large, Red, 500ml"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* SKU and Barcode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., PROD-001-SM"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Barcode (Optional)
              </label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="e.g., 1234567890123"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Purchase Price and Selling Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Purchase Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Initial Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Profit Margin Display */}
          {formData.purchasePrice && formData.sellingPrice && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Profit Margin:</span>{" "}
                {(
                  ((parseFloat(formData.sellingPrice) -
                    parseFloat(formData.purchasePrice)) /
                    parseFloat(formData.sellingPrice)) *
                  100
                ).toFixed(2)}
                % (${" "}
                {(
                  parseFloat(formData.sellingPrice) -
                  parseFloat(formData.purchasePrice)
                ).toFixed(2)}{" "}
                per unit)
              </p>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active (available for sale)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : variant
                  ? "Update Variant"
                  : "Create Variant"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
