import React from "react";
import { Product, StockMovement } from "../../types";

interface StockHistoryModalProps {
  isOpen: boolean;
  product: Product | null;
  history: StockMovement[];
  onClose: () => void;
}

export const StockHistoryModal: React.FC<StockHistoryModalProps> = ({
  isOpen,
  product,
  history,
  onClose,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <button
          className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="mb-4 text-xl font-semibold">
          Stock History for {product.name}
        </h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No stock movements found.</p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-2 text-gray-900">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {m.movementType}
                    </td>
                    <td className="px-4 py-2 text-gray-900">{m.quantity}</td>
                    <td className="px-4 py-2 text-gray-600">
                      {m.reason || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
