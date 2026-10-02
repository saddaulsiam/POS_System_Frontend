import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common";
import { Input } from "../components/common/Input";
import {
  useCategories,
  useBrands,
  useCreateProduct,
  useProductImageUpload,
  useSuppliers,
} from "../services/queries";

const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    barcode: "",
    categoryId: "",
    brandId: "",
    supplierId: "",
    purchasePrice: "",
    sellingPrice: "",
    stockQuantity: "",
    lowStockThreshold: "10",
    isActive: true,
    isWeighted: false,
    unit: "kg",
    taxRate: "0",
    discountType: "NONE",
    discountValue: "0",
  });

  // React Query hooks
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: suppliersData } = useSuppliers({ limit: 1000 });
  const suppliers = suppliersData?.data || [];

  const createProduct = useCreateProduct();
  const uploadImage = useProductImageUpload();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        barcode: form.barcode || undefined,
        categoryId: parseInt(form.categoryId),
        brandId: form.brandId ? parseInt(form.brandId) : undefined,
        supplierId: form.supplierId ? parseInt(form.supplierId) : undefined,
        purchasePrice: parseFloat(form.purchasePrice),
        sellingPrice: parseFloat(form.sellingPrice),
        stockQuantity: parseFloat(form.stockQuantity),
        lowStockThreshold: parseInt(form.lowStockThreshold),
        isActive: form.isActive,
        isWeighted: form.isWeighted,
        unit: form.isWeighted ? form.unit : undefined,
        taxRate: parseFloat(form.taxRate),
        discountType: form.discountType || "NONE",
        discountValue: parseFloat(form.discountValue) || 0,
      };

      if (payload.discountType !== "NONE" && payload.discountValue > 0) {
        const maxDiscount = Math.max(0, payload.sellingPrice - payload.purchasePrice);
        if (payload.discountType === "FIXED" && payload.discountValue > maxDiscount) {
          toast.error(`Discount cannot exceed ${maxDiscount} to protect buy price (${payload.purchasePrice})`);
          return;
        }
        if (payload.discountType === "PERCENTAGE") {
          const maxPercent = payload.sellingPrice > 0 ? ((payload.sellingPrice - payload.purchasePrice) / payload.sellingPrice) * 100 : 0;
          if (payload.discountValue > maxPercent) {
            toast.error(`Discount percentage cannot exceed ${maxPercent.toFixed(1)}% to protect buy price (${payload.purchasePrice})`);
            return;
          }
        }
      }

      const product = await createProduct.mutateAsync(payload);

      // Upload image if selected
      if (imageFile && product.id) {
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
          await uploadImage.mutateAsync({ id: product.id, formData });
        } catch (error) {
          toast.error("Product created but image upload failed");
        }
      }

      toast.success("Product added successfully");
      navigate("/products");
    } catch (error: any) {
      // Error already handled by mutation
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
      <form onSubmit={handleAddProduct}>
        {/* Header Section */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <nav className="mb-1 text-sm text-gray-500">
              <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate("/products")}>Products</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Add New Product</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/products")}
              disabled={createProduct.isPending || uploadImage.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createProduct.isPending || uploadImage.isPending}
            >
              {createProduct.isPending || uploadImage.isPending
                ? "Saving..."
                : "Save Product"}
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left Column (General, Pricing, Inventory) */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* General Information Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">General Information</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    placeholder="e.g. Coca Cola 500ml"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="sku"
                    value={form.sku}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    placeholder="e.g. CC500ML"
                  />
                  <p className="mt-1 text-xs text-gray-500">Unique identifier for the product.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Barcode
                  </label>
                  <Input
                    name="barcode"
                    value={form.barcode}
                    onChange={handleFormChange}
                    fullWidth
                    placeholder="Scan or type barcode"
                  />
                  <p className="mt-1 text-xs text-gray-500">Leave blank to auto-generate from SKU.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Brand</label>
                  <select
                    name="brandId"
                    value={form.brandId}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select brand (optional)</option>
                    {brands.map((brand: any) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Supplier</label>
                  <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select supplier (optional)</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Pricing</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Cost Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <Input
                      name="purchasePrice"
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.purchasePrice}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <Input
                      name="sellingPrice"
                      type="number"
                      min={0}
                      step={0.01}
                      value={form.sellingPrice}
                      onChange={handleFormChange}
                      required
                      fullWidth
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Tax Rate (%)
                  </label>
                  <div className="relative">
                    <Input
                      name="taxRate"
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={form.taxRate}
                      onChange={handleFormChange}
                      fullWidth
                      className="pr-8"
                      placeholder="0.00"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="NONE">No Discount</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                {form.discountType !== "NONE" && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Discount Value
                    </label>
                    <div className="relative">
                      {form.discountType === "FIXED" && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>}
                      <Input
                        name="discountValue"
                        type="number"
                        min={0}
                        step={0.01}
                        value={form.discountValue}
                        onChange={handleFormChange}
                        fullWidth
                        className={form.discountType === "FIXED" ? "pl-7" : "pr-8"}
                        placeholder="0.00"
                      />
                      {form.discountType === "PERCENTAGE" && <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">%</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Inventory</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Initial Stock <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="stockQuantity"
                    type="number"
                    min={0}
                    step={1}
                    value={form.stockQuantity}
                    onChange={handleFormChange}
                    required
                    fullWidth
                    placeholder="e.g. 100"
                  />
                  <p className="mt-1 text-xs text-gray-500">Current available quantity.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Low Stock Threshold
                  </label>
                  <Input
                    name="lowStockThreshold"
                    type="number"
                    min={0}
                    step={1}
                    value={form.lowStockThreshold}
                    onChange={handleFormChange}
                    fullWidth
                    placeholder="e.g. 10"
                  />
                  <p className="mt-1 text-xs text-gray-500">Alert threshold for reordering.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Image, Settings) */}
          <div className="flex flex-col gap-6 lg:col-span-1">

            {/* Product Image Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Product Image</h2>
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${imagePreview ? "border-transparent bg-gray-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full rounded-lg object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg className="mb-2 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Click to upload image</span>
                      <span className="mt-1 text-xs">JPEG, PNG up to 5MB</span>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-4 w-full"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                  >
                    Remove Image
                  </Button>
                )}
              </div>
            </div>

            {/* Product Settings Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Settings</h2>

              <div className="flex flex-col gap-4">
                {/* Active Toggle */}
                <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Active Status</h3>
                    <p className="text-xs text-gray-500">Product will be visible in POS.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      name="isActive"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={handleFormChange}
                      className="peer sr-only"
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                  </label>
                </div>

                {/* Weighted Toggle */}
                <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Weighted Product</h3>
                      <p className="text-xs text-gray-500">Sold by weight.</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        name="isWeighted"
                        type="checkbox"
                        checked={form.isWeighted}
                        onChange={handleFormChange}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                    </label>
                  </div>
                  
                  {/* Unit Selection (Visible only if isWeighted is true) */}
                  {form.isWeighted && (
                    <div className="mt-2 border-t border-gray-200 pt-3">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">
                        Weight Unit <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="unit"
                        value={form.unit}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="lb">Pound (lb)</option>
                        <option value="oz">Ounce (oz)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;
