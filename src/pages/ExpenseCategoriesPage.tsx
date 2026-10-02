import React, { useState } from 'react';
import { useExpenseCategories, useCreateExpenseCategory, useUpdateExpenseCategory, useDeleteExpenseCategory } from '../services/queries';
import { Button, Input, Modal, ConfirmModal } from '../components/common';
import toast from 'react-hot-toast';

export const ExpenseCategoriesPage: React.FC = () => {
  const { data: categories = [], isLoading } = useExpenseCategories();
  const createCategory = useCreateExpenseCategory();
  const updateCategory = useUpdateExpenseCategory();
  const deleteCategory = useDeleteExpenseCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [form, setForm] = useState({ name: '', isActive: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm({ name: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setForm({ name: category.name, isActive: category.isActive });
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
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data: form });
        toast.success('Category updated successfully');
      } else {
        await createCategory.mutateAsync(form);
        toast.success('Category added successfully');
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
      await deleteCategory.mutateAsync(deletingId);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to delete category');
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Categories</h1>
            <p className="mt-1 text-sm text-gray-500">Manage categories for your expenses</p>
          </div>
          <Button onClick={handleOpenAdd} variant="primary">
            + Add Category
          </Button>
        </div>

        {/* Categories Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-gray-500">
                      Loading categories...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-gray-500">
                      No expense categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category: any) => (
                    <tr key={category.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(category)}
                            className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50"
                            title="Edit Category"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenDelete(category.id)}
                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                            title="Delete Category"
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
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            fullWidth
            placeholder="e.g. Utility Bills"
          />
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active Category
            </label>
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
              {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
};

export default ExpenseCategoriesPage;
