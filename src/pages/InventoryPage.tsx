import React, { useState } from "react";
import toast from "react-hot-toast";
import { InventorySearch } from "../components/inventory/InventorySearch";
import { InventoryTable } from "../components/inventory/InventoryTable";
import { StockAdjustModal } from "../components/inventory/StockAdjustModal";
import { StockHistoryModal } from "../components/inventory/StockHistoryModal";
import {
  useInventoryReport,
  useStockMovements,
  useUpdateStock,
} from "../services/queries";
import { Product, ProductVariant } from "../types";

type AllowedMovementType =
  | "PURCHASE"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGED"
  | "EXPIRED";

const InventoryPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NAME_ASC");

  // React Query hooks
  const { data: report, isLoading } = useInventoryReport();
  const { data: stockMovementsData } = useStockMovements(selectedProduct?.id, {
    limit: 20,
  });
  const history = stockMovementsData?.movements || [];
  const updateStock = useUpdateStock();

  const handleAdjustStock = (product: Product, variant?: ProductVariant) => {
    setSelectedProduct(product);
    setSelectedVariant(variant || null);
    setShowAdjustModal(true);
  };

  const handleSubmitAdjustment = async (formData: {
    quantity: number;
    movementType: AllowedMovementType;
    reason: string;
  }) => {
    if (!selectedProduct) return;

    let { quantity, movementType, reason } = formData;

    if (!quantity || quantity === 0) {
      toast.error("Quantity must not be zero");
      return;
    }

    // Auto-adjust sign based on movement type
    if (movementType === "PURCHASE" || movementType === "RETURN") {
      quantity = Math.abs(quantity);
    } else if (movementType === "DAMAGED" || movementType === "EXPIRED") {
      quantity = -Math.abs(quantity);
    }
    // ADJUSTMENT: use as entered (positive or negative)

    try {
      await updateStock.mutateAsync({
        productId: selectedProduct.id,
        data: {
          productVariantId: selectedVariant?.id || undefined,
          quantity,
          movementType,
          reason,
        },
      });
      toast.success("Stock adjusted successfully");
      setShowAdjustModal(false);
      setSelectedVariant(null);
    } catch (e) {
      toast.error("Failed to adjust stock");
    }
  };

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  const categories = React.useMemo(() => {
    if (!report?.products) return [];
    const set = new Set<string>();
    report.products.forEach((p) => {
      if (p.category?.name) set.add(p.category.name);
    });
    return Array.from(set).sort();
  }, [report?.products]);

  const filteredAndSortedProducts = React.useMemo(() => {
    if (!report?.products) return [];

    // 1. Search filter
    let result = report.products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()),
    );

    // 2. Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((p) => {
        if (statusFilter === "OUT_OF_STOCK") {
          return p.stockQuantity <= 0;
        } else if (statusFilter === "LOW_STOCK") {
          return p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
        } else if (statusFilter === "IN_STOCK") {
          return p.stockQuantity > p.lowStockThreshold;
        }
        return true;
      });
    }

    // 3. Category filter
    if (categoryFilter !== "ALL") {
      result = result.filter((p) => p.category?.name === categoryFilter);
    }

    // 4. Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "NAME_ASC") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "NAME_DESC") {
        return b.name.localeCompare(a.name);
      } else if (sortBy === "STOCK_ASC") {
        return a.stockQuantity - b.stockQuantity;
      } else if (sortBy === "STOCK_DESC") {
        return b.stockQuantity - a.stockQuantity;
      }
      return 0;
    });

    return result;
  }, [report?.products, search, statusFilter, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Inventory Management</h1>

        <InventorySearch
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          categories={categories}
          report={report || null}
        />

        <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
          <InventoryTable
            products={filteredAndSortedProducts}
            isLoading={isLoading}
            onAdjustStock={handleAdjustStock}
            onViewHistory={handleViewHistory}
          />
        </div>

        {/* Modals */}
        <StockAdjustModal
          isOpen={showAdjustModal}
          product={selectedProduct}
          variant={selectedVariant}
          onClose={() => {
            setShowAdjustModal(false);
            setSelectedVariant(null);
          }}
          onSubmit={handleSubmitAdjustment}
          loading={updateStock.isPending}
        />

        <StockHistoryModal
          isOpen={showHistoryModal}
          product={selectedProduct}
          history={history}
          onClose={() => setShowHistoryModal(false)}
        />
      </div>
    </div>
  );
};

export default InventoryPage;
