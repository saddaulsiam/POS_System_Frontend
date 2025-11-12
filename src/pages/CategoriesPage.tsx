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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // React Query hooks
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const handleAdd = () => {
    setEditingCategory(null);
    setFormName("");
    setSelectedFile(null);
    setPreviewUrl("");
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setSelectedFile(null);
    setPreviewUrl(category.icon || "");
    setShowModal(true);
  };

  const handleDelete = async (category: Category) => {
    setDeletingCategory(category);
    setShowDeleteConfirm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
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
      const formData = new FormData();
      formData.append("name", formName.trim());

      // Only append icon if a new file is selected
      if (selectedFile) {
        formData.append("icon", selectedFile);
      }

      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: formData,
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory.mutateAsync(formData);
        toast.success("Category created successfully");
      }

      // Reset form and close modal
      setShowModal(false);
      setFormName("");
      setSelectedFile(null);
      setPreviewUrl("");
      setEditingCategory(null);
    } catch (error: any) {
      console.error("Save category error:", error);
      const errorMessage =
        error?.response?.data?.error || "Failed to save category";
      toast.error(errorMessage);
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
                    Image
                  </th>
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
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          {cat.icon ? (
                            <img
                              src={cat.icon}
                              alt={cat.name}
                              className="mr-3 h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                              <svg
                                className="h-6 w-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>

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
            <Button
              onClick={handleSubmit}
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : editingCategory
                  ? "Update"
                  : "Create"}
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <Input
            label="Category Name"
            type="text"
            placeholder="Enter category name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
            fullWidth
          />

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category Icon
            </label>

            {previewUrl ? (
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-32 w-32 rounded-lg border-2 border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center justify-center">
                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-2 h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-1 text-sm font-semibold text-gray-500">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, WEBP (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>
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
