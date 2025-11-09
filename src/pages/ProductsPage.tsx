import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ExcelImportDialog } from "../components/products/ExcelImportDialog";
import { ProductActions } from "../components/products/ProductActions";
import { ProductFilters } from "../components/products/ProductFilters";
import { ProductModals } from "../components/products/ProductModals";
import { ProductTable } from "../components/products/ProductTable";
import { QuickSaleManager } from "../components/products/QuickSaleManager";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { productsAPI } from "../services";
import { useCategories, useSuppliers } from "../services/queries/commonQueries";
import {
  useCreateProduct,
  useDeleteProduct,
  useProductImageUpload,
  useProducts,
  useUpdateProduct,
} from "../services/queries/productsQueries";
import { Product } from "../types";
import { printBarcodeLabel } from "../utils/productUtils";

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const canWrite = user?.role === "ADMIN" || user?.role === "MANAGER";

  // Show deleted toggle (must be inside component)
  const [showDeleted, setShowDeleted] = useState(false);

  // Use React Query for products, categories and suppliers
  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useProducts({ page: 1, limit: 50, showDeleted });
  const products = productsResponse?.data || [];
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse || [];
  const { data: suppliersResponse } = useSuppliers({ limit: 1000 });
  const suppliers = suppliersResponse?.data || [];
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const uploadImageMut = useProductImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showImportExcelModal, setShowImportExcelModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);

  // Form and file states
  const [printProduct, setPrintProduct] = useState<Product | null>(null);
  const [quickSaleProduct, setQuickSaleProduct] = useState<Product | null>(
    null,
  );
  const [printCopies, setPrintCopies] = useState(1);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    categoryId: "",
    supplierId: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    lowStockThreshold: "10",
    isActive: true,
    isWeighted: false,
    taxRate: "0",
    image: "",
  });

  // Filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // React Query handles loading and caching; when `showDeleted` changes we refetch
  useEffect(() => {
    refetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDeleted]);
  // Restore deleted product
  const handleRestoreProduct = async (product: Product) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: { isDeleted: false, isActive: true },
      });
      toast.success("Product restored");
      refetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to restore product");
    }
  };

  // categories and suppliers are provided by React Query hooks above

  // Form handlers
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      categoryId: "",
      supplierId: "",
      purchasePrice: "",
      sellingPrice: "",
      stockQuantity: "",
      lowStockThreshold: "10",
      isActive: true,
      isWeighted: false,
      taxRate: "0",
      image: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  // Product CRUD operations
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        categoryId: parseInt(form.categoryId),
        supplierId: form.supplierId ? parseInt(form.supplierId) : undefined,
        purchasePrice: parseFloat(form.purchasePrice),
        sellingPrice: parseFloat(form.sellingPrice),
        stockQuantity: parseFloat(form.stockQuantity),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        isActive: form.isActive,
        isWeighted: form.isWeighted,
        taxRate: parseFloat(form.taxRate),
      };
      const product = await createProduct.mutateAsync(payload);

      // Upload image if selected
      if (imageFile && product.id) {
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
          await uploadImageMut.mutateAsync({ id: product.id, formData });
        } catch (error) {
          toast.error("Product created but image upload failed");
        }
      }

      toast.success("Product added successfully");
      resetForm();
      setShowAddModal(false);
      refetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        categoryId: parseInt(form.categoryId),
        supplierId: form.supplierId ? parseInt(form.supplierId) : undefined,
        purchasePrice: parseFloat(form.purchasePrice),
        sellingPrice: parseFloat(form.sellingPrice),
        stockQuantity: parseFloat(form.stockQuantity),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        isActive: form.isActive,
        isWeighted: form.isWeighted,
        taxRate: parseFloat(form.taxRate),
      };
      await updateProduct.mutateAsync({ id: editProduct.id, data: payload });

      // Upload image if selected
      if (imageFile && editProduct.id) {
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
          await uploadImageMut.mutateAsync({ id: editProduct.id, formData });
        } catch (error) {
          toast.error("Product updated but image upload failed");
        }
      }

      toast.success("Product updated successfully");
      setShowEditModal(false);
      setEditProduct(null);
      setImageFile(null);
      setImagePreview("");
      refetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    if (deletingId === null) return;
    try {
      await deleteProduct.mutateAsync(deletingId);
      toast.success("Product deleted successfully");
      refetchProducts();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to delete product");
    } finally {
      setShowDeleteConfirm(false);
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        data: { isActive: !product.isActive },
      });
      toast.success(
        `Product ${!product.isActive ? "activated" : "deactivated"} successfully`,
      );
      refetchProducts();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to update product status",
      );
    }
  };

  const handleQuickSale = (product: Product) => {
    setQuickSaleProduct(product);
    setShowQuickSaleModal(true);
  };

  const handleQuickSaleSuccess = () => {
    toast.success("Quick Sale updated successfully");
  };

  // Import/Export operations
  const handleExportCSV = async () => {
    try {
      const blob = await productsAPI.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `products_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Products exported successfully");
    } catch (error: any) {
      toast.error("Failed to export products");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await productsAPI.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products_import_template.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error("Failed to download template");
    }
  };

  const handleImportCSV = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    setIsImporting(true);
    try {
      const result = await productsAPI.importCSV(importFile);

      if (result.invalid && result.invalid.length > 0) {
        const errorMessage = `Imported ${result.imported} products. ${result.skipped} rows had errors.`;
        toast.success(errorMessage);
        console.warn("Import validation errors:", result.invalid);
      } else {
        toast.success(`Successfully imported ${result.imported} products`);
      }

      setShowImportModal(false);
      setImportFile(null);
      refetchProducts();
    } catch (error: any) {
      const errorData = error?.response?.data;
      if (errorData?.existingSkus) {
        toast.error(
          `Some SKUs already exist: ${errorData.existingSkus.join(", ")}`,
        );
      } else if (errorData?.invalidCategoryIds) {
        toast.error(
          `Invalid category IDs: ${errorData.invalidCategoryIds.join(", ")}`,
        );
      } else if (errorData?.invalidSupplierIds) {
        toast.error(
          `Invalid supplier IDs: ${errorData.invalidSupplierIds.join(", ")}`,
        );
      } else if (errorData?.duplicates) {
        toast.error(
          `Duplicate SKUs in file: ${errorData.duplicates.join(", ")}`,
        );
      } else {
        toast.error(errorData?.error || "Failed to import products");
      }
    } finally {
      setIsImporting(false);
    }
  };

  // Excel Export/Import handlers
  const handleExportExcel = async () => {
    try {
      const blob = await productsAPI.exportExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `products_export_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Products exported to Excel successfully");
    } catch (error: any) {
      toast.error("Failed to export products to Excel");
    }
  };

  // Edit modal handler
  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId.toString(),
      supplierId: product.supplierId?.toString() || "",
      purchasePrice: product.purchasePrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stockQuantity: product.stockQuantity.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      isActive: product.isActive,
      isWeighted: product.isWeighted,
      taxRate: product.taxRate.toString(),
      image: product.image || "",
    });
    setImagePreview(product.image || "");
    setShowEditModal(true);
  };

  // Print modal handler
  const handlePrintClick = (product: Product) => {
    setPrintProduct(product);
    setPrintCopies(1);
    setShowPrintModal(true);
  };

  // Filter and sort products
  let filteredProducts = products.filter((p) => {
    // If showDeleted is false, hide deleted products
    if (!showDeleted && p.isDeleted) return false;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? p.categoryId === parseInt(categoryFilter)
      : true;
    return matchesSearch && matchesCategory;
  });
  // If showing deleted, sort so deleted products are on top
  if (showDeleted) {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      if (a.isDeleted === b.isDeleted) return 0;
      return a.isDeleted ? -1 : 1;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Products Management</h1>

        {/* Search, Filter, and Actions */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ProductFilters
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
          />
          <ProductActions
            canWrite={canWrite}
            onExport={handleExportCSV}
            onExportExcel={handleExportExcel}
            onImport={() => setShowImportModal(true)}
            onImportExcel={() => setShowImportExcelModal(true)}
            onAddNew={() => setShowAddModal(true)}
          />
        </div>

        {/* Products Table */}
        <div className="mb-2 flex items-center gap-4">
          <label className="flex items-center text-sm font-medium">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={() => setShowDeleted((prev) => !prev)}
              className="mr-2"
            />
            Show Deleted Products
          </label>
        </div>
        <ProductTable
          products={filteredProducts}
          categories={categories}
          suppliers={suppliers}
          isLoading={isProductsLoading}
          canWrite={canWrite}
          deletingId={deletingId}
          onPrint={handlePrintClick}
          onEdit={handleEditClick}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteProduct}
          onAddNew={() => setShowAddModal(true)}
          onQuickSale={settings?.enableQuickSale ? handleQuickSale : undefined}
          onRestore={handleRestoreProduct}
        />

        {/* All Modals */}
        <ProductModals
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          form={form}
          handleFormChange={handleFormChange}
          handleAddProduct={handleAddProduct}
          isSubmitting={isSubmitting}
          categories={categories}
          suppliers={suppliers}
          imageFile={imageFile}
          setImageFile={setImageFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          handleUpdateProduct={handleUpdateProduct}
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          deletingId={deletingId}
          setDeletingId={setDeletingId}
          confirmDeleteProduct={confirmDeleteProduct}
          showPrintModal={showPrintModal}
          setShowPrintModal={setShowPrintModal}
          printProduct={printProduct}
          setPrintProduct={setPrintProduct}
          printCopies={printCopies}
          setPrintCopies={setPrintCopies}
          printBarcodeLabel={printBarcodeLabel}
          showImportModal={showImportModal}
          setShowImportModal={setShowImportModal}
          importFile={importFile}
          setImportFile={setImportFile}
          isImporting={isImporting}
          handleImportCSV={handleImportCSV}
          handleDownloadTemplate={handleDownloadTemplate}
        />

        {/* Excel Import Modal */}
        <ExcelImportDialog
          isOpen={showImportExcelModal}
          onClose={() => setShowImportExcelModal(false)}
          onSuccess={() => refetchProducts()}
        />

        <QuickSaleManager
          isOpen={showQuickSaleModal}
          onClose={() => {
            setShowQuickSaleModal(false);
            setQuickSaleProduct(null);
          }}
          product={quickSaleProduct}
          onSuccess={() => {
            handleQuickSaleSuccess();
            setShowQuickSaleModal(false);
            setQuickSaleProduct(null);
          }}
        />
      </div>
    </div>
  );
};

export default ProductsPage;
