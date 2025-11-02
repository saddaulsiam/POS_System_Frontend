import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Calendar, Filter, Download } from "lucide-react";
import { loyaltyAPI } from "../../services";
import type { PointsTransaction, PointsTransactionType } from "../../types";

interface PointsHistoryTableProps {
  customerId: number;
}

type DateFilter = "all" | "week" | "month" | "year";
type TypeFilter = "all" | PointsTransactionType;

const PointsHistoryTable: React.FC<PointsHistoryTableProps> = ({
  customerId,
}) => {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  useEffect(() => {
    fetchTransactions();
  }, [customerId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loyaltyAPI.getTransactions(customerId);
      console.log("Points History - Raw Data:", data);
      console.log("Points History - Transaction Count:", data?.length || 0);
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load transaction history");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = React.useMemo(() => {
    let filtered = [...transactions];

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      if (dateFilter === "week") {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateFilter === "month") {
        filterDate.setMonth(now.getMonth() - 1);
      } else if (dateFilter === "year") {
        filterDate.setFullYear(now.getFullYear() - 1);
      }

      filtered = filtered.filter((t) => new Date(t.createdAt) >= filterDate);
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return filtered;
  }, [transactions, typeFilter, dateFilter]);

  const transactionsWithBalance = React.useMemo(() => {
    // Create a copy to avoid mutating the original array
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    let balance = 0;
    const withBalance = sortedTransactions.map((transaction) => {
      balance += transaction.points;
      return { ...transaction, balance };
    });

    // Return in reverse order (newest first)
    const result = withBalance.reverse();

    console.log(
      "Points History - Calculated Balances:",
      result.map((t) => ({
        date: new Date(t.createdAt).toLocaleDateString(),
        type: t.type,
        points: t.points,
        balance: t.balance,
      })),
    );

    return result;
  }, [filteredTransactions]);

  const exportToCSV = () => {
    const headers = ["Date", "Type", "Description", "Points", "Balance"];
    const rows = transactionsWithBalance.map((t) => [
      new Date(t.createdAt).toLocaleDateString(),
      t.type,
      t.description || "-",
      t.points.toString(),
      t.balance.toString(),
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loyalty_points_history_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getTransactionIcon = (type: PointsTransactionType) => {
    return type === "EARNED" ||
      type === "BIRTHDAY_BONUS" ||
      type === "ADJUSTED" ? (
      <ArrowUp className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-500" />
    );
  };

  const getPointsColor = (points: number) => {
    return points > 0
      ? "text-green-600 font-semibold"
      : "text-red-600 font-semibold";
  };

  const getTypeLabel = (type: PointsTransactionType) => {
    const labels: Record<PointsTransactionType, string> = {
      EARNED: "Earned",
      REDEEMED: "Redeemed",
      EXPIRED: "Expired",
      BIRTHDAY_BONUS: "Birthday Bonus",
      ADJUSTED: "Adjusted",
    };
    return labels[type];
  };

  const getTypeBadgeColor = (type: PointsTransactionType) => {
    const colors: Record<PointsTransactionType, string> = {
      EARNED: "bg-green-100 text-green-800",
      REDEEMED: "bg-blue-100 text-blue-800",
      EXPIRED: "bg-gray-100 text-gray-800",
      BIRTHDAY_BONUS: "bg-purple-100 text-purple-800",
      ADJUSTED: "bg-yellow-100 text-yellow-800",
    };
    return colors[type];
  };

  // Calculate summary statistics
  const totalPoints = transactions.reduce((sum, t) => sum + t.points, 0);
  const earnedPoints = transactions
    .filter((t) => t.points > 0)
    .reduce((sum, t) => sum + t.points, 0);
  const redeemedPoints = Math.abs(
    transactions
      .filter((t) => t.points < 0)
      .reduce((sum, t) => sum + t.points, 0),
  );

  console.log("Points History - Summary Stats:", {
    totalTransactions: transactions.length,
    earnedPoints,
    redeemedPoints,
    netBalance: totalPoints,
    calculationCheck: `${earnedPoints} - ${redeemedPoints} = ${earnedPoints - redeemedPoints}`,
  });

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Loading transaction history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex h-64 flex-col items-center justify-center text-red-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchTransactions}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Points History</h2>
          <button
            onClick={exportToCSV}
            disabled={transactions.length === 0}
            className="flex items-center gap-2 rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Summary Stats */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-blue-50 p-3">
            <div className="mb-1 text-xs text-gray-600">Total Earned</div>
            <div className="text-lg font-bold text-blue-600">
              +{earnedPoints.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-red-50 p-3">
            <div className="mb-1 text-xs text-gray-600">Total Redeemed</div>
            <div className="text-lg font-bold text-red-600">
              -{redeemedPoints.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <div className="mb-1 text-xs text-gray-600">Net Balance</div>
            <div className="text-lg font-bold text-green-600">
              {totalPoints.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="EARNED">Earned</option>
              <option value="REDEEMED">Redeemed</option>
              <option value="BIRTHDAY_BONUS">Birthday Bonus</option>
              <option value="EXPIRED">Expired</option>
              <option value="ADJUSTED">Adjusted</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            transactions
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="mb-2 text-lg">No transactions found</p>
            <p className="text-sm">Adjust your filters or check back later</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Points
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {transactionsWithBalance.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {new Date(transaction.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getTypeBadgeColor(
                        transaction.type,
                      )}`}
                    >
                      {getTransactionIcon(transaction.type)}
                      {getTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {transaction.description || "-"}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-4 text-right text-sm ${getPointsColor(transaction.points)}`}
                  >
                    {transaction.points > 0 ? "+" : ""}
                    {transaction.points.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {transaction.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PointsHistoryTable;
