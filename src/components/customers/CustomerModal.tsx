import React, { useState, useEffect } from "react";
import { Customer } from "../../types";
import { Button, Input, TextArea, Modal } from "../common";

interface CustomerFormData {
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  editingCustomer: Customer | null;
  initialPhoneNumber?: string;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => Promise<void>;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  editingCustomer,
  initialPhoneNumber,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      // Convert ISO date to YYYY-MM-DD format for date input
      let dateOfBirth = "";
      if (editingCustomer.dateOfBirth) {
        const date = new Date(editingCustomer.dateOfBirth);
        dateOfBirth = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
      }

      setFormData({
        name: editingCustomer.name,
        phoneNumber: editingCustomer.phoneNumber || "",
        email: editingCustomer.email || "",
        dateOfBirth: dateOfBirth,
        address: editingCustomer.address || "",
      });
    } else {
      setFormData({
        name: "",
        phoneNumber: initialPhoneNumber || "",
        email: "",
        dateOfBirth: "",
        address: "",
      });
    }
  }, [editingCustomer, isOpen, initialPhoneNumber]);

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

  const isNewCustomer = !editingCustomer;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isNewCustomer ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            <span className="text-2xl">{isNewCustomer ? "➕" : "✏️"}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isNewCustomer ? "Create New Customer" : "Edit Customer"}
            </h2>
            <p className="text-xs text-gray-500">
              {isNewCustomer
                ? "Add customer details for loyalty program"
                : "Update customer information"}
            </p>
          </div>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Required Field Section */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-blue-900">
              📋 Required Information
            </span>
          </div>

          <Input
            label="Customer Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            fullWidth
            placeholder="Enter full name"
            className="bg-white"
          />
        </div>

        {/* Contact Information Section */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              📞 Contact Details
            </span>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Phone Number"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                fullWidth
                placeholder="+880 1XXX-XXXXXX"
                className="bg-white"
              />
              {initialPhoneNumber &&
                formData.phoneNumber === initialPhoneNumber && (
                  <span className="absolute right-3 top-9 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    Pre-filled
                  </span>
                )}
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              placeholder="customer@example.com"
              className="bg-white"
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-sm font-semibold text-purple-900">
              🎂 Additional Info
            </span>
            <span className="text-xs text-purple-600">
              (Optional - for birthday rewards)
            </span>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Input
                label="Date of Birth"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                fullWidth
                className="bg-white"
              />
              <p className="mt-1 flex items-center gap-1 text-xs text-purple-600">
                <span>🎁</span> Customers receive bonus points on their
                birthday!
              </p>
            </div>

            <TextArea
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              fullWidth
              placeholder="Street address, city, postal code..."
              className="bg-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className={`px-8 ${
              isNewCustomer
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            } shadow-md`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isNewCustomer ? "➕ Create Customer" : "💾 Update Customer"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
