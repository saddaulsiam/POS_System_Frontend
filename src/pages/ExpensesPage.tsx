import React, { useState } from 'react';
import { useExpenses, useExpenseCategories, useCreateExpense, useUpdateExpense, useDeleteExpense } from '../services/queries';
import { Button, Input, Modal, ConfirmModal } from '../components/common';
import toast from 'react-hot-toast';

export const ExpensesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data = { expenses: [], total: 0, pages: 1 }, isLoading } = useExpenses({ page, limit: 20, categoryId, startDate, endDate });
  const { data: categories = [] } = useExpenseCategories();

  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewNoteExpense, setViewNoteExpense] = useState<any>(null);

  const [form, setForm] = useState({
    categoryId: '',
    amount: '',
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    referenceNo: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setForm({
      categoryId: categories.length > 0 ? categories[0].id.toString() : '',
      amount: '',
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      referenceNo: '',
      note: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: any) => {
    setEditingExpense(expense);
    setForm({
      categoryId: expense.categoryId.toString(),
      amount: expense.amount.toString(),
      date: new Date(new Date(expense.date).getTime() - new Date(expense.date).getTimezoneOffset() * 60000).toISOString().slice(0, 16),
      referenceNo: expense.referenceNo || '',
      note: expense.note || ''
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id: number) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        categoryId: parseInt(form.categoryId),
        amount: parseFloat(form.amount),
        date: new Date(form.date).toISOString(),
        referenceNo: form.referenceNo,
        note: form.note
      };

      if (editingExpense) {
        await updateExpense.mutateAsync({ id: editingExpense.id, data: payload });
        toast.success('Expense updated successfully');
      } else {
        await createExpense.mutateAsync(payload);
        toast.success('Expense recorded successfully');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteExpense.mutateAsync(deletingId);
      toast.success('Expense deleted successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to delete expense');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
            <p className="mt-1 text-sm text-gray-500">Track and manage your store expenses</p>
          </div>
          <Button onClick={handleOpenAdd} variant="primary">
            + Record Expense
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">All Categories</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Reference</th>
                  <th className="px-6 py-4 font-semibold">Note</th>
                  <th className="px-6 py-4 font-semibold">Recorded By</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Loading expenses...
                    </td>
                  </tr>
                ) : data.expenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No expenses found.
                    </td>
                  </tr>
                ) : (
                  data.expenses.map((expense: any) => (
                    <tr key={expense.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {new Date(expense.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {expense.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">৳{expense.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-500">{expense.referenceNo || '-'}</td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs">
                        {expense.note ? (
                          expense.note.length > 30 ? (
                            <div className="flex items-center gap-2">
                              <span className="truncate" title={expense.note}>{expense.note.substring(0, 30)}...</span>
                              <button 
                                onClick={() => setViewNoteExpense(expense)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                              >
                                View
                              </button>
                            </div>
                          ) : (
                            <span>{expense.note}</span>
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{expense.employee?.name || '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(expense)}
                            className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50"
                            title="Edit Expense"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenDelete(expense.id)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Delete Expense"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="ghost"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                  disabled={page === data.pages}
                  variant="ghost"
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{' '}
                    <span className="font-medium">{data.pages}</span>
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <Button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      variant="ghost"
                      className="rounded-l-md rounded-r-none"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                      disabled={page === data.pages}
                      variant="ghost"
                      className="rounded-l-none rounded-r-md"
                    >
                      Next
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Record Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
              <select
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="" disabled>Select category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Amount (৳)"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              fullWidth
              placeholder="0.00"
            />

            <Input
              label="Date"
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              fullWidth
            />

            <Input
              label="Reference No"
              value={form.referenceNo}
              onChange={(e) => setForm({ ...form, referenceNo: e.target.value })}
              fullWidth
              placeholder="e.g. Receipt #1234"
            />

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Optional notes about this expense..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingExpense ? 'Update' : 'Record'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense record? This action cannot be undone."
        confirmText="Delete"
      />

      {/* View Note Modal */}
      <Modal
        isOpen={!!viewNoteExpense}
        onClose={() => setViewNoteExpense(null)}
        title="Expense Note"
      >
        <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700">
          {viewNoteExpense?.note}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={() => setViewNoteExpense(null)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ExpensesPage;
