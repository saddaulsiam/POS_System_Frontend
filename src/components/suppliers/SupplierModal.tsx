import React, { useState, useEffect } from "react";
import { Supplier } from "../../types";
import { Button, Input, TextArea, Modal } from "../common";

interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

interface SupplierModalProps {
  isOpen: boolean;
  editingSupplier: Supplier | null;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => Promise<void>;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  editingSupplier,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name,
        contactName: editingSupplier.contactName || "",
        phone: editingSupplier.phone || "",
        email: editingSupplier.email || "",
        address: editingSupplier.address || "",
      });
    } else {
      setFormData({
        name: "",
        contactName: "",
        phone: "",
        email: "",
        address: "",
      });
    }
  }, [editingSupplier, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        name: "",
        contactName: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (error) {
      // Error is handled in parent component
      console.error("Error submitting supplier:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-purple-100 p-2">
            <svg
              className="h-6 w-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h2>
            <p className="text-sm text-gray-600">
              {editingSupplier
                ? "Update supplier information"
                : "Add a new supplier to your system"}
            </p>
          </div>
        </div>
      }
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editingSupplier
                ? "Update Supplier"
                : "Create Supplier"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Supplier Name - Required */}
        <Input
          label="Supplier Name"
          placeholder="Enter supplier name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          fullWidth
          autoFocus
        />

        {/* Contact Person */}
        <Input
          label="Contact Person"
          placeholder="Enter contact person's name (optional)"
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleInputChange}
          fullWidth
        />

        {/* Phone and Email */}
        <Input
          label="Phone Number"
          placeholder="e.g., +8801000000000"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          fullWidth
        />

        <Input
          label="Email"
          placeholder="e.g., supplier@example.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
        />

        {/* Address */}
        <TextArea
          label="Address"
          placeholder="Enter supplier's complete address (optional)"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          fullWidth
        />
      </form>
    </Modal>
  );
};
