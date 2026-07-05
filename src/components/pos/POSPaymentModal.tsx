import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";
import { Input, Modal } from "../common";
import { Customer } from "../../types";

interface POSPaymentModalProps {
  isOpen: boolean;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "CASH" | "CARD";
  cashReceived: string;
  changeAmount: number;
  isProcessing: boolean;
  onClose: () => void;
  onPaymentMethodChange: (method: "CASH" | "CARD") => void;
  onCashReceivedChange: (value: string) => void;
  onConfirm: () => void;
  loyaltyDiscount?: number;
  offerDiscount?: number;
  customer: Customer | null;
}

export const POSPaymentModal: React.FC<POSPaymentModalProps> = ({
  isOpen,
  subtotal,
  tax,
  total,
  paymentMethod,
  cashReceived,
  changeAmount,
  isProcessing,
  onClose,
  onPaymentMethodChange,
  onCashReceivedChange,
  onConfirm,
  loyaltyDiscount,
  offerDiscount = 0,
  customer,
}) => {
  const { settings } = useSettings();

  // Listen to keyboard shortcuts inside the Modal
  React.useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      // 1. Finalize payment on Enter
      if (e.key === "Enter") {
        e.preventDefault();
        const isCashValid = paymentMethod === "CASH" && parseFloat(cashReceived) >= total;
        const isCardValid = paymentMethod === "CARD";

        if (!isProcessing && (isCashValid || isCardValid)) {
          onConfirm();
        }
        return;
      }

      // 2. Ctrl + 1: Switch to Cash
      if (e.key === "1" && e.ctrlKey) {
        e.preventDefault();
        onPaymentMethodChange("CASH");
        return;
      }

      // 3. Ctrl + 2: Switch to Card
      if (e.key === "2" && e.ctrlKey) {
        e.preventDefault();
        onPaymentMethodChange("CARD");
        return;
      }
    };

    window.addEventListener("keydown", handleModalKeyDown);
    return () => window.removeEventListener("keydown", handleModalKeyDown);
  }, [isOpen, paymentMethod, cashReceived, total, isProcessing, onConfirm, onPaymentMethodChange]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Process Payment"
      size="md"
      footer={
        <div className="flex w-full space-x-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={
              isProcessing ||
              (paymentMethod === "CASH" && parseFloat(cashReceived) < total)
            }
            className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Complete Sale"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-3 text-base">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal, settings)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatCurrency(tax, settings)}</span>
          </div>
          {/* Loyalty Discount row (if present) */}
          {typeof loyaltyDiscount === "number" && loyaltyDiscount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Loyalty Discount:</span>
              <span>-{formatCurrency(loyaltyDiscount, settings)}</span>
            </div>
          )}
          {/* Offer Discount row (if present) */}
          {offerDiscount > 0 && (
            <div className="flex justify-between text-blue-700">
              <span>
                🏷️ Special Offer Discount ({customer?.loyaltyTier}):
              </span>
              <span>-{formatCurrency(offerDiscount, settings)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-lg font-medium">
            <span>Total:</span>
            <span>{formatCurrency(total, settings)}</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => onPaymentMethodChange("CASH")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                paymentMethod === "CASH"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Cash
            </button>
            <button
              onClick={() => onPaymentMethodChange("CARD")}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium ${
                paymentMethod === "CARD"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Card
            </button>
          </div>
        </div>

        {paymentMethod === "CASH" && (
          <Input
            label="Cash Received"
            type="number"
            step="0.01"
            value={cashReceived}
            onChange={(e) => onCashReceivedChange(e.target.value)}
            placeholder="0.00"
            min={total}
            fullWidth
            autoFocus
          />
        )}
        {cashReceived && (
          <div className="mt-2 text-sm">
            <span className="text-gray-600">Change: </span>
            <span className="font-medium">
              {formatCurrency(changeAmount, settings)}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
