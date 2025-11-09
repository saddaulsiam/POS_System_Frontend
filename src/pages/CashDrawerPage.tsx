import React, { useState } from "react";
import { RefreshButton } from "../components/common/RefreshButton";
import { useAuth } from "../context/AuthContext";
import {
  useCurrentCashDrawer,
  useCashDrawers,
  useCashDrawerReconciliation,
  useOpenCashDrawer,
  useCloseCashDrawer,
} from "../services/queries/cashDrawerQueries";

const CashDrawerPage: React.FC = () => {
  const { user } = useAuth();

  // History filters (must be declared before using in hooks)
  const [page, setPage] = useState(1);

  // React Query hooks
  const { data: currentDrawerData, refetch: refetchCurrent } =
    useCurrentCashDrawer();
  const currentDrawer = currentDrawerData?.drawer || null;

  const { data: reconciliation } = useCashDrawerReconciliation(
    currentDrawer?.id,
  );

  const { data: historyData, isLoading: loading } = useCashDrawers({
    page,
    limit: 10,
  });
  const drawerHistory = historyData?.drawers || [];
  const totalPages = historyData?.pagination?.totalPages || 1;

  const openCashDrawer = useOpenCashDrawer();
  const closeCashDrawer = useCloseCashDrawer();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Open drawer form
  const [openingBalance, setOpeningBalance] = useState("");
  const [showOpenForm, setShowOpenForm] = useState(false);

  // Close drawer form
  const [closingBalance, setClosingBalance] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [showCloseForm, setShowCloseForm] = useState(false);

  const handleOpenDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!openingBalance || parseFloat(openingBalance) < 0) {
      setError("Please enter a valid opening balance");
      return;
    }

    try {
      await openCashDrawer.mutateAsync({
        openingBalance: parseFloat(openingBalance),
      });
      setSuccess("Cash drawer opened successfully");
      setShowOpenForm(false);
      setOpeningBalance("");
      refetchCurrent();
    } catch (err: any) {
      setError(err.response?.error);
    }
  };

  const handleCloseDrawer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!closingBalance || parseFloat(closingBalance) < 0) {
      setError("Please enter a valid closing balance");
      return;
    }

    if (!currentDrawer) {
      setError("No open drawer found");
      return;
    }

    try {
      await closeCashDrawer.mutateAsync({
        id: currentDrawer.id,
        data: {
          closingBalance: parseFloat(closingBalance),
          actualCash: actualCash
            ? parseFloat(actualCash)
            : parseFloat(closingBalance),
          notes: closeNotes,
        },
      });

      setSuccess("Cash drawer closed successfully");
      setShowCloseForm(false);
      setClosingBalance("");
      setActualCash("");
      setCloseNotes("");
      refetchCurrent();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to close cash drawer");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Cash Drawer Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your cash drawer and track shifts
            </p>
          </div>
          <RefreshButton
            onClick={() => {
              refetchCurrent();
              setSuccess("");
              setError("");
            }}
            className="mt-2"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <span className="font-medium">⚠️ {error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <span className="font-medium">✓ {success}</span>
        </div>
      )}

      {/* Current Drawer Status */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center text-xl font-semibold text-gray-900">
                💵 Current Shift
              </h2>
              {!currentDrawer && (
                <button
                  onClick={() => setShowOpenForm(true)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                >
                  Open Drawer
                </button>
              )}
              {currentDrawer && (
                <button
                  onClick={() => setShowCloseForm(true)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                >
                  Close Drawer
                </button>
              )}
            </div>

            {!currentDrawer && !showOpenForm && (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl">💵</div>
                <p className="text-lg text-gray-500">
                  No cash drawer is currently open
                </p>
                <p className="mt-2 text-gray-400">
                  Click "Open Drawer" to start a new shift
                </p>
              </div>
            )}

            {showOpenForm && (
              <form onSubmit={handleOpenDrawer} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Opening Balance
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "Opening..." : "Open Drawer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOpenForm(false);
                      setOpeningBalance("");
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {currentDrawer && !showCloseForm && reconciliation && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Opening Balance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(currentDrawer.openingBalance)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-600">Expected Cash</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(reconciliation.expectedCashBalance)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-gray-900">
                    Shift Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Sales:</span>
                      <span className="font-medium">
                        {reconciliation.sales}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(reconciliation.totalSales)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cash Sales:</span>
                      <span className="font-medium">
                        {formatCurrency(reconciliation.paymentBreakdown.cash)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card Sales:</span>
                      <span className="font-medium">
                        {formatCurrency(reconciliation.paymentBreakdown.card)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile Sales:</span>
                      <span className="font-medium">
                        {formatCurrency(reconciliation.paymentBreakdown.mobile)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opened At:</span>
                      <span className="font-medium">
                        {new Date(currentDrawer.openedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showCloseForm && reconciliation && (
              <form onSubmit={handleCloseDrawer} className="space-y-4">
                <div className="mb-4 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-800">
                    Expected Cash Balance:{" "}
                    {formatCurrency(reconciliation.expectedCashBalance)}
                  </p>
                  <p className="mt-1 text-xs text-blue-600">
                    Opening: {formatCurrency(currentDrawer!.openingBalance)} +
                    Cash Sales:{" "}
                    {formatCurrency(reconciliation.paymentBreakdown.cash)}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Actual Cash Count
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={actualCash}
                    onChange={(e) => {
                      setActualCash(e.target.value);
                      setClosingBalance(e.target.value);
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    placeholder="0.00"
                    required
                  />
                  {actualCash && (
                    <p
                      className={`mt-1 text-sm ${
                        parseFloat(actualCash) -
                          reconciliation.expectedCashBalance >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Difference:{" "}
                      {formatCurrency(
                        parseFloat(actualCash) -
                          reconciliation.expectedCashBalance,
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={closeNotes}
                    onChange={(e) => setCloseNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Any notes about this shift..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? "Closing..." : "Close Drawer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCloseForm(false);
                      setClosingBalance("");
                      setActualCash("");
                      setCloseNotes("");
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 font-semibold text-gray-900">Shift Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    currentDrawer
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {currentDrawer ? "Open" : "Closed"}
                </span>
              </div>
              {currentDrawer && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Employee:</span>
                    <span className="text-sm font-medium">
                      {currentDrawer.employee?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">
                      {(() => {
                        const openedAt = new Date(currentDrawer.openedAt);
                        const diff = Date.now() - openedAt.getTime();
                        const totalMinutes = Math.floor(diff / 60000);
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        return `${hours}h:${minutes}m`;
                      })()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {reconciliation && (
            <div className="h-36 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <div className="space-y-1">
                {reconciliation.recentTransactions.length === 0 ? (
                  <p className="text-sm text-gray-500">No transactions yet</p>
                ) : (
                  reconciliation.recentTransactions
                    .slice(0, 3)
                    .map((transaction: any) => (
                      <div
                        key={transaction.receiptId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          #{transaction.receiptId}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            typeof transaction.finalAmount === "number"
                              ? transaction.finalAmount
                              : 0,
                          )}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drawer History (Admin/Manager only) */}
      {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center text-xl font-semibold text-gray-900">
              🕐 Drawer History
            </h2>
          </div>

          {loading && drawerHistory.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
          ) : drawerHistory.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No drawer history found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Opened
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Closed
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                        Opening
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                        Closing
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                        Difference
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {drawerHistory.filter(Boolean).map((drawer: any) => (
                      <tr
                        key={drawer?.id ?? Math.random()}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {drawer?.employee?.name ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {drawer?.openedAt ? formatDate(drawer.openedAt) : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {drawer?.closedAt ? formatDate(drawer.closedAt) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {drawer?.openingBalance !== undefined
                            ? formatCurrency(drawer.openingBalance)
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {drawer.closingBalance
                            ? formatCurrency(drawer.closingBalance)
                            : "-"}
                        </td>
                        <td
                          className={`px-4 py-3 text-right text-sm font-medium ${
                            drawer.difference === null
                              ? "text-gray-400"
                              : drawer.difference >= 0
                                ? "text-green-600"
                                : "text-red-600"
                          }`}
                        >
                          {drawer.difference !== null
                            ? formatCurrency(drawer.difference)
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              drawer.status === "OPEN"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {drawer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CashDrawerPage;
