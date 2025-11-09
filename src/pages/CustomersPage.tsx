import React, { useState } from "react";
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../types";
import toast from "react-hot-toast";
import { CustomerSearch } from "../components/customers/CustomerSearch";
import { CustomersTable } from "../components/customers/CustomersTable";
import { CustomerModal } from "../components/customers/CustomerModal";
import { Pagination } from "../components/sales/Pagination";
import { Button, BackButton } from "../components/common";
import {
  LoyaltyDashboard,
  PointsHistoryTable,
  RewardsGallery,
} from "../components/loyalty";
import {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../services/queries/customersQueries";

interface CustomerFormData {
  name: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  address: string;
}

const CustomersPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingCustomerId, setViewingCustomerId] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"overview" | "loyalty">(
    "overview",
  );

  // React Query hooks
  const {
    data: customersResponse,
    isLoading,
    refetch: refetchCustomers,
  } = useCustomers({
    page: currentPage,
    limit: 20,
    search: searchTerm || undefined,
  });

  const { data: viewingCustomer, refetch: refetchViewingCustomer } =
    useCustomer(viewingCustomerId ?? undefined);

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const customers: Customer[] = customersResponse?.data || [];
  const totalPages = customersResponse?.pagination?.totalPages || 1;

  const handleAdd = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setViewingCustomerId(null); // Close detail view when editing
    setShowModal(true);
  };

  const handleSubmit = async (formData: CustomerFormData) => {
    if (!formData.name.trim()) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const customerData: CreateCustomerRequest | UpdateCustomerRequest = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        email: formData.email.trim() || undefined,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      let updatedCustomerId: number | null = null;

      if (editingCustomer) {
        await updateCustomer.mutateAsync({
          id: editingCustomer.id,
          data: customerData,
        });
        toast.success("Customer updated successfully");
        updatedCustomerId = editingCustomer.id;
      } else {
        const newCustomer = await createCustomer.mutateAsync(
          customerData as CreateCustomerRequest,
        );
        toast.success("Customer created successfully");
        updatedCustomerId = newCustomer.id;
      }

      setShowModal(false);

      // If we were editing from detail view, set the viewing customer ID
      if (updatedCustomerId && viewingCustomerId) {
        setViewingCustomerId(updatedCustomerId);
      }
    } catch (error: any) {
      console.error("Error saving customer:", error);
      toast.error(error.response?.data?.error || "Failed to save customer");
      throw error; // Re-throw to keep modal open
    }
  };

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`Are you sure you want to delete "${customer.name}"?`)) {
      return;
    }

    try {
      await deleteCustomer.mutateAsync(customer.id);
      toast.success("Customer deleted successfully");
    } catch (error: any) {
      console.error("Error deleting customer:", error);
      toast.error(error.response?.data?.error || "Failed to delete customer");
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setViewingCustomerId(customer.id);
    setActiveTab("overview");
  };

  const handleCloseDetails = () => {
    setViewingCustomerId(null);
    setActiveTab("overview");
  };

  // If viewing customer details, show detail view
  if (viewingCustomer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="mb-6">
            <BackButton
              onClick={handleCloseDetails}
              label="Back to Customers"
              className="mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900">
              {viewingCustomer.name}
            </h1>
            <p className="mt-1 text-gray-600">
              {viewingCustomer.email || viewingCustomer.phoneNumber}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 rounded-lg bg-white shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`border-b-2 px-6 py-4 text-sm font-medium ${
                    activeTab === "overview"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("loyalty")}
                  className={`border-b-2 px-6 py-4 text-sm font-medium ${
                    activeTab === "loyalty"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  🎁 Loyalty Program
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="mb-3 text-sm font-medium text-gray-500">
                        Contact Information
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Phone</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {viewingCustomer.phoneNumber || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Email</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {viewingCustomer.email || "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">
                            Date of Birth
                          </dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {viewingCustomer.dateOfBirth
                              ? new Date(
                                  viewingCustomer.dateOfBirth,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Address</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {viewingCustomer.address || "N/A"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="mb-3 text-sm font-medium text-gray-500">
                        Account Information
                      </h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Customer ID</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            #{viewingCustomer.id}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">
                            Loyalty Points
                          </dt>
                          <dd className="text-lg font-medium text-blue-600">
                            {viewingCustomer.loyaltyPoints || 0}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">
                            Member Since
                          </dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {new Date(
                              viewingCustomer.createdAt,
                            ).toLocaleDateString()}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Status</dt>
                          <dd className="text-sm font-medium">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs ${
                                viewingCustomer.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {viewingCustomer.isActive ? "Active" : "Inactive"}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={() => handleEdit(viewingCustomer)}
                    >
                      Edit Customer
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setActiveTab("loyalty")}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      View Loyalty Details
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "loyalty" && (
                <div className="space-y-6">
                  {/* Loyalty Dashboard */}
                  <LoyaltyDashboard
                    customer={viewingCustomer}
                    onRefresh={() => {
                      refetchCustomers();
                      refetchViewingCustomer();
                    }}
                  />

                  {/* Points History */}
                  <PointsHistoryTable customerId={viewingCustomer.id} />

                  {/* Rewards Gallery */}
                  <RewardsGallery
                    customerId={viewingCustomer.id}
                    customerPoints={viewingCustomer.loyaltyPoints || 0}
                    onRewardRedeemed={() => {
                      refetchCustomers();
                      refetchViewingCustomer();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Management
          </h1>
          <Button variant="primary" onClick={handleAdd}>
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <CustomerSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Customers Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={showModal}
        editingCustomer={editingCustomer}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CustomersPage;
