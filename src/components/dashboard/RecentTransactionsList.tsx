import React from "react";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface Transaction {
  id: number;
  total: number;
  createdAt: string;
  customerName?: string;
  itemCount: number;
}

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({
  transactions,
}) => {
  const { settings } = useSettings();

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        🔄 Recent Transactions
      </h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
          >
            <div>
              <p className="font-medium text-gray-900">#{transaction.id}</p>
              <p className="text-sm text-gray-600">
                {transaction.customerName || "Walk-in Customer"} •{" "}
                {transaction.itemCount} items
              </p>
              <p className="text-xs text-gray-500">
                {new Date(transaction.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">
                {formatCurrency(transaction.total, settings)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
