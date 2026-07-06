import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, ConfirmModal } from "../components/common";
import EmployeeDetailsView from "../components/employees/EmployeeDetailsView";
import EmployeeModal from "../components/employees/EmployeeModal";
import { EmployeeSearch } from "../components/employees/EmployeeSearch";
import { EmployeesTable } from "../components/employees/EmployeesTable";
import PinPromptModal from "../components/employees/PinPromptModal";
import { Pagination } from "../components/sales/Pagination";
import { Employee } from "../types";
import {
  useEmployees,
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useUpdateEmployeePin,
} from "../services/queries";

interface EmployeeFormData {
  name: string;
  username: string;
  pinCode: string;
  role: string;
}

const EmployeesPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedEmployeeForPin, setSelectedEmployeeForPin] =
    useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
    null,
  );

  // React Query hooks
  const { data: employeesData, isLoading } = useEmployees({
    page: currentPage,
    limit: 20,
    search: searchTerm || undefined,
  });
  const employees = employeesData?.data || [];
  const totalPages = employeesData?.pagination.totalPages || 1;

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const updateEmployeePin = useUpdateEmployeePin();
  const { data: viewedEmployeeDetails } = useEmployee(viewingEmployee?.id);

  const handleAdd = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
    setViewingEmployee(null);
  };

  const handleSubmit = async (formData: EmployeeFormData) => {
    // Ensure role is correct type
    const safeFormData = {
      ...formData,
      role: formData.role as "ADMIN" | "MANAGER" | "CASHIER" | "STAFF",
    };
    try {
      if (editingEmployee) {
        await updateEmployee.mutateAsync({
          id: editingEmployee.id,
          data: safeFormData,
        });
        toast.success("Employee updated successfully");
      } else {
        await createEmployee.mutateAsync(safeFormData);
        toast.success("Employee created successfully");
      }
      setShowModal(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingEmployee) return;
    try {
      await deleteEmployee.mutateAsync(deletingEmployee.id);
      toast.success("✅ Employee deleted successfully");
      setShowDeleteConfirm(false);
      setDeletingEmployee(null);
    } catch (error: any) {
      console.error("Delete employee error:", error);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "❌ Failed to delete employee",
      );
    }
  };

  // View details handler
  const handleViewDetails = (employee: Employee) => {
    setViewingEmployee(employee);
  };

  const handleCloseDetails = () => {
    setViewingEmployee(null);
  };

  // PIN reset handlers (use a React modal because window.prompt is not available in Electron renderer)
  const handleResetPin = (employee: Employee) => {
    setShowPinModal(true);
    setSelectedEmployeeForPin(employee);
  };

  const handleSubmitPin = async (newPin: string) => {
    if (!selectedEmployeeForPin) return;
    // Basic validation already performed in modal, but safeguard here too
    if (
      !newPin ||
      newPin.length < 4 ||
      newPin.length > 8 ||
      !/^[0-9]+$/.test(newPin)
    ) {
      toast.error("PIN must be 4-8 digits");
      return;
    }
    try {
      await updateEmployeePin.mutateAsync({
        id: selectedEmployeeForPin.id,
        pinCode: newPin,
      });
      toast.success("PIN reset successfully");
      setShowPinModal(false);
      setSelectedEmployeeForPin(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset PIN");
    }
  };

  if (viewingEmployee) {
    const displayEmployee = viewedEmployeeDetails || viewingEmployee;
    return (
      <>
        <EmployeeDetailsView
          employee={displayEmployee}
          onBack={handleCloseDetails}
          onEdit={handleEdit}
          onResetPin={handleResetPin}
        />

        <PinPromptModal
          isOpen={showPinModal}
          onClose={() => {
            setShowPinModal(false);
            setSelectedEmployeeForPin(null);
          }}
          onSubmit={handleSubmitPin}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Management
          </h1>
          <Button variant="primary" onClick={handleAdd}>
            Add Employee
          </Button>
        </div>

        <EmployeeSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <EmployeesTable
            employees={employees}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <EmployeeModal
        isOpen={showModal}
        editingEmployee={editingEmployee}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />

      <PinPromptModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setSelectedEmployeeForPin(null);
        }}
        onSubmit={handleSubmitPin}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingEmployee(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deletingEmployee?.name}"? This action cannot be undone and will remove all employee data.`}
        confirmText="Delete Employee"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteEmployee.isPending}
      />
    </div>
  );
};

export default EmployeesPage;
