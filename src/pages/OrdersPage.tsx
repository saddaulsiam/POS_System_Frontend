import React, { useState } from 'react';
import { useSales, useVoidSale } from '../services/queries';
import { Button, Input, Modal, ConfirmModal, RefreshButton } from '../components/common';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/currencyUtils';
import toast from 'react-hot-toast';

const OrdersPage: React.FC = () => {
  const { settings } = useSettings();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, refetch } = useSales({ page, limit, startDate, endDate });
  const voidSale = useVoidSale();

  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidReason, setVoidReason] = useState('');

  const handleVoidSale = async () => {
    if (!selectedSale) return;
    try {
      await voidSale.mutateAsync({ id: selectedSale.id, data: { reason: voidReason } });
      toast.success('Sale voided successfully');
      setIsVoidModalOpen(false);
      setSelectedSale(null);
      setVoidReason('');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to void sale');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Completed</span>;
      case 'REFUNDED':
        return <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Refunded</span>;
      case 'VOIDED':
        return <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">Voided</span>;
      case 'PARKED':
        return <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Parked</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sales History</h1>
          <p className="mt-1 text-slate-500">View and manage past sales and receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
          <RefreshButton onClick={() => refetch()} loading={isLoading} />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Receipt No</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Total Amount</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Loading sales history...
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No sales found for this period.
                  </td>
                </tr>
              ) : (
                data?.data?.map((sale: any) => (
                  <tr key={sale.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-blue-600">{sale.receiptId}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(sale.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {sale.customer ? sale.customer.name : <span className="italic text-gray-400">Walk-in Customer</span>}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(sale.finalAmount, settings)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{sale.paymentMethod || '-'}</td>
                    <td className="px-6 py-4">{getStatusBadge(sale.paymentStatus)}</td>
                    <td className="px-6 py-4 text-right">
                      {sale.paymentStatus === 'COMPLETED' && (
                        <button
                          onClick={() => {
                            setSelectedSale(sale);
                            setIsVoidModalOpen(true);
                          }}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          title="Void Sale"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50 ml-1"
                        title="View Details"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination controls can go here */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (data?.pagination?.totalPages || 1)}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{data?.pagination?.page || 1}</span> of <span className="font-medium">{data?.pagination?.totalPages || 1}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  variant="ghost"
                  className="rounded-r-none"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-l-none"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= (data?.pagination?.totalPages || 1)}
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={selectedSale && !isVoidModalOpen}
        onClose={() => setSelectedSale(null)}
        title={`Receipt: ${selectedSale?.receiptId}`}
        size="lg"
      >
        {selectedSale && (
          <div className="space-y-6 p-2 text-gray-800">
            <div className="flex justify-between border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(selectedSale.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{getStatusBadge(selectedSale.paymentStatus)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{selectedSale.customer ? selectedSale.customer.name : 'Walk-in'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium text-lg text-indigo-600">{formatCurrency(selectedSale.finalAmount, settings)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-2">Items</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2">Product</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedSale.saleItems?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-2">{item.product?.name} {item.variant ? `(${item.variant.name})` : ''}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">{formatCurrency(item.unitPrice, settings)}</td>
                      <td className="py-2 text-right">{formatCurrency(item.subtotal, settings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="ghost" onClick={() => setSelectedSale(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isVoidModalOpen}
        onClose={() => {
          setIsVoidModalOpen(false);
          setSelectedSale(null);
        }}
        title="Void Sale"
      >
        <div className="p-2 space-y-4">
          <div className="bg-red-50 p-4 rounded-lg text-red-800 text-sm">
            <strong>Warning:</strong> You are about to void receipt <strong>{selectedSale?.receiptId}</strong>. This will revert inventory changes and mark the sale as voided.
          </div>
          <Input
            label="Reason for Voiding"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            required
            fullWidth
            placeholder="e.g. Customer returned items, mistake in order..."
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsVoidModalOpen(false);
                setSelectedSale(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleVoidSale}
              disabled={voidSale.isPending || !voidReason.trim()}
            >
              {voidSale.isPending ? 'Processing...' : 'Confirm Void'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersPage;
