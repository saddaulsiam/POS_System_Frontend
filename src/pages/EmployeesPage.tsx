import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../components/common";
import EmployeeDetailsView from "../components/employees/EmployeeDetailsView";
import EmployeeModal from "../components/employees/EmployeeModal";
import { EmployeeSearch } from "../components/employees/EmployeeSearch";
import { EmployeesTable } from "../components/employees/EmployeesTable";
import PinPromptModal from "../components/employees/PinPromptModal";
import { Pagination } from "../components/sales/Pagination";
import { employeesAPI } from "../services";
import { Employee } from "../types";

interface EmployeeFormData {
  name: string;
  username: string;
  pinCode: string;
  role: string;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedEmployeeForPin, setSelectedEmployeeForPin] =
    useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line
  }, [searchTerm, currentPage]);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await employeesAPI.getAll({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
      });
      setEmployees(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  };

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
        await employeesAPI.update(editingEmployee.id, safeFormData);
        toast.success("Employee updated successfully");
      } else {
        await employeesAPI.create(safeFormData);
        toast.success("Employee created successfully");
      }
      setShowModal(false);
      loadEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save employee");
      throw error;
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Delete employee "${employee.name}"?`)) return;
    try {
      await employeesAPI.delete(employee.id);
      toast.success("Employee deleted successfully");
      loadEmployees();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete employee");
    }
  };

  // View details handler

  const handleViewDetails = async (employee: Employee) => {
    try {
      const fullEmployee = await employeesAPI.getById(employee.id);
      setViewingEmployee(fullEmployee);
    } catch (error: any) {
      toast.error("Failed to load employee details");
    }
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
      await employeesAPI.resetPin(selectedEmployeeForPin.id, newPin);
      toast.success("PIN reset successfully");
      setShowPinModal(false);
      setSelectedEmployeeForPin(null);
      // reload list or refresh view
      loadEmployees();
      if (viewingEmployee && viewingEmployee.id === selectedEmployeeForPin.id) {
        // refresh details view
        const fullEmployee = await employeesAPI.getById(
          selectedEmployeeForPin.id,
        );
        setViewingEmployee(fullEmployee);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to reset PIN");
    }
  };

  if (viewingEmployee) {
    return (
      <>
        <EmployeeDetailsView
          employee={viewingEmployee}
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
    </div>
  );
};

export default EmployeesPage;
