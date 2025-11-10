import { FC, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  CategoryTableSkeleton,
  ConfirmModal,
  Input,
  Modal,
} from "../components/common";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../services/queries";
import { Category } from "../types";

const CategoriesPage: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null,
  );
  const [formName, setFormName] = useState("");

  // React Query hooks
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const handleAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setShowModal(true);
  };

  const handleDelete = async (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      toast.success("Category deleted");
      setShowDeleteConfirm(false);
      setDeletingCategory(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: { name: formName.trim() },
        });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync({ name: formName.trim() });
        toast.success("Category created");
      }
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to save category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Category Management
          </h1>
          <Button variant="primary" onClick={handleAdd}>
            Add Category
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          {isLoading ? (
            <CategoryTableSkeleton />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {cat.name}
                      </td>
                      <td className="space-x-4 whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cat)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(cat)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingCategory
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name"
            type="text"
            placeholder="Enter category name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            fullWidth
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingCategory(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the category "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
};

export default CategoriesPage;
