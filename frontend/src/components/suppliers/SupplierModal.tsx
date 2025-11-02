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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSupplier ? "Edit Supplier" : "Add New Supplier"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Supplier Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          fullWidth
        />

        <Input
          label="Contact Person"
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleInputChange}
          fullWidth
        />

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          fullWidth
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
        />

        <TextArea
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          fullWidth
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editingSupplier ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
