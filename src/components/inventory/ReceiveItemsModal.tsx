import React, { useState } from "react";
import { X } from "lucide-react";

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

interface ReceiveItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: {
    id: number;
    poNumber: string;
    items: PurchaseOrderItem[];
  };
  onReceive: (
    poId: number,
    items: Array<{ itemId: number; receivedQuantity: number }>,
  ) => Promise<void>;
}

const ReceiveItemsModal: React.FC<ReceiveItemsModalProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
  onReceive,
}) => {
  const [receivedQuantities, setReceivedQuantities] = useState<
    Record<number, string>
  >(
    purchaseOrder.items.reduce(
      (acc, item) => {
        const remaining = item.quantity - item.receivedQuantity;
        acc[item.id] = remaining > 0 ? remaining.toString() : "0";
        return acc;
      },
      {} as Record<number, string>,
    ),
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuantityChange = (itemId: number, value: string) => {
    // Allow empty string or valid numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setReceivedQuantities((prev) => ({
        ...prev,
        [itemId]: value,
      }));
    }
  };

  const handleReceive = async () => {
    const items = Object.entries(receivedQuantities)
      .map(([itemId, quantity]) => ({
        itemId: parseInt(itemId),
        receivedQuantity: parseFloat(quantity) || 0,
      }))
      .filter((item) => item.receivedQuantity > 0);

    if (items.length === 0) {
      alert("Please enter at least one quantity to receive");
      return;
    }

    // Validate quantities
    for (const item of items) {
      const poItem = purchaseOrder.items.find((i) => i.id === item.itemId);
      if (poItem) {
        const newTotal = poItem.receivedQuantity + item.receivedQuantity;
        if (newTotal > poItem.quantity) {
          alert(
            `Cannot receive ${item.receivedQuantity} of ${poItem.product.name}. Maximum: ${
              poItem.quantity - poItem.receivedQuantity
            }`,
          );
          return;
        }
      }
    }

    setLoading(true);
    try {
      await onReceive(purchaseOrder.id, items);
      onClose();
    } catch (error) {
      console.error("Error receiving items:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRemainingQuantity = (item: PurchaseOrderItem) => {
    return item.quantity - item.receivedQuantity;
  };

  const hasItemsToReceive = purchaseOrder.items.some(
    (item) => item.receivedQuantity < item.quantity,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Receive Items</h2>
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
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
          {!hasItemsToReceive ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                All items have been fully received.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Enter the quantity received for each
                  item. Stock levels will be updated automatically.
                </p>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Ordered
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Previously Received
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Remaining
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Receive Now
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {purchaseOrder.items.map((item) => {
                    const remaining = getRemainingQuantity(item);
                    const isFullyReceived = remaining === 0;

                    return (
                      <tr
                        key={item.id}
                        className={
                          isFullyReceived ? "bg-gray-50 opacity-50" : ""
                        }
                      >
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {item.product.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {item.product.sku}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-600">
                          {item.receivedQuantity}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                          {remaining}
                        </td>
                        <td className="px-4 py-4 text-right text-sm">
                          {isFullyReceived ? (
                            <span className="font-medium text-green-600">
                              Completed
                            </span>
                          ) : (
                            <input
                              type="number"
                              min="0"
                              max={remaining}
                              step="0.01"
                              value={receivedQuantities[item.id] || ""}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              className="w-24 rounded-md border border-gray-300 px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          {hasItemsToReceive && (
            <button
              onClick={handleReceive}
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Receiving..." : "Receive Items"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiveItemsModal;
