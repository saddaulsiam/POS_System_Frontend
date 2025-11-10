import React, { useState } from "react";
import { Product } from "../../types";
import { Button, Modal } from "../common";

type AllowedMovementType =
  | "PURCHASE"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGED"
  | "EXPIRED";

const movementTypes: { label: string; value: AllowedMovementType }[] = [
  { label: "Purchase", value: "PURCHASE" },
  { label: "Adjustment", value: "ADJUSTMENT" },
  { label: "Return", value: "RETURN" },
  { label: "Damaged", value: "DAMAGED" },
  { label: "Expired", value: "EXPIRED" },
];

interface StockAdjustModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (data: {
    quantity: number;
    movementType: AllowedMovementType;
    reason: string;
  }) => Promise<void>;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({
  isOpen,
  product,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<{
    quantity: number;
    movementType: AllowedMovementType;
    reason: string;
  }>({
    quantity: 0,
    movementType: "ADJUSTMENT",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "quantity") {
        return { ...prev, quantity: Number(value) };
      } else if (name === "movementType") {
        return { ...prev, movementType: value as AllowedMovementType };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form
    setFormData({ quantity: 0, movementType: "ADJUSTMENT", reason: "" });
  };

  if (!isOpen || !product) return null;

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
            <h2 className="text-xl font-bold text-gray-900">Adjust Stock</h2>
            <p className="text-sm text-gray-600">{product.name}</p>
          </div>
        </div>
      }
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} variant="primary">
            Adjust Stock
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Quantity</label>
          <input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Movement Type
          </label>
          <select
            name="movementType"
            value={formData.movementType}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          >
            {movementTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Reason (optional)
          </label>
          <input
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </form>
    </Modal>
  );
};
