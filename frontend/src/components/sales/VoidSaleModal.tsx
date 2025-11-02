import React, { useState } from "react";
import { Sale } from "../../types";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Void Sale</h3>
            <p className="mt-1 text-sm text-gray-500">
              Sale #{sale.receiptId} - ${sale.finalAmount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            type="button"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">⚠️ Warning</p>
            <p className="mt-1 text-sm text-red-700">
              This action cannot be undone. The sale will be marked as voided
              and removed from reports.
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

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={
                isLoading ||
                !reason.trim() ||
                (requirePassword && !password.trim())
              }
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Voiding..." : "Void Sale"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
