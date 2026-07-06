import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Badge, Modal, SkeletonTableRow } from "../../components/common";
import { Pagination } from "../../components/sales/Pagination";
import { Search, Filter, RefreshCw, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AdminStore } from "../../services/api/adminAPI";
import {
  useAdminStores,
  useDeleteStore,
  useImpersonateStore,
  useResetOwnerPin,
  useToggleStoreStatus,
  useUpdateSubscription,
  useAdminStats,
} from "../../services/queries/adminQueries";

const SuperAdminStores: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [dateJoined, setDateJoined] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPlanFilter("");
    setSortBy("");
    setDateJoined("");
    setPage(1);
  };

  const { setUser } = useAuth();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const [selectedStore, setSelectedStore] = useState<AdminStore | null>(null);
  const [newPin, setNewPin] = useState("");

  // Subscription Form State
  const [subStatus, setSubStatus] = useState("");
  const [subPlan, setSubPlan] = useState("");
  const [subEndDate, setSubEndDate] = useState("");
  const [subGracePeriod, setSubGracePeriod] = useState(0);

  const { data: statsData } = useAdminStats();
  const stats = statsData?.stats || {
    totalStores: 0,
    activeSubs: 0,
    trialSubs: 0,
    expiredSubs: 0,
  };

  const { data, isLoading, error, isFetching, refetch } = useAdminStores({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    plan: planFilter || undefined,
    sortBy: sortBy || undefined,
    dateJoined: dateJoined || undefined,
  });

  const toggleStatus = useToggleStoreStatus();
  const resetPinMutation = useResetOwnerPin();
  const updateSubMutation = useUpdateSubscription();
  const impersonateMutation = useImpersonateStore();
  const deleteMutation = useDeleteStore();

  const handleImpersonate = async (storeId: number) => {
    try {
      const response = await impersonateMutation.mutateAsync(storeId);

      // Save credentials to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Update Context
      setUser(response.user);

      toast.success(`Impersonation active: Logged in as ${response.user.name}`);
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Impersonation failed");
    }
  };

  const handleDeleteStore = async (storeId: number) => {
    if (!selectedStore) return;
    const confirm1 = window.confirm(
      "⚠️ WARNING: Are you sure you want to permanently delete this store?\n\nThis will purge all employees, sales transactions, products, and categories. This action CANNOT be undone.",
    );
    if (!confirm1) return;

    const confirm2 = window.prompt(
      `To confirm deletion, please type this store's name: "${selectedStore.name}"`,
    );
    if (confirm2 !== selectedStore.name) {
      toast.error("Store name did not match. Deletion cancelled.");
      return;
    }

    try {
      await deleteMutation.mutateAsync(storeId);
      toast.success("Store and all associated data purged successfully");
      setSelectedStore(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to purge store");
    }
  };

  const handleStatusToggle = async (id: number, currentActive: boolean) => {
    const action = currentActive ? "suspend" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this store?`)) {
      return;
    }

    try {
      await toggleStatus.mutateAsync({ id, isActive: !currentActive });
      toast.success(
        `Store ${currentActive ? "suspended" : "activated"} successfully`,
      );
      if (selectedStore && selectedStore.id === id) {
        setSelectedStore((prev) =>
          prev
            ? { ...prev, owner: { ...prev.owner, isActive: !currentActive } }
            : null,
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || `Failed to ${action} store`);
    }
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) return;
    if (newPin.length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }

    try {
      await resetPinMutation.mutateAsync({
        id: selectedStore.id,
        pinCode: newPin,
      });
      toast.success(`PIN reset successfully for ${selectedStore.owner.name}`);
      setNewPin("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to reset PIN");
    }
  };

  const handleUpdateSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) return;

    try {
      await updateSubMutation.mutateAsync({
        id: selectedStore.id,
        status: subStatus,
        plan: subPlan,
        endDate: subEndDate || null,
        gracePeriodDays: subGracePeriod,
      });
      toast.success("Subscription updated successfully");

      // Update local state metrics to match new values
      setSelectedStore((prev) =>
        prev
          ? {
              ...prev,
              subscription: prev.subscription
                ? {
                    ...prev.subscription,
                    status: subStatus,
                    subscriptionEndDate: subEndDate || null,
                    plan: subPlan,
                    gracePeriodDays: subGracePeriod,
                  }
                : {
                    status: subStatus,
                    trialEndDate: "",
                    subscriptionEndDate: subEndDate || null,
                    plan: subPlan,
                    gracePeriodDays: subGracePeriod,
                  },
            }
          : null,
      );
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update subscription");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page on new search
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-bold">Error</h3>
        <p>Failed to load store list. Please check your backend connection.</p>
      </div>
    );
  }

  const stores = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Store Tenants
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View registered store details, check active plans, and manage
            status.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tenants */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Tenants
            </span>
            <span className="text-3xs border-slate-200 rounded-full border bg-slate-50 px-2 py-0.5 font-bold text-slate-600">
              🏢 Stores
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {stats.totalStores}
            </span>
            <span className="text-xs text-slate-400">Registered</span>
          </div>
        </div>

        {/* Paid Tenants */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Paid Active
            </span>
            <span className="text-3xs border-green-150 rounded-full border bg-green-50 px-2 py-0.5 font-bold text-green-700">
              🟢 Paid
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {stats.activeSubs}
            </span>
            <span className="text-xs text-slate-400">Stores</span>
          </div>
        </div>

        {/* Trial Tenants */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Trial Mode
            </span>
            <span className="text-3xs border-indigo-150 rounded-full border bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">
              🧪 Testing
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {stats.trialSubs}
            </span>
            <span className="text-xs text-slate-400">Stores</span>
          </div>
        </div>

        {/* Expired Tenants */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Expired
            </span>
            <span className="text-3xs border-red-150 rounded-full border bg-red-50 px-2 py-0.5 font-bold text-red-700">
              🔴 Inactive
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {stats.expiredSubs}
            </span>
            <span className="text-xs text-slate-400">Stores</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by store name, owner, or email..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-slate-50 py-2 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="TRIAL">Trial Mode</option>
              <option value="ACTIVE">Active / Paid</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="SUSPENDED">Suspended (Deactivated)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <select
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-slate-50 py-2 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Plans</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              <option value="LIFETIME">Lifetime</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Date Joined Filter */}
          <div className="relative">
            <select
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-slate-50 py-2 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={dateJoined}
              onChange={(e) => {
                setDateJoined(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Time</option>
              <option value="7days">Joined Last 7 Days</option>
              <option value="30days">Joined Last 30 Days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-slate-50 py-2 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Sort By: Newest</option>
              <option value="oldest">Sort By: Oldest</option>
              <option value="name_asc">Name: A-Z</option>
              <option value="name_desc">Name: Z-A</option>
              <option value="sales_desc">Most Checkouts</option>
              <option value="products_desc">Largest Catalog</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-red-500 hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            title="Clear Filters"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Refresh button */}
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-slate-50 p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stores Directory Grid */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Store</th>
                <th className="px-6 py-4 font-semibold">Owner</th>
                <th className="px-6 py-4 font-semibold">Plan Details</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Active Status</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {isLoading || isFetching ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={index} columns={6} />
                ))
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No store tenants found matching your search.
                  </td>
                </tr>
              ) : (
                stores.map((store) => {
                  const isStoreActive = store.owner.isActive;
                  const subscriptionStatus =
                    store.subscription?.status || "NO SUBSCRIPTION";
                  return (
                    <tr
                      key={store.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{store.name}</p>
                        <p className="text-xs text-gray-400">ID #{store.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {store.owner.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          @{store.owner.username}
                        </p>
                        {store.owner.email && (
                          <p className="text-xs font-semibold text-indigo-600">
                            {store.owner.email}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-x-0.5">
                          <Badge
                            variant={
                              subscriptionStatus === "ACTIVE"
                                ? "success"
                                : subscriptionStatus === "TRIAL"
                                  ? "info"
                                  : "danger"
                            }
                            rounded
                            size="sm"
                          >
                            {subscriptionStatus === "ACTIVE"
                              ? " Paid Active"
                              : subscriptionStatus === "TRIAL"
                                ? " Trial Mode"
                                : ` ${subscriptionStatus}`}
                          </Badge>
                          {store.subscription?.plan && (
                            <Badge
                              variant="default"
                              rounded
                              size="sm"
                              className="uppercase"
                            >
                              {store.subscription.plan}
                            </Badge>
                          )}
                          {store.subscription?.status === "TRIAL" && (
                            <p className="mt-1 text-xs font-semibold text-indigo-600">
                              Trial ends in{" "}
                              {Math.max(
                                0,
                                Math.ceil(
                                  (new Date(
                                    store.subscription.trialEndDate,
                                  ).getTime() -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24),
                                ),
                              )}{" "}
                              days
                            </p>
                          )}
                          {store.subscription?.status === "ACTIVE" &&
                            store.subscription?.subscriptionEndDate && (
                              <p className="mt-1 text-xs font-semibold text-slate-400">
                                Cycle Ends •{" "}
                                {new Date(
                                  store.subscription.subscriptionEndDate,
                                ).toLocaleDateString()}
                              </p>
                            )}
                          {store.subscription?.status === "ACTIVE" &&
                            !store.subscription?.subscriptionEndDate && (
                              <p className="mt-1 text-xs font-semibold text-green-600">
                                Lifetime Active
                              </p>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(store.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={isStoreActive ? "success" : "danger"}
                          rounded
                          size="sm"
                        >
                          {isStoreActive ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedStore(store);
                            setNewPin("");
                            setSubStatus(store.subscription?.status || "TRIAL");
                            setSubPlan(store.subscription?.plan || "MONTHLY");
                            setSubEndDate(
                              store.subscription?.subscriptionEndDate
                                ? new Date(
                                    store.subscription.subscriptionEndDate,
                                  )
                                    .toISOString()
                                    .split("T")[0]
                                : "",
                            );
                            setSubGracePeriod(
                              store.subscription?.gracePeriodDays || 0,
                            );
                          }}
                          className="mr-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100"
                        >
                          👁️ View Details
                        </button>
                        <button
                          onClick={() =>
                            handleStatusToggle(store.id, isStoreActive)
                          }
                          disabled={toggleStatus.isPending}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm transition-all ${
                            isStoreActive
                              ? "bg-red-50 text-red-700 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {isStoreActive ? "⛔ Suspend" : "✅ Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="border-gray-150 border-t p-4">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Details & Management Overlay Modal */}
      <Modal
        isOpen={selectedStore !== null}
        onClose={() => setSelectedStore(null)}
        title={selectedStore ? `Store Console: ${selectedStore.name}` : ""}
        size="4xl"
      >
        {selectedStore && (
          <div className="space-y-6">
            {/* Modal Subheader */}
            <p className="-mt-2 text-xs text-gray-500">
              Registered Date:{" "}
              {new Date(selectedStore.createdAt).toLocaleString()} | Store ID #
              {selectedStore.id}
            </p>

            {/* Metrics Dashboard */}
            <div className="mt-6">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Performance Metrics
              </h4>
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 text-center shadow-inner">
                  <p className="text-2xs font-semibold uppercase text-indigo-500">
                    Gross Sales
                  </p>
                  <p className="mt-1 text-lg font-bold text-indigo-900">
                    {formatMoney(selectedStore.metrics?.revenue || 0)}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 text-center shadow-inner">
                  <p className="text-2xs font-semibold uppercase text-indigo-500">
                    Checkouts
                  </p>
                  <p className="mt-1 text-lg font-bold text-indigo-900">
                    {selectedStore.metrics?.salesCount || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 text-center shadow-inner">
                  <p className="text-2xs font-semibold uppercase text-indigo-500">
                    Products Size
                  </p>
                  <p className="mt-1 text-lg font-bold text-indigo-900">
                    {selectedStore.metrics?.productCount || 0}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-4 text-center shadow-inner">
                  <p className="text-2xs font-semibold uppercase text-indigo-500">
                    Staff Size
                  </p>
                  <p className="mt-1 text-lg font-bold text-indigo-900">
                    {selectedStore.metrics?.employeeCount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Inner Content Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
              {/* Left Column: Owner & Security */}
              <div className="space-y-6">
                {/* Store Profile */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                    🏢 Store Profile
                  </h4>
                  <div className="mt-3 space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-400">
                        Store Name:
                      </span>{" "}
                      <span className="font-bold text-slate-800">
                        {selectedStore.name}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        Store ID:
                      </span>{" "}
                      <span className="font-mono text-slate-800">
                        #{selectedStore.id}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        Registered Date:
                      </span>{" "}
                      <span className="font-medium text-slate-800">
                        {new Date(selectedStore.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        Active Status:
                      </span>{" "}
                      <Badge
                        variant={
                          selectedStore.owner.isActive ? "success" : "danger"
                        }
                        rounded
                        size="sm"
                      >
                        {selectedStore.owner.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </p>
                  </div>
                </div>

                {/* SaaS Subscription Info */}
                <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <h4 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                    🔁 SaaS Plan Details
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-2xs mb-1 block font-bold uppercase tracking-wider text-gray-400">
                        Plan Level
                      </span>
                      <span className="rounded border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase text-indigo-700">
                        {selectedStore.subscription?.plan || "TRIAL"}
                      </span>
                    </div>
                    <div>
                      <span className="text-2xs mb-1 block font-bold uppercase tracking-wider text-gray-400">
                        Grace Period
                      </span>
                      <span className="border-slate-150 block rounded border bg-slate-50 px-2.5 py-1 text-center text-xs font-bold text-slate-800">
                        {selectedStore.subscription?.gracePeriodDays || 0} days
                        buffer
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-2xs mb-1 block font-bold uppercase tracking-wider text-gray-400">
                        {selectedStore.subscription?.status === "TRIAL"
                          ? "Trial Ends On"
                          : "Billing Cycle Ends"}
                      </span>
                      <span className="text-slate-850 border-slate-150 block rounded border bg-slate-50 px-2.5 py-1 text-center text-xs font-bold">
                        {selectedStore.subscription?.status === "TRIAL"
                          ? new Date(
                              selectedStore.subscription.trialEndDate,
                            ).toLocaleDateString()
                          : selectedStore.subscription?.subscriptionEndDate
                            ? new Date(
                                selectedStore.subscription.subscriptionEndDate,
                              ).toLocaleDateString()
                            : "Lifetime Access"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reset Master PIN */}
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">
                    🔑 Reset Master Login PIN
                  </h4>
                  <p className="text-2xs mt-1 text-gray-500">
                    Reset this store owner's master login PIN directly. Minimum
                    4 digits.
                  </p>
                  <form
                    onSubmit={handleResetPinSubmit}
                    className="mt-3 flex gap-2"
                  >
                    <input
                      type="text"
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="New PIN (e.g. 1234)"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={resetPinMutation.isPending}
                      className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      Reset PIN
                    </button>
                  </form>
                </div>

                {/* Danger Zone: Purge Store */}
                <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-700">
                    ⚠️ Danger Zone
                  </h4>
                  <p className="text-2xs mt-1 text-gray-500">
                    Permanently delete this store and all associated sales
                    transactions, products, and employees.
                  </p>
                  <div className="mt-3">
                    <button
                      onClick={() => handleDeleteStore(selectedStore.id)}
                      disabled={deleteMutation.isPending}
                      className="w-full rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      🗑️ Purge Store Data
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Owner & SaaS Subscription Settings */}
              <div className="space-y-6">
                {/* Owner Profile */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                      👤 Owner Profile
                    </h4>
                    <button
                      onClick={() => handleImpersonate(selectedStore.id)}
                      disabled={impersonateMutation.isPending}
                      className="gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100"
                    >
                      👤 Login As Owner
                    </button>
                  </div>

                  <div className="mt-3 space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-400">
                        Full Name:
                      </span>{" "}
                      {selectedStore.owner.name}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        Username:
                      </span>{" "}
                      @{selectedStore.owner.username}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        Email:
                      </span>{" "}
                      {selectedStore.owner.email || "No email"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-400">
                        Phone:
                      </span>{" "}
                      {selectedStore.owner.phone || "No phone"}
                    </p>
                  </div>
                </div>

                {/* SaaS Subscription Override */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <h4 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-slate-800">
                    🔁 Subscription Settings
                  </h4>
                  <p className="text-2xs mt-1 text-gray-500">
                    Manually adjust subscription levels and date lifecycles.
                  </p>

                  <form
                    onSubmit={handleUpdateSubSubmit}
                    className="mt-4 space-y-4"
                  >
                    {/* Status Toggle */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600">
                        Subscription Status
                      </label>
                      <select
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                        value={subStatus}
                        onChange={(e) => setSubStatus(e.target.value)}
                      >
                        <option value="TRIAL">Trial Mode</option>
                        <option value="ACTIVE">Active / Paid</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>

                    {/* Plan Selection */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600">
                        Plan Type
                      </label>
                      <select
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                        value={subPlan}
                        onChange={(e) => setSubPlan(e.target.value)}
                      >
                        <option value="MONTHLY">Monthly Billing</option>
                        <option value="YEARLY">Yearly Billing</option>
                        <option value="LIFETIME">Lifetime Billing</option>
                      </select>
                    </div>

                    {/* End Date Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600">
                        Expiration Date (Optional)
                      </label>
                      <input
                        type="date"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                        value={subEndDate}
                        onChange={(e) => setSubEndDate(e.target.value)}
                      />
                    </div>

                    {/* Grace Period Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600">
                        Grace Period (Days)
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                        value={subGracePeriod}
                        onChange={(e) =>
                          setSubGracePeriod(parseInt(e.target.value) || 0)
                        }
                      />
                    </div>

                    {/* Submit Override */}
                    <div className="pt-2 text-right">
                      <button
                        type="submit"
                        disabled={updateSubMutation.isPending}
                        className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Save Override
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SuperAdminStores;
