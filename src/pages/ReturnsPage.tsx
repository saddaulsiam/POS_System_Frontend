import React, { useState } from 'react';
import { useSaleByReceiptId, useRefundSale } from '../services/queries';
import { Button, Input, Modal, ConfirmModal, RefreshButton } from '../components/common';
import { useSettings } from '../context/SettingsContext';
import { formatCurrency } from '../utils/currencyUtils';
import toast from 'react-hot-toast';

const ReturnsPage: React.FC = () => {
  const { settings } = useSettings();
  const [receiptId, setReceiptId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: sale, isLoading, isError, error } = useSaleByReceiptId(searchTerm);
  const refundSale = useRefundSale();

  const [returnItems, setReturnItems] = useState<any>({});
  const [returnReason, setReturnReason] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptId.trim()) return;
    setSearchTerm(receiptId.trim());
    setReturnItems({});
  };

  const handleQuantityChange = (itemId: number, maxQty: number, val: string) => {
    const qty = parseInt(val) || 0;
    if (qty < 0 || qty > maxQty) return;
    setReturnItems((prev: any) => ({
      ...prev,
      [itemId]: qty
    }));
  };

  const handleReturn = async () => {
    if (!sale) return;

    const itemsToReturn = Object.keys(returnItems)
      .filter((id) => returnItems[id] > 0)
      .map((id) => ({
        saleItemId: parseInt(id),
        quantity: returnItems[id],
      }));

    if (itemsToReturn.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }

    try {
      await refundSale.mutateAsync({
        id: sale.id,
        data: { items: itemsToReturn, reason: returnReason }
      });
      toast.success('Return processed successfully');
      setSearchTerm('');
      setReceiptId('');
      setReturnItems({});
      setReturnReason('');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to process return');
    }
  };

  const totalReturnAmount = sale?.saleItems?.reduce((sum: number, item: any) => {
    const returnQty = returnItems[item.id] || 0;
    return sum + (returnQty * item.unitPrice);
  }, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Returns & Refunds</h1>
        <p className="mt-1 text-slate-500">Process customer returns and refund items.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-800">Find Receipt</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <Input
                label="Receipt ID"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value)}
                placeholder="e.g. REC-12345678"
                fullWidth
                required
              />
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>

            {isError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {(error as any)?.response?.data?.error || 'Receipt not found'}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2">
          {sale ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Receipt: {sale.receiptId}</h2>
                  <p className="text-sm text-gray-500">Date: {new Date(sale.createdAt).toLocaleString()}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {sale.paymentStatus}
                </span>
              </div>

              {(sale.paymentStatus as string) === 'REFUNDED' || (sale.paymentStatus as string) === 'VOIDED' ? (
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg mb-6">
                  This sale has already been {sale.paymentStatus.toLowerCase()}. You cannot process further returns on this receipt.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Item</th>
                          <th className="px-4 py-3 font-semibold">Purchased</th>
                          <th className="px-4 py-3 font-semibold">Price</th>
                          <th className="px-4 py-3 font-semibold w-32">Return Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sale.saleItems?.map((item: any) => {
                          const maxQty = item.quantity;
                          return (
                            <tr key={item.id}>
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {item.product?.name} {item.variant ? `(${item.variant.name})` : ''}
                              </td>
                              <td className="px-4 py-3 text-gray-600">{maxQty}</td>
                              <td className="px-4 py-3 text-gray-600">{formatCurrency(item.unitPrice, settings)}</td>
                              <td className="px-4 py-3">
                                <Input
                                  type="number"
                                  min="0"
                                  max={maxQty}
                                  value={returnItems[item.id] || ''}
                                  onChange={(e) => handleQuantityChange(item.id, maxQty, e.target.value)}
                                  placeholder="0"
                                  className="w-full text-center"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <Input
                      label="Reason for Return"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      fullWidth
                      placeholder="e.g. Defective, Wrong item..."
                    />

                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <span className="font-medium text-gray-700">Total Refund Amount:</span>
                      <span className="text-xl font-bold text-red-600">{formatCurrency(totalReturnAmount, settings)}</span>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchTerm('');
                          setReceiptId('');
                          setReturnItems({});
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleReturn}
                        disabled={refundSale.isPending || totalReturnAmount === 0}
                      >
                        {refundSale.isPending ? 'Processing...' : 'Process Refund'}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <svg className="mb-3 h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No Receipt Selected</h3>
              <p className="mt-1 max-w-sm text-center text-sm text-gray-500">
                Search for a receipt ID on the left to view details and process returns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
