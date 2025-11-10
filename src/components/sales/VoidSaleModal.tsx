import React, { useState } from "react";
import { Sale } from "../../types";
import { Modal, Button } from "../common";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface VoidSaleModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, password: string, restoreStock: boolean) => void;
  requirePassword: boolean;
  isLoading: boolean;
}

export const VoidSaleModal: React.FC<VoidSaleModalProps> = ({
  sale,
  isOpen,
  onClose,
  onConfirm,
  requirePassword,
  isLoading,
}) => {
  const { settings } = useSettings();
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [restoreStock, setRestoreStock] = useState(true);

  if (!isOpen || !sale) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }
    if (requirePassword && !password.trim()) {
      return;
    }
    onConfirm(reason, password, restoreStock);
  };

  const handleClose = () => {
    setReason("");
    setPassword("");
    setRestoreStock(true);
    onClose();
  };

  if (!isOpen || !sale) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-red-100 p-2">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Void Sale</h2>
            <p className="text-sm text-gray-600">
              Receipt #{sale.receiptId} -{" "}
              {formatCurrency(sale.finalAmount, settings)}
            </p>
          </div>
        </div>
      }
      size="md"
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="danger"
            disabled={
              isLoading ||
              !reason.trim() ||
              (requirePassword && !password.trim())
            }
          >
            {isLoading ? "Voiding..." : "Void Sale"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">⚠️ Warning</p>
          <p className="mt-1 text-sm text-red-700">
            This action cannot be undone. The sale will be marked as voided and
            removed from reports.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Reason for Void <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Enter the reason for voiding this sale..."
              required
              disabled={isLoading}
            />
          </div>

          {requirePassword && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Admin/Manager Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="restoreStock"
              checked={restoreStock}
              onChange={(e) => setRestoreStock(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              disabled={isLoading}
            />
            <label
              htmlFor="restoreStock"
              className="ml-2 block text-sm text-gray-700"
            >
              Restore stock quantities
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
};
