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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
        <span>🔄</span> Recent Transactions
      </h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 p-4 transition-all hover:bg-gray-100/50 hover:shadow-sm"
          >
            <div>
              <p className="font-bold text-gray-900 text-sm">#{transaction.id}</p>
              <p className="text-xs font-medium text-gray-600 mt-0.5">
                {transaction.customerName || "Walk-in Customer"} •{" "}
                {transaction.itemCount} items
              </p>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1">
                {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                {formatCurrency(transaction.total, settings)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
