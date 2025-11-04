import React, { useState, useEffect } from "react";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { inventoryAPI, suppliersAPI, productsAPI } from "../services";
import toast from "react-hot-toast";
import ReceiveItemsModal from "../components/inventory/ReceiveItemsModal";
import EditPOModal from "../components/inventory/EditPOModal";
import { formatCurrency } from "../utils/currencyUtils";

interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  orderDate: string;
  expectedDate: string | null;
  receivedDate: string | null;
  status: string;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  supplier?: {
    id: number;
    name: string;
    contactPerson: string;
  };
  items?: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  productId: number;
  variantId: number | null;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  totalCost: number;
  unitPrice: number;
  product?: {
    id: number;
    name: string;
    sku: string;
  };
  variant?: {
    id: number;
    name: string;
    sku: string;
  };
}

interface Supplier {
  id: number;
  name: string;
  contactPerson?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  purchasePrice: number;
}

interface POStats {
  totalOrders: number;
  pendingOrders: number;
  receivedOrders: number;
  cancelledOrders: number;
  partiallyReceivedOrders: number;
  totalValue: number;
}

const PurchaseOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<POStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  // Create PO form
  const [formData, setFormData] = useState({
    supplierId: "",
    orderDate: new Date().toISOString().split("T")[0],
    expectedDate: "",
    notes: "",
  });
  const [poItems, setPOItems] = useState<
    Array<{
      productId: number;
      quantity: number;
      unitPrice: number;
    }>
  >([]);
  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: "1",
    unitPrice: "",
  });

  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
    fetchProducts();
    fetchStats();
  }, [page, statusFilter, supplierFilter]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAllPurchaseOrders({
        page,
        limit: 20,
        status: statusFilter || undefined,
        supplierId: supplierFilter ? parseInt(supplierFilter) : undefined,
      });
      setPurchaseOrders(response.purchaseOrders || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err: any) {
      console.error("Error fetching purchase orders:", err);
      setError("Failed to fetch purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll({ limit: 100 });
      setSuppliers(response.data || []);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 500 });
      setProducts(response.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await inventoryAPI.getPurchaseOrderStats();
      setStats(response);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleAddItem = () => {
    if (
      !currentItem.productId ||
      !currentItem.quantity ||
      !currentItem.unitPrice
    ) {
      toast.error("Please fill all item fields");
      return;
    }

    const product = products.find(
      (p) => p.id === parseInt(currentItem.productId),
    );
    if (!product) return;

    setPOItems([
      ...poItems,
      {
        productId: parseInt(currentItem.productId),
        quantity: parseInt(currentItem.quantity),
        unitPrice: parseFloat(currentItem.unitPrice),
      },
    ]);

    setCurrentItem({ productId: "", quantity: "1", unitPrice: "" });
    toast.success("Item added to purchase order");
  };

  const handleRemoveItem = (index: number) => {
    setPOItems(poItems.filter((_, i) => i !== index));
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierId) {
      toast.error("Please select a supplier");
      return;
    }

    if (poItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      setLoading(true);
      await inventoryAPI.createPurchaseOrder({
        supplierId: parseInt(formData.supplierId),
        orderDate: formData.orderDate,
        expectedDate: formData.expectedDate || undefined,
        items: poItems,
        notes: formData.notes || undefined,
      });

      toast.success("Purchase order created successfully");
      setShowCreateModal(false);
      resetForm();
      fetchPurchaseOrders();
      fetchStats();
    } catch (err: any) {
      console.error("Error creating purchase order:", err);
      toast.error(
        err.response?.data?.error || "Failed to create purchase order",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPO = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this purchase order?")) {
      return;
    }

    try {
      await inventoryAPI.cancelPurchaseOrder(id);
      toast.success("Purchase order cancelled");
      fetchPurchaseOrders();
      fetchStats();
      if (showViewModal) {
        setShowViewModal(false);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to cancel purchase order",
      );
    }
  };

  const handleViewPO = async (po: PurchaseOrder) => {
    try {
      const fullPO = await inventoryAPI.getPurchaseOrderById(po.id);
      setSelectedPO(fullPO);
      setShowViewModal(true);
    } catch (err) {
      toast.error("Failed to load purchase order details");
    }
  };

  const handleReceivePO = async (po: PurchaseOrder) => {
    try {
      const fullPO = await inventoryAPI.getPurchaseOrderById(po.id);
      setSelectedPO(fullPO);
      setShowReceiveModal(true);
    } catch (err) {
      toast.error("Failed to load purchase order details");
    }
  };

  const handleReceiveItems = async (
    poId: number,
    items: Array<{ itemId: number; receivedQuantity: number }>,
  ) => {
    try {
      const response = await inventoryAPI.receiveItems(poId, items);
      toast.success("Items received successfully");

      // Show warnings if any
      if (response.warnings && response.warnings.length > 0) {
        response.warnings.forEach((warning: any) => {
          // Price increase warnings (blue)
          if (warning.severity === "price-increase") {
            toast(`📈 ${warning.productName}: ${warning.message}`, {
              duration: 7000,
              icon: "📈",
              style: {
                background: "#dbeafe",
                color: "#1e40af",
                fontWeight: "500",
              },
            });
          }
          // Price decrease warnings (green)
          else if (warning.severity === "price-decrease") {
            toast(`📉 ${warning.productName}: ${warning.message}`, {
              duration: 7000,
              icon: "📉",
              style: {
                background: "#d1fae5",
                color: "#065f46",
                fontWeight: "500",
              },
            });
          }
          // Critical margin warnings (red)
          else if (warning.severity === "critical") {
            toast.error(`⚠️ ${warning.productName}: ${warning.message}`, {
              duration: 8000,
            });
          }
          // Low margin warnings (yellow)
          else if (warning.severity === "warning") {
            toast(`⚠️ ${warning.productName}: ${warning.message}`, {
              duration: 6000,
              icon: "⚠️",
              style: {
                background: "#fef3c7",
                color: "#92400e",
              },
            });
          }
        });
      }

      setShowReceiveModal(false);
      fetchPurchaseOrders();
      fetchStats();
      // Update view modal if open
      if (showViewModal && selectedPO) {
        const updatedPO = await inventoryAPI.getPurchaseOrderById(
          selectedPO.id,
        );
        setSelectedPO(updatedPO);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to receive items");
      throw err;
    }
  };

  const handleEditPO = async (po: PurchaseOrder) => {
    try {
      const fullPO = await inventoryAPI.getPurchaseOrderById(po.id);
      setSelectedPO(fullPO);
      setShowEditModal(true);
    } catch (err) {
      toast.error("Failed to load purchase order details");
    }
  };

  const handleUpdatePO = async (
    poId: number,
    data: {
      supplierId: number;
      orderDate: string;
      expectedDate?: string;
      notes?: string;
      items: Array<{ productId: number; quantity: number; unitPrice: number }>;
    },
  ) => {
    try {
      await inventoryAPI.updatePurchaseOrder(poId, data);
      toast.success("Purchase order updated successfully");
      setShowEditModal(false);
      fetchPurchaseOrders();
      fetchStats();
      // Update view modal if open
      if (showViewModal && selectedPO) {
        const updatedPO = await inventoryAPI.getPurchaseOrderById(
          selectedPO.id,
        );
        setSelectedPO(updatedPO);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to update purchase order",
      );
      throw err;
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: "",
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: "",
      notes: "",
    });
    setPOItems([]);
    setCurrentItem({ productId: "", quantity: "1", unitPrice: "" });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PARTIALLY_RECEIVED: "bg-blue-100 text-blue-800",
      RECEIVED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  const getTotalAmount = () => {
    return poItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Purchase Orders
            </h1>
            <p className="mt-2 text-gray-600">
              Manage purchase orders and receiving
            </p>
          </div>
          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              + Create Purchase Order
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      {stats && (user?.role === "ADMIN" || user?.role === "MANAGER") && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stats.totalOrders}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Partial</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {stats.partiallyReceivedOrders}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Received</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats.receivedOrders}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(stats.totalValue, settings)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PARTIALLY_RECEIVED">Partially Received</option>
              <option value="RECEIVED">Received</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => {
                setSupplierFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter("");
                setSupplierFilter("");
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading && purchaseOrders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : purchaseOrders.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No purchase orders found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Create your first purchase order
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      PO #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                      Expected Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {po.poNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {po.supplier?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(po.orderDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {po.expectedDate ? formatDate(po.expectedDate) : "-"}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(po.totalAmount, settings)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(po.status)}
                      </td>
                      <td className="space-x-2 px-6 py-4 text-right text-sm">
                        <button
                          onClick={() => handleViewPO(po)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {po.status === "PENDING" && (
                          <button
                            onClick={() => handleEditPO(po)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                        )}
                        {(po.status === "PENDING" ||
                          po.status === "PARTIAL") && (
                          <button
                            onClick={() => handleReceivePO(po)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Receive
                          </button>
                        )}
                        {po.status !== "RECEIVED" &&
                          po.status !== "CANCELLED" && (
                            <button
                              onClick={() => handleCancelPO(po.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create PO Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Create Purchase Order
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
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

            <form onSubmit={handleCreatePO} className="px-6 py-4">
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Supplier <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierId: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Order Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) =>
                      setFormData({ ...formData, orderDate: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expected Date
                  </label>
                  <Input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedDate: e.target.value })
                    }
                    fullWidth
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              {/* Add Items Section */}
              <div className="mb-6 border-t pt-6">
                <h4 className="mb-4 font-semibold text-gray-900">Add Items</h4>

                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product
                    </label>
                    <select
                      value={currentItem.productId}
                      onChange={(e) => {
                        const product = products.find(
                          (p) => p.id === parseInt(e.target.value),
                        );
                        setCurrentItem({
                          ...currentItem,
                          productId: e.target.value,
                          unitPrice: product?.purchasePrice
                            ? product.purchasePrice.toString()
                            : "",
                        });
                      }}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.sku}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: e.target.value,
                        })
                      }
                      fullWidth
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Unit Price
                    </label>
                    <Input
                      type="number"
                      step={0.01}
                      min={0}
                      value={currentItem.unitPrice}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          unitPrice: e.target.value,
                        })
                      }
                      fullWidth
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                >
                  + Add Item
                </button>
              </div>

              {/* Items List */}
              {poItems.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-4 font-semibold text-gray-900">
                    Order Items ({poItems.length})
                  </h4>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            Product
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                            Unit Price
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                            Total
                          </th>
                          <th className="px-4 py-2 text-xs font-medium text-gray-500"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {poItems.map((item, index) => {
                          const product = products.find(
                            (p) => p.id === item.productId,
                          );
                          return (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {product?.name}
                              </td>
                              <td className="px-4 py-2 text-right text-sm text-gray-900">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 text-right text-sm text-gray-900">
                                {formatCurrency(item.unitPrice, settings)}
                              </td>
                              <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                {formatCurrency(
                                  item.quantity * item.unitPrice,
                                  settings,
                                )}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-sm text-red-600 hover:text-red-900"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-gray-50">
                          <td
                            colSpan={3}
                            className="px-4 py-2 text-right text-sm font-semibold text-gray-900"
                          >
                            Total Amount:
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-bold text-gray-900">
                            {formatCurrency(getTotalAmount(), settings)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-3 border-t pt-4">
                <button
                  type="submit"
                  disabled={loading || poItems.length === 0}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Purchase Order"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View PO Modal */}
      {showViewModal && selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Purchase Order {selectedPO.poNumber}
                </h3>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedPO.status)}
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <svg
                      className="h-6 w-6"
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
              </div>
            </div>

            <div className="px-6 py-4">
              {/* PO Details */}
              <div className="mb-6 grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Supplier
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPO.supplier?.name}
                  </p>
                  {selectedPO.supplier?.contactPerson && (
                    <p className="text-sm text-gray-600">
                      Contact: {selectedPO.supplier.contactPerson}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Order Date
                  </h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedPO.orderDate)}
                  </p>
                  {selectedPO.expectedDate && (
                    <p className="text-sm text-gray-600">
                      Expected: {formatDate(selectedPO.expectedDate)}
                    </p>
                  )}
                </div>
              </div>

              {selectedPO.notes && (
                <div className="mb-6">
                  <h4 className="mb-2 text-sm font-medium text-gray-500">
                    Notes
                  </h4>
                  <p className="rounded bg-gray-50 p-3 text-sm text-gray-900">
                    {selectedPO.notes}
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="mb-6">
                <h4 className="mb-4 font-semibold text-gray-900">Items</h4>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Ordered
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Received
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedPO.items?.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.product?.name}
                            {item.variant && (
                              <span className="text-gray-500">
                                {" "}
                                - {item.variant.name}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-gray-900">
                            {item.receivedQuantity}
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-gray-900">
                            {formatCurrency(item.unitCost, settings)}
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                            {formatCurrency(item.totalCost, settings)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td
                          colSpan={4}
                          className="px-4 py-2 text-right text-sm font-semibold text-gray-900"
                        >
                          Total Amount:
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-bold text-gray-900">
                          {formatCurrency(selectedPO.totalAmount, settings)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3 border-t pt-4">
                {selectedPO.status === "PENDING" && (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditPO(selectedPO);
                    }}
                    className="rounded-lg bg-indigo-600 px-6 py-2 text-white transition hover:bg-indigo-700"
                  >
                    Edit Order
                  </button>
                )}
                {(selectedPO.status === "PENDING" ||
                  selectedPO.status === "PARTIAL") && (
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleReceivePO(selectedPO);
                    }}
                    className="rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
                  >
                    Receive Items
                  </button>
                )}
                {selectedPO.status !== "RECEIVED" &&
                  selectedPO.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancelPO(selectedPO.id)}
                      className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  )}
                <button
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-6 py-2 transition hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Items Modal */}
      {selectedPO && selectedPO.items && (
        <ReceiveItemsModal
          isOpen={showReceiveModal}
          onClose={() => setShowReceiveModal(false)}
          purchaseOrder={selectedPO as any}
          onReceive={handleReceiveItems}
        />
      )}

      {/* Edit PO Modal */}
      {selectedPO && selectedPO.items && (
        <EditPOModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          purchaseOrder={selectedPO as any}
          suppliers={suppliers}
          products={products}
          onUpdate={handleUpdatePO}
        />
      )}
    </div>
  );
};

export default PurchaseOrdersPage;
