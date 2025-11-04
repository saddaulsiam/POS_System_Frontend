import React, { useEffect, useState } from "react";
import { employeesAPI } from "../../services/api/employeesAPI";
import { Employee } from "../../types";
import { Button, Input, Modal } from "../common";
import ImageUpload from "../common/ImageUpload";

interface EmployeeFormData {
  name: string;
  username: string;
  pinCode: string;
  role: string;
  email?: string;
  phone?: string;
  photo?: string;
  joinedDate?: string;
  salary?: number;
  contractDetails?: string;
  notes?: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  editingEmployee: Employee | null;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  editingEmployee,
  onClose,
  onSubmit,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: "",
    username: "",
    pinCode: "",
    role: "STAFF",
    email: "",
    phone: "",
    photo: "",
    joinedDate: "",
    salary: undefined,
    contractDetails: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingEmployee) {
      setFormData({
        name: editingEmployee.name,
        username: editingEmployee.username,
        pinCode: "",
        role: editingEmployee.role,
        email: editingEmployee.email || "",
        phone: editingEmployee.phone || "",
        photo: editingEmployee.photo || "",
        joinedDate: editingEmployee.joinedDate
          ? editingEmployee.joinedDate.split("T")[0]
          : "",
        salary: editingEmployee.salary ?? undefined,
        contractDetails: editingEmployee.contractDetails || "",
        notes: editingEmployee.notes || "",
      });
      setPhotoPreview(editingEmployee.photo || "");
      setPhotoFile(null);
    } else {
      setFormData({
        name: "",
        username: "",
        pinCode: "",
        role: "STAFF",
        email: "",
        phone: "",
        photo: "",
        joinedDate: "",
        salary: undefined,
        contractDetails: "",
        notes: "",
      });
      setPhotoPreview("");
      setPhotoFile(null);
    }
  }, [editingEmployee, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? undefined : Number(value)) : value,
    }));
  };

  const isNewEmployee = !editingEmployee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let dataToSubmit: EmployeeFormData | Omit<EmployeeFormData, "pinCode">;

      if (editingEmployee && !formData.pinCode.trim()) {
        const { pinCode, ...dataWithoutPin } = formData;
        dataToSubmit = dataWithoutPin;
      } else {
        dataToSubmit = formData;
      }

      // Save employee (create or update)
      await onSubmit(dataToSubmit as EmployeeFormData);
      // If photo file selected, upload it
      if (photoFile && editingEmployee) {
        const res = await employeesAPI.uploadPhoto(
          editingEmployee.id,
          photoFile,
        );
        setPhotoPreview(res.url);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      title={
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${
              isNewEmployee ? "bg-blue-100" : "bg-green-100"
            }`}
          >
            <span className="text-2xl">{isNewEmployee ? "➕" : "✏️"}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isNewEmployee ? "Add New Employee" : "Edit Employee"}
            </h2>
            <p className="text-xs text-gray-500">
              {isNewEmployee
                ? "Add employee details for system access"
                : "Update employee information"}
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column: Personal & Account Info */}
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-blue-900">
                  👤 Personal & Account Info
                </span>
              </div>
              <div className="space-y-4">
                <Input
                  label="Employee Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  placeholder="Enter full name"
                  className="bg-white"
                />
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  placeholder="Unique username"
                  className="bg-white"
                />
                <div>
                  <label className="mb-1 block text-sm font-medium">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full rounded border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="CASHIER">Cashier</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>
                <Input
                  label={`PIN Code${editingEmployee ? " (leave blank to keep unchanged)" : ""}`}
                  type="password"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  minLength={4}
                  maxLength={8}
                  required={isNewEmployee}
                  fullWidth
                  placeholder="4-8 digit PIN"
                  className="bg-white"
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  placeholder="Email address"
                  className="bg-white"
                />
                <Input
                  label="Phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  placeholder="Phone number"
                  className="bg-white"
                />
              </div>
            </div>
          </div>
          {/* Right Column: Employment & Extra Info */}
          <div className="flex flex-col gap-5">
            <div className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    🗂 Employment & Extra Info
                  </span>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <ImageUpload
                        label="Photo"
                        value={photoPreview}
                        onChange={(file, preview) => {
                          setPhotoPreview(preview);
                          setPhotoFile(file);
                        }}
                      />
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          alt="Employee Preview"
                          className="absolute right-12 top-4 z-10 h-24 w-24 rounded-lg border border-gray-300 bg-white object-cover shadow"
                          style={{ transform: "translate(50%,-50%)" }}
                        />
                      )}
                    </div>
                  </div>
                  <Input
                    label="Joined Date"
                    type="date"
                    name="joinedDate"
                    value={formData.joinedDate}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    className="bg-white"
                  />
                  <Input
                    label="Salary"
                    type="number"
                    name="salary"
                    value={formData.salary === undefined ? "" : formData.salary}
                    onChange={handleInputChange}
                    min={0}
                    step={0.01}
                    fullWidth
                    required
                    placeholder="Salary (optional)"
                    className="bg-white"
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Contract Details
                    </label>
                    <textarea
                      name="contractDetails"
                      value={formData.contractDetails}
                      onChange={handleInputChange}
                      className="min-h-[48px] w-full rounded border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Contract details, terms, etc."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="min-h-[48px] w-full rounded border bg-white px-3 py-2 focus:ring-2 focus:ring-blue-400"
                      placeholder="Additional notes about the employee"
                    />
                  </div>
                </div>
              </div>
            </div>
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
              isNewEmployee
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
                {isNewEmployee ? "➕ Add Employee" : "💾 Update Employee"}
              </span>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;
