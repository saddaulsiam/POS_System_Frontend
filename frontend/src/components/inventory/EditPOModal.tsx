import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  purchasePrice: number;
}

interface Supplier {
  id: number;
  name: string;
}

interface PurchaseOrderItem {
  id: number;
  productId: number;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalCost: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
}

interface EditPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: {
    id: number;
    poNumber: string;
    supplierId: number;
    orderDate: string;
    expectedDate: string | null;
    notes: string | null;
    items: PurchaseOrderItem[];
  };
  suppliers: Supplier[];
  products: Product[];
  onUpdate: (
    poId: number,
    data: {
      supplierId: number;
      orderDate: string;
      expectedDate?: string;
      notes?: string;
      items: Array<{ productId: number; quantity: number; unitPrice: number }>;
    },
  ) => Promise<void>;
}

const EditPOModal: React.FC<EditPOModalProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
  suppliers,
  products,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    supplierId: purchaseOrder.supplierId.toString(),
    orderDate: purchaseOrder.orderDate.split("T")[0],
    expectedDate: purchaseOrder.expectedDate
      ? purchaseOrder.expectedDate.split("T")[0]
      : "",
    notes: purchaseOrder.notes || "",
  });

  const [poItems, setPOItems] = useState<
    Array<{ productId: number; quantity: number; unitPrice: number }>
  >(
    purchaseOrder.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitCost,
    })),
  );

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: "1",
    unitPrice: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        supplierId: purchaseOrder.supplierId.toString(),
        orderDate: purchaseOrder.orderDate.split("T")[0],
        expectedDate: purchaseOrder.expectedDate
          ? purchaseOrder.expectedDate.split("T")[0]
          : "",
        notes: purchaseOrder.notes || "",
      });
      setPOItems(
        purchaseOrder.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitCost,
        })),
      );
    }
  }, [isOpen, purchaseOrder]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (
      !currentItem.productId ||
      !currentItem.quantity ||
      !currentItem.unitPrice
    ) {
      alert("Please fill all item fields");
      return;
    }

    const product = products.find(
      (p) => p.id === parseInt(currentItem.productId),
    );
    if (!product) return;

    setPOItems([
      ...poItems,
      {
        productId: parseInt(currentItem.productId),
        quantity: parseFloat(currentItem.quantity),
        unitPrice: parseFloat(currentItem.unitPrice),
      },
    ]);

    setCurrentItem({ productId: "", quantity: "1", unitPrice: "" });
  };

  const handleRemoveItem = (index: number) => {
    setPOItems(poItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (poItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(purchaseOrder.id, {
        supplierId: parseInt(formData.supplierId),
        orderDate: formData.orderDate,
        expectedDate: formData.expectedDate || undefined,
        notes: formData.notes || undefined,
        items: poItems,
      });
      onClose();
    } catch (error) {
      console.error("Error updating purchase order:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return poItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit Purchase Order
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              PO: {purchaseOrder.poNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-180px)] overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Supplier *
                </label>
                <select
                  value={formData.supplierId}
                  onChange={(e) =>
                    setFormData({ ...formData, supplierId: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Order Date *
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) =>
                    setFormData({ ...formData, orderDate: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expected Date
                </label>
                <input
                  type="date"
                  value={formData.expectedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedDate: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional notes about this purchase order"
              />
            </div>

            {/* Add Item Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Order Items
              </h3>

              <div className="mb-4 rounded-lg bg-gray-50 p-4">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Product
                    </label>
                    <select
                      value={currentItem.productId}
                      onChange={(e) => {
                        const product = products.find(
                          (p) => p.id === parseInt(e.target.value),
                        );
                        setCurrentItem({
                          ...currentItem,
                          productId: e.target.value,
                          unitPrice: product
                            ? product.purchasePrice.toString()
                            : "",
                        });
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentItem.unitPrice}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          unitPrice: e.target.value,
                        })
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      <Plus className="mx-auto h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {poItems.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {poItems.map((item, index) => {
                        const product = products.find(
                          (p) => p.id === item.productId,
                        );
                        return (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {product?.name || "Unknown"} (
                              {product?.sku || "N/A"})
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-900">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-900">
                              ${item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                              ${(item.quantity * item.unitPrice).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 transition-colors hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50">
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-right text-sm font-semibold text-gray-900"
                        >
                          Total Amount:
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                          ${calculateTotal().toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || poItems.length === 0}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Updating..." : "Update Purchase Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPOModal;
