import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import { useQuickSaleItems } from "../../services/queries";
import { Product, QuickSaleItem } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";
import { Button } from "../common";

interface QuickSaleButtonsProps {
  onProductSelect: (product: Product) => void;
}

export const QuickSaleButtons: React.FC<QuickSaleButtonsProps> = ({
  onProductSelect,
}) => {
  const [showManageModal, setShowManageModal] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSettings();

  // Fetch quick sale items using React Query
  const { data: allQuickItems = [], isLoading: loading } = useQuickSaleItems();

  // Filter active items
  const quickItems = allQuickItems.filter(
    (item: QuickSaleItem) => item.isActive,
  );

  const handleQuickItemClick = (item: QuickSaleItem) => {
    if (!item.product) return;

    if (item.product.stockQuantity <= 0 && !item.product.hasVariants) {
      toast.error("Product is out of stock");
      return;
    }

    onProductSelect(item.product);
  };

  const handleConfigureClick = () => {
    navigate("/products");
    toast.success("Opening Products page to configure quick sale items");
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            Loading quick items...
          </span>
        </div>
      </div>
    );
  }

  if (quickItems.length === 0) {
    return (
      <div className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Quick Sale Items
          </h3>

          {/* Description */}
          <p className="mx-auto mb-4 max-w-sm text-sm text-gray-600">
            Add your most frequently sold products here for lightning-fast
            checkout
          </p>

          {/* Features List */}
          <div className="mx-auto mb-4 max-w-sm rounded-lg bg-white p-4 text-left">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
              <span className="text-blue-600">💡</span>
              What are Quick Sale Items?
            </p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 text-green-500">✓</span>
                <span>One-click access to popular products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 text-green-500">✓</span>
                <span>Customizable colors for easy identification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 text-green-500">✓</span>
                <span>Perfect for drinks, snacks, or hot items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 text-green-500">✓</span>
                <span>Speed up your checkout process</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfigureClick}
            className="inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Configure Quick Items
          </button>

          {/* Hint */}
          <p className="mt-3 text-xs text-gray-500">
            Go to <span className="font-semibold text-blue-600">Products</span>{" "}
            page to add items
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Quick Sale</h3>
        <button
          onClick={() => setShowManageModal(true)}
          className="text-sm text-gray-600 hover:text-gray-900"
          title="Manage quick items"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {quickItems.map((item: QuickSaleItem) => (
          <button
            key={item.id}
            onClick={() => handleQuickItemClick(item)}
            disabled={
              item.product &&
              item.product.stockQuantity <= 0 &&
              !item.product.hasVariants
            }
            className={`group relative h-24 transform overflow-hidden rounded-xl shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60`}
            style={{
              backgroundColor: item.color,
            }}
          >
            <div className="relative z-10 flex h-full items-stretch">
              {/* Product Image - Full Height on Left */}
              {item.product && (
                <div className="h-full w-24 flex-shrink-0 bg-white bg-opacity-20 p-2">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name || item.displayName}
                      className="h-full w-full rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl text-white opacity-50">
                      📦
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-1 flex-col justify-center px-4 py-3 text-left">
                <span className="mb-1 block text-sm font-semibold leading-tight text-white drop-shadow-md">
                  {item.product?.name || item.displayName}
                </span>
                <div className="flex items-center gap-2">
                  {item.product?.sku && (
                    <span className="block text-xs text-white opacity-80">
                      SKU: {item.product.sku}
                    </span>
                  )}
                </div>

                {item.product &&
                (item.product.hasVariants ||
                  (item.product.variants &&
                    item.product.variants.length > 0)) ? (
                  <span className="mt-1 w-fit rounded-full bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700">
                    Variant
                  </span>
                ) : item.product ? (
                  <>
                    <span className="block text-xs font-medium text-white opacity-90 drop-shadow-sm">
                      {formatCurrency(item.product.sellingPrice, settings)}
                    </span>
                    <span className="mt-1 block text-xs text-white opacity-80">
                      Stock: {item.product.stockQuantity ?? 0}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
            <div className="pointer-events- none absolute inset-0 z-0 bg-black opacity-0 transition-opacity group-hover:opacity-10"></div>
            {item.product &&
              item.product.stockQuantity <= 0 &&
              !item.product.hasVariants && (
                <div className="pointer-events-none absolute right-2 top-2 z-20">
                  <span className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                    Out of stock
                  </span>
                </div>
              )}
          </button>
        ))}
      </div>

      {/* Manage Modal - Enhanced */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Quick Sale Items Setup
                </h3>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="rounded-full p-1 text-white transition-colors hover:bg-white hover:bg-opacity-20"
                >
                  <svg
                    className="h-5 w-5"
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
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <div className="mb-4">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">
                      How to Add Quick Items
                    </h4>
                    <p className="text-sm text-gray-600">
                      Follow these simple steps to configure your quick sale
                      buttons
                    </p>
                  </div>
                </div>

                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Go to Products Page
                      </p>
                      <p className="text-xs text-gray-600">
                        Navigate to the Products section from the Admin Panel
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Select a Product
                      </p>
                      <p className="text-xs text-gray-600">
                        Click on any product you want to add as a quick item
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Add to Quick Sale
                      </p>
                      <p className="text-xs text-gray-600">
                        Use the "Add to Quick Sale" option and choose a color
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Done!</p>
                      <p className="text-xs text-gray-600">
                        Your quick item will appear here for one-click access
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* Tips Section */}
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-amber-900">
                  <span>💡</span> Pro Tips
                </p>
                <ul className="space-y-1 text-xs text-amber-800">
                  <li>• Add your best-selling items for faster checkout</li>
                  <li>
                    • Use different colors to categorize items (drinks, snacks,
                    etc.)
                  </li>
                  <li>• You can add up to 12 quick sale items</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end rounded-b-lg bg-gray-50 px-6 py-4">
              <Button
                variant="primary"
                onClick={handleConfigureClick}
                className="px-6"
              >
                Lets Go!
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
