import React, { useMemo } from "react";
import { useSettings } from "../../context/SettingsContext";
import { useProductVariants } from "../../services/queries";
import { Product, ProductVariant } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";
import { Button, Modal, Skeleton } from "../common";

interface VariantSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const VariantSelectorModal: React.FC<VariantSelectorModalProps> = ({
  isOpen,
  onClose,
  product,
  onSelectVariant,
}) => {
  const { settings } = useSettings();

  // Fetch variants using React Query
  const { data: variantsData, isLoading: loading } = useProductVariants(
    isOpen && product.id ? { productId: product.id } : undefined,
  );

  // Filter active variants with stock
  const variants = useMemo(() => {
    const variantsArr = Array.isArray(variantsData)
      ? variantsData
      : variantsData?.data || [];
    return variantsArr.filter(
      (v: ProductVariant) => v.isActive && (v.stockQuantity || 0) > 0,
    );
  }, [variantsData]);

  const handleSelectVariant = (variant: ProductVariant) => {
    onSelectVariant(variant);
    onClose();
  };

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Reset selectedIndex when modal opens or variants change
  React.useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen, variants]);

  // Keyboard navigation inside VariantSelectorModal
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (variants.length === 0) return;

      // 1. Arrow Down to move selection
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < variants.length - 1 ? prev + 1 : prev));
        return;
      }

      // 2. Arrow Up to move selection
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      // 3. Enter to select the highlighted variant
      if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < variants.length) {
          handleSelectVariant(variants[selectedIndex]);
        }
        return;
      }

      // 4. Number keys 1-9 to select directly
      const keyNum = parseInt(e.key);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
        const targetIndex = keyNum - 1;
        if (targetIndex < variants.length) {
          e.preventDefault();
          handleSelectVariant(variants[targetIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, variants, selectedIndex, onClose]);

  // Compute totals for header context
  const availableCount = variants.length;
  const totalStock = variants.reduce(
    (sum: number, v: ProductVariant) => sum + (v.stockQuantity || 0),
    0,
  );
  const subtitle = loading
    ? "Loading variants..."
    : availableCount === 0
      ? "No active variants in stock"
      : `${availableCount} variant${availableCount > 1 && "s"} • ${totalStock} unit${totalStock > 1 && "s"} available`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-blue-100">
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
            <h2 className="text-lg font-bold text-gray-900">
              Select Variant — {product.name}
            </h2>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
      }
      size="lg"
      footer={
        <Button
          variant="ghost"
          onClick={() => onClose()}
          disabled={loading}
          className="flex items-center justify-center"
        >
          <svg
            className="mr-1 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel
        </Button>
      }
    >
      <div className="p-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-4 rounded-xl border-2 border-gray-200 bg-white p-5"
              >
                <Skeleton variant="rectangular" width="3rem" height="3rem" />
                <div className="flex-1">
                  <Skeleton height="1rem" width="40%" className="mb-2" />
                  <Skeleton height="0.75rem" width="30%" />
                </div>
                <div className="w-20">
                  <Skeleton height="1rem" width="100%" />
                </div>
              </div>
            ))}
          </div>
        ) : variants.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="mb-2 text-xl font-semibold text-gray-900">
              No variants available
            </p>
            <p className="text-sm text-gray-600">
              All variants are either inactive or out of stock.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4 rounded-r-lg border-l-4 border-blue-500 bg-blue-50 p-3">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-blue-800">
                  Select a variant to add to cart
                </p>
              </div>
            </div>

            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2">
              {variants.map((variant: ProductVariant, index: number) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={variant.id}
                    onClick={() => handleSelectVariant(variant)}
                    className={`group relative w-full rounded-xl border-2 p-2.5 text-left transition-all duration-200 hover:shadow-md focus:outline-none ${
                      isSelected
                        ? "border-blue-600 ring-2 ring-blue-100 shadow-md"
                        : "border-gray-200 bg-white hover:border-blue-500"
                    }`}
                  >
                  {/* Hover Effect Background */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>

                  <div className="relative flex items-center justify-between">
                    {/* Left Section: Icon and Info */}
                    <div className="flex flex-1 items-center">
                      <div className="mr-4 flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 transition-colors group-hover:bg-gray-200">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-14 w-14 object-cover object-center"
                          />
                        ) : (
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600 flex items-center gap-2">
                          {index < 9 && (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-500 border border-gray-200">
                              {index + 1}
                            </span>
                          )}
                          {variant.name}
                        </h3>
                        {variant.sku && (
                          <p className="mt-0.5 font-mono text-xs text-gray-500">
                            SKU: {variant.sku}
                          </p>
                        )}

                        {/* Stock Badge */}
                        <div className="mt-2">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                              (variant.stockQuantity || 0) > 10
                                ? "bg-green-100 text-green-700"
                                : (variant.stockQuantity || 0) > 5
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            <svg
                              className="mr-1 h-3.5 w-3.5"
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
                            {variant.stockQuantity || 0} in stock
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Price and Arrow */}
                    <div className="ml-4 flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-base font-bold text-gray-900">
                          {formatCurrency(variant.sellingPrice, settings)}
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
