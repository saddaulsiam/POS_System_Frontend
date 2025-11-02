import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ProductVariant, Product } from "../../types";
import { productVariantsAPI } from "../../services";
import { Button } from "../common";
import { ProductVariantModal } from "./ProductVariantModal";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface ProductVariantListProps {
  product: Product;
}

export const ProductVariantList: React.FC<ProductVariantListProps> = ({
  product,
}) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { settings } = useSettings();

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const response = await productVariantsAPI.getAll({
        productId: product.id,
      });
      const variants = Array.isArray(response) ? response : response.data || [];
      setVariants(variants);
    } catch (error) {
      console.error("Error fetching variants:", error);
      toast.error("Failed to load product variants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [product.id]);

  const handleAddVariant = () => {
    setEditingVariant(null);
    setShowModal(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setShowModal(true);
  };

  const handleDeleteVariant = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    try {
      setDeletingId(id);
      await productVariantsAPI.delete(id);
      toast.success("Variant deleted successfully");
      fetchVariants();
    } catch (error: any) {
      console.error("Error deleting variant:", error);
      toast.error(error.response?.data?.error || "Failed to delete variant");
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingVariant(null);
  };

  const handleSuccess = () => {
    fetchVariants();
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading variants...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Product Variants
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage different sizes, colors, or variations of this product
          </p>
        </div>
        {variants.length > 0 && (
          <Button
            variant="primary"
            onClick={handleAddVariant}
            className="flex items-center"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Variant
          </Button>
        )}
      </div>

      {/* Variants Table */}
      <div className="overflow-x-auto">
        {variants.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No variants
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new product variant.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                onClick={handleAddVariant}
                className="flex items-center"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Variant
              </Button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Variant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {variants.map((variant) => (
                <tr key={variant.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {variant.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{variant.sku}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {variant.barcode || "-"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(variant.purchasePrice, settings)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(variant.sellingPrice, settings)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margin:{" "}
                      {(
                        ((variant.sellingPrice - variant.purchasePrice) /
                          variant.sellingPrice) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div
                      className={`text-sm font-medium ${
                        (variant.stockQuantity || 0) > 10
                          ? "text-green-600"
                          : (variant.stockQuantity || 0) > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {variant.stockQuantity || 0}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${
                        variant.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {variant.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="space-x-2 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleEditVariant(variant)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVariant(variant.id)}
                      disabled={deletingId === variant.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deletingId === variant.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {variants.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold">{variants.length}</span> variant
              {variants.length !== 1 ? "s" : ""} •{" "}
              <span className="font-semibold">
                {variants.filter((v) => v.isActive).length}
              </span>{" "}
              active
            </div>
            <div>
              Total Stock:{" "}
              <span className="font-semibold">
                {variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <ProductVariantModal
        isOpen={showModal}
        onClose={handleModalClose}
        product={product}
        variant={editingVariant}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
