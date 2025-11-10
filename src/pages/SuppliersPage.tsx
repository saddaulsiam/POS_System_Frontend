import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, ConfirmModal } from "../components/common";
import { Pagination } from "../components/sales/Pagination";
import { SupplierModal } from "../components/suppliers/SupplierModal";
import { SupplierSearch } from "../components/suppliers/SupplierSearch";
import { SuppliersTable } from "../components/suppliers/SuppliersTable";
import {
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from "../services/queries";
import {
  CreateSupplierRequest,
  Supplier,
  UpdateSupplierRequest,
} from "../types";

interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

const SuppliersPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // React Query hooks
  const { data: suppliersResponse, isLoading } = useSuppliers({
    page: currentPage,
    limit: 20,
    search: searchTerm || undefined,
  });

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const suppliers: Supplier[] = suppliersResponse?.data || [];
  const totalPages = suppliersResponse?.pagination?.totalPages || 1;

  const handleAdd = () => {
    setEditingSupplier(null);
    setShowModal(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleSubmit = async (formData: SupplierFormData) => {
    if (!formData.name.trim()) {
      toast.error("Supplier name is required");
      return;
    }

    try {
      const supplierData: CreateSupplierRequest | UpdateSupplierRequest = {
        name: formData.name.trim(),
        contactName: formData.contactName.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      if (editingSupplier) {
        await updateSupplier.mutateAsync({
          id: editingSupplier.id,
          data: supplierData,
        });
        toast.success("Supplier updated successfully");
      } else {
        await createSupplier.mutateAsync(supplierData as CreateSupplierRequest);
        toast.success("Supplier created successfully");
      }

      setShowModal(false);
    } catch (error: any) {
      console.error("Supplier save error:", error);

      // Handle different error response formats
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save supplier";

      toast.error(errorMessage);
      throw error; // Re-throw to keep modal open
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    setDeletingSupplier(supplier);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingSupplier) return;

    try {
      await deleteSupplier.mutateAsync(deletingSupplier.id);
      toast.success("Supplier deleted successfully");
      setShowDeleteConfirm(false);
      setDeletingSupplier(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete supplier");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Supplier Management
          </h1>
          <Button variant="primary" onClick={handleAdd}>
            Add Supplier
          </Button>
        </div>

        {/* Search */}
        <SupplierSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Suppliers Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <SuppliersTable
            suppliers={suppliers}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Supplier Modal */}
      <SupplierModal
        isOpen={showModal}
        editingSupplier={editingSupplier}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingSupplier(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the supplier "${deletingSupplier?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteSupplier.isPending}
      />
    </div>
  );
};

export default SuppliersPage;
