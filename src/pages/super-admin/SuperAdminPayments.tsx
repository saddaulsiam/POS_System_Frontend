import React, { useState } from "react";
import { useAdminPayments } from "../../services/queries/adminQueries";
import { Pagination } from "../../components/sales/Pagination";
import { SkeletonTableRow } from "../../components/common";

const SuperAdminPayments: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, isFetching } = useAdminPayments({
    page,
    limit,
  });

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-bold">Error</h3>
        <p>Failed to load payment history. Please check your backend connection.</p>
      </div>
    );
  }

  const payments = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Billing & Payments History
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Track validated payment gateway transaction records.
        </p>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Store</th>
                <th className="px-6 py-4 font-semibold">Payer Info</th>
                <th className="px-6 py-4 font-semibold">Billing Plan</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Transaction Status</th>
                <th className="px-6 py-4 text-right font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {isLoading || isFetching ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={index} columns={7} />
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No payment logs recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{pay.transactionId}</p>
                      <p className="text-3xs text-gray-400">Method: {pay.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{pay.store.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{pay.customerName}</p>
                      <p className="text-xs text-gray-400">{pay.customerEmail}</p>
                      <p className="text-xs text-gray-400">{pay.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-2xs font-bold text-slate-800">
                        {pay.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatMoney(pay.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-2xs font-bold ${
                          pay.status === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : pay.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500">
                      <div>{new Date(pay.createdAt).toLocaleDateString()}</div>
                      <div>{new Date(pay.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-150 p-4">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminPayments;
