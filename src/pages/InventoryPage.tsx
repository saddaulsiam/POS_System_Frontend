import React, { useState } from "react";
import { Product } from "../types";
import toast from "react-hot-toast";
import { InventorySearch } from "../components/inventory/InventorySearch";
import { InventoryTable } from "../components/inventory/InventoryTable";
import { StockAdjustModal } from "../components/inventory/StockAdjustModal";
import { StockHistoryModal } from "../components/inventory/StockHistoryModal";
import { useInventoryReport } from "../services/queries/reportsQueries";
import {
  useStockMovements,
  useUpdateStock,
} from "../services/queries/inventoryQueries";

type AllowedMovementType =
  | "PURCHASE"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGED"
  | "EXPIRED";

const InventoryPage: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [search, setSearch] = useState("");

  // React Query hooks
  const { data: report, isLoading } = useInventoryReport();
  const { data: stockMovementsData } = useStockMovements(selectedProduct?.id, {
    limit: 20,
  });
  const history = stockMovementsData?.movements || [];
  const updateStock = useUpdateStock();

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
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
        data: { quantity, movementType, reason },
      });
      toast.success("Stock adjusted successfully");
      setShowAdjustModal(false);
    } catch (e) {
      toast.error("Failed to adjust stock");
    }
  };

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product);
    setShowHistoryModal(true);
  };

  const filteredProducts =
    report?.products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Inventory Management</h1>

        <InventorySearch
          search={search}
          onSearchChange={setSearch}
          report={report || null}
        />

        <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
          <InventoryTable
            products={filteredProducts}
            isLoading={isLoading}
            onAdjustStock={handleAdjustStock}
            onViewHistory={handleViewHistory}
          />
        </div>

        {/* Modals */}
        <StockAdjustModal
          isOpen={showAdjustModal}
          product={selectedProduct}
          onClose={() => setShowAdjustModal(false)}
          onSubmit={handleSubmitAdjustment}
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
