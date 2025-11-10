import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSettings } from "../../context";
import {
  useCreateProductVariant,
  useUpdateProductVariant,
} from "../../services/queries";
import { Product, ProductVariant } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";
import { Button, Modal } from "../common";

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
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    isActive: true,
  });

  // React Query mutations
  const createVariant = useCreateProductVariant();
  const updateVariant = useUpdateProductVariant();
  const isSubmitting = createVariant.isPending || updateVariant.isPending;

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

    try {
      if (variant) {
        await updateVariant.mutateAsync({ id: variant.id, data });
        toast.success("Variant updated successfully");
      } else {
        await createVariant.mutateAsync(data);
        toast.success("Variant created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving variant:", error);
      toast.error(
        error.response?.data?.error || "Failed to save product variant",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-blue-100 p-2">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {variant ? "Edit" : "Add"} Product Variant
            </h2>
            <p className="text-sm text-gray-600">
              Product: <span className="font-semibold">{product.name}</span>
            </p>
          </div>
        </div>
      }
      size="2xl"
      footer={
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? "Saving..."
            : variant
              ? "Update Variant"
              : "Create Variant"}
        </Button>
      }
    >
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
        {formData.purchasePrice &&
          formData.sellingPrice &&
          !isNaN(parseFloat(formData.purchasePrice)) &&
          !isNaN(parseFloat(formData.sellingPrice)) &&
          parseFloat(formData.purchasePrice) > 0 &&
          parseFloat(formData.sellingPrice) > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Profit Margin:</span>{" "}
                {(
                  ((parseFloat(formData.sellingPrice) -
                    parseFloat(formData.purchasePrice)) /
                    parseFloat(formData.sellingPrice)) *
                  100
                ).toFixed(2)}
                % (
                {formatCurrency(
                  parseFloat(formData.sellingPrice) -
                    parseFloat(formData.purchasePrice),
                  settings,
                )}{" "}
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
      </form>
    </Modal>
  );
};
