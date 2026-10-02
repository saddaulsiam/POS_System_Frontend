import { FC, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  ConfirmModal,
  Input,
  Modal,
} from "../components/common";
import {
  useBrands,
  useCreateBrand,
  useDeleteBrand,
  useUpdateBrand,
} from "../services/queries";
import { Brand } from "../types";

const BrandsPage: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);

  const [formName, setFormName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // React Query hooks
  const { data: brands = [], isLoading } = useBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();

  const isSubmitting = createBrand.isPending || updateBrand.isPending;

  const handleAdd = () => {
    setEditingBrand(null);
    setFormName("");
    setSelectedFile(null);
    setPreviewUrl("");
    setShowModal(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormName(brand.name);
    setSelectedFile(null);
    setPreviewUrl(brand.icon || "");
    setShowModal(true);
  };

  const handleDelete = (brand: Brand) => {
    setDeletingBrand(brand);
    setShowDeleteConfirm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
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
    if (!deletingBrand) return;
    try {
      await deleteBrand.mutateAsync(deletingBrand.id);
      toast.success("Brand deleted");
      setShowDeleteConfirm(false);
      setDeletingBrand(null);
    } catch (error) {
      toast.error("Failed to delete brand");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      // In the API we configured it to accept form-data or JSON, but brandsAPI creates FormData for us.
      // So we just need to pass an object to the mutation.
      const payload = {
        name: formName.trim(),
        icon: selectedFile,
      };

      if (editingBrand) {
        await updateBrand.mutateAsync({ id: editingBrand.id, data: payload });
        toast.success("Brand updated successfully");
      } else {
        await createBrand.mutateAsync(payload);
        toast.success("Brand created successfully");
      }
      setShowModal(false);
    } catch (error: any) {
      // Error handled by API interceptor
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product brands
          </p>
        </div>
        <Button onClick={handleAdd} variant="primary">
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Brand
          </span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">Brand</th>
                <th className="px-6 py-4 font-semibold text-center">Products</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Loading brands...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="mb-3 h-12 w-12 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-900">
                        No brands found
                      </p>
                      <p className="mt-1 text-sm">
                        Get started by creating a new brand.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                brands.map((brand: any) => (
                  <tr
                    key={brand.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 overflow-hidden">
                          {brand.icon ? (
                            <img
                              src={brand.icon}
                              alt={brand.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-500">
                              {brand.name.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="font-medium text-gray-900">
                          {brand.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {brand._count?.products || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(brand)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(brand)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => !isSubmitting && setShowModal(false)}
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Nike, Apple, Samsung"
              fullWidth
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Brand Logo
            </label>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  id="brand-logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById("brand-logo")?.click()}
                    disabled={isSubmitting}
                  >
                    Choose Image
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={isSubmitting}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Recommended size: 256x256px. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingBrand
                  ? "Update Brand"
                  : "Create Brand"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Brand"
        message={`Are you sure you want to delete "${deletingBrand?.name}"? Products assigned to this brand will have their brand removed.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default BrandsPage;
