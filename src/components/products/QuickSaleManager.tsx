import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useCreateQuickSaleItem,
  useDeleteQuickSaleItem,
  useQuickSaleItems,
  useUpdateQuickSaleItem,
} from "../../services/queries";
import { QuickSaleItem, QuickSaleManagerProps } from "../../types";
import { Button, Modal } from "../common";

const COLOR_OPTIONS = [
  { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
  { value: "#10B981", label: "Green", class: "bg-green-500" },
  { value: "#F59E0B", label: "Orange", class: "bg-orange-500" },
  { value: "#EF4444", label: "Red", class: "bg-red-500" },
  { value: "#8B5CF6", label: "Purple", class: "bg-purple-500" },
  { value: "#EC4899", label: "Pink", class: "bg-pink-500" },
  { value: "#14B8A6", label: "Teal", class: "bg-teal-500" },
  { value: "#F97316", label: "Amber", class: "bg-amber-500" },
];

export const QuickSaleManager: FC<QuickSaleManagerProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const [displayName, setDisplayName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [sortOrder, setSortOrder] = useState(0);
  const [editingItem, setEditingItem] = useState<QuickSaleItem | null>(null);

  // React Query hooks
  const { data: quickItems = [], isLoading: loading } = useQuickSaleItems();
  const createQuickSale = useCreateQuickSaleItem();
  const updateQuickSale = useUpdateQuickSaleItem();
  const deleteQuickSale = useDeleteQuickSaleItem();

  useEffect(() => {
    if (isOpen && product) {
      setDisplayName(product.name);
      // Find next available sort order
      const maxOrder =
        quickItems.length > 0
          ? Math.max(...quickItems.map((i: QuickSaleItem) => i.sortOrder))
          : -1;
      setSortOrder(maxOrder + 1);
    }
  }, [isOpen, product, quickItems]);

  const handleAddToQuickSale = async () => {
    if (!product && !editingItem) return;

    if (!displayName.trim()) {
      toast.error("Display name is required");
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        await updateQuickSale.mutateAsync({
          id: editingItem.id,
          data: {
            displayName: displayName.trim(),
            color: selectedColor,
            sortOrder,
          },
        });
        toast.success("Quick Sale item updated!");
        setEditingItem(null);
      } else if (product) {
        // Create new item
        await createQuickSale.mutateAsync({
          productId: product.id,
          displayName: displayName.trim(),
          color: selectedColor,
          sortOrder,
        });
        toast.success("Added to Quick Sale!");
      }

      onSuccess();

      // Reset form
      setDisplayName("");
      setSelectedColor("#3B82F6");
      setSortOrder(0);
    } catch (error: any) {
      console.error("Error saving quick sale item:", error);
      toast.error(error.response?.data?.error || "Failed to save");
    }
  };

  const handleRemoveFromQuickSale = async (itemId: number) => {
    if (!confirm("Remove this item from Quick Sale?")) return;

    try {
      await deleteQuickSale.mutateAsync(itemId);
      toast.success("Removed from Quick Sale");
      onSuccess();
    } catch (error) {
      console.error("Error removing quick sale item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleEditQuickSale = (item: QuickSaleItem) => {
    setEditingItem(item);
    setDisplayName(item.displayName);
    setSelectedColor(item.color);
    setSortOrder(item.sortOrder);
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    if (product) {
      setDisplayName(product.name);
      const maxOrder =
        quickItems.length > 0
          ? Math.max(...quickItems.map((i: QuickSaleItem) => i.sortOrder))
          : -1;
      setSortOrder(maxOrder + 1);
    } else {
      setDisplayName("");
      setSortOrder(0);
    }
    setSelectedColor("#3B82F6");
  };

  if (!isOpen) return null;

  // Check if current product is already in quick sale
  const isProductInQuickSale =
    product &&
    quickItems.some((item: QuickSaleItem) => item.productId === product.id);

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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Quick Sale Manager
            </h2>
            <p className="text-sm text-gray-600">Manage fast-access products</p>
          </div>
        </div>
      }
      size="4xl"
      footer={
        <div className="flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Add Product Section */}
        {(product || editingItem) && (
          <div className="mb-6 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {editingItem
                    ? "✏️ Edit Quick Sale Item"
                    : isProductInQuickSale
                      ? "⚡ Already in Quick Sale"
                      : "➕ Add to Quick Sale"}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Product:{" "}
                  <span className="font-semibold text-gray-900">
                    {editingItem
                      ? editingItem.product?.name ||
                        `ID: ${editingItem.productId}`
                      : product?.name}
                  </span>
                </p>

                {!isProductInQuickSale || editingItem ? (
                  <div className="space-y-4">
                    {/* Display Name */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Display Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g., Milk, Bread, Coffee"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Short name displayed on the button
                      </p>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Button Color <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {COLOR_OPTIONS.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setSelectedColor(color.value)}
                            className={`flex items-center space-x-2 rounded-lg border-2 px-3 py-2 transition-all ${
                              selectedColor === color.value
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`h-6 w-6 rounded ${color.class}`}
                            ></div>
                            <span className="text-sm font-medium">
                              {color.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sort Order */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Sort Order
                      </label>
                      <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) =>
                          setSortOrder(parseInt(e.target.value) || 0)
                        }
                        min="0"
                        className="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Lower numbers appear first
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="border-t border-gray-200 pt-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Preview
                      </label>
                      <button
                        type="button"
                        style={{ backgroundColor: selectedColor }}
                        className="transform rounded-lg px-6 py-3 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
                      >
                        {displayName || "Preview"}
                      </button>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end space-x-3 pt-2">
                      <Button
                        variant="primary"
                        onClick={handleAddToQuickSale}
                        disabled={
                          createQuickSale.isPending ||
                          updateQuickSale.isPending ||
                          !displayName.trim()
                        }
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
                            d={
                              editingItem
                                ? "M5 13l4 4L19 7"
                                : "M13 10V3L4 14h7v7l9-11h-7z"
                            }
                          />
                        </svg>
                        {createQuickSale.isPending || updateQuickSale.isPending
                          ? editingItem
                            ? "Updating..."
                            : "Adding..."
                          : editingItem
                            ? "Update Item"
                            : "Add to Quick Sale"}
                      </Button>
                      {editingItem && (
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center space-x-2 text-green-800">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">
                        This product is already in Quick Sale
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-green-700">
                      You can manage it in the list below or remove it if
                      needed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current Quick Sale Items */}
        <div>
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <svg
              className="mr-2 h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Current Quick Sale Items ({quickItems.length})
          </h3>

          {loading ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : quickItems.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-400"
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
              <p className="font-medium text-gray-600">
                No Quick Sale items yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Add products to enable fast checkout
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {quickItems
                .sort(
                  (a: QuickSaleItem, b: QuickSaleItem) =>
                    a.sortOrder - b.sortOrder,
                )
                .map((item: QuickSaleItem) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-center space-x-4">
                        {/* Color Preview */}
                        <div
                          style={{ backgroundColor: item.color }}
                          className="flex h-12 w-12 items-center justify-center rounded-lg shadow-sm"
                        >
                          <span className="text-lg font-bold text-white">
                            #{item.sortOrder}
                          </span>
                        </div>

                        {/* Item Info */}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.displayName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Product:{" "}
                            {item.product?.name || `ID: ${item.productId}`}
                          </p>
                          <div className="mt-1 flex items-center space-x-4">
                            <span className="text-xs text-gray-500">
                              Order: {item.sortOrder}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditQuickSale(item)}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveFromQuickSale(item.id)}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
