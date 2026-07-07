import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSettings } from "../../context/SettingsContext";
import { productVariantsAPI } from "../../services";
import {
  useDeleteProductVariant,
  useProductVariants,
  useUpdateProductVariant,
} from "../../services/queries";
import { Product, ProductVariant } from "../../types";
import { formatCurrency } from "../../utils/currencyUtils";
import type { BarcodeStickerTemplate } from "../../utils/productUtils";
import { printVariantBarcodeLabel } from "../../utils/productUtils";
import { Button, Modal, SkeletonProductVariants } from "../common";
import { ProductVariantModal } from "./ProductVariantModal";

interface ProductVariantListProps {
  product: Product;
}

export const ProductVariantList: React.FC<ProductVariantListProps> = ({
  product,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null,
  );
  const { settings } = useSettings();

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printVariant, setPrintVariant] = useState<ProductVariant | null>(null);
  const [printCopies, setPrintCopies] = useState(1);
  const [labelTemplate, setLabelTemplate] =
    useState<BarcodeStickerTemplate>("thermal-40x30");
  const [showProductName, setShowProductName] = useState(true);
  const [showSku, setShowSku] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showBarcodeText, setShowBarcodeText] = useState(false);
  const [barcodePreviewSrc, setBarcodePreviewSrc] = useState("");

  useEffect(() => {
    if (!showPrintModal) return;
    setLabelTemplate("thermal-40x30");
    setShowProductName(true);
    setShowSku(true);
    setShowPrice(true);
    setShowBarcodeText(false);
  }, [showPrintModal, printVariant]);

  useEffect(() => {
    if (!showPrintModal || !printVariant) {
      setBarcodePreviewSrc("");
      return;
    }

    let cancelled = false;
    const loadPreview = async () => {
      try {
        const dataUrl = await productVariantsAPI.getBarcodeImage(
          printVariant.id,
        );
        if (!cancelled) {
          setBarcodePreviewSrc(dataUrl);
        }
      } catch (err) {
        console.error("Failed to load variant barcode preview:", err);
      }
    };
    void loadPreview();

    return () => {
      cancelled = true;
    };
  }, [showPrintModal, printVariant]);

  // Fetch variants using React Query
  const { data: variantsResponse, isLoading: loading } = useProductVariants({
    productId: product.id,
  });
  const variants = Array.isArray(variantsResponse)
    ? variantsResponse
    : variantsResponse?.data || [];

  // Delete mutation
  const deleteVariant = useDeleteProductVariant();
  const updateVariant = useUpdateProductVariant();

  const handleToggleVariantStatus = async (variant: ProductVariant) => {
    try {
      await updateVariant.mutateAsync({
        id: variant.id,
        data: { isActive: !variant.isActive },
      });
      toast.success(
        `Variant ${!variant.isActive ? "activated" : "deactivated"} successfully`,
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Failed to update variant status",
      );
    }
  };

  const handleAddVariant = () => {
    setEditingVariant(null);
    setShowModal(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setShowModal(true);
  };

  const handleDeleteVariant = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    try {
      await deleteVariant.mutateAsync(id);
      toast.success("Variant deleted successfully");
    } catch (error: any) {
      console.error("Error deleting variant:", error);
      toast.error(error.response?.data?.error || "Failed to delete variant");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingVariant(null);
  };

  const handleSuccess = () => {
    // React Query will auto-refetch due to invalidation
  };

  if (loading) {
    return <SkeletonProductVariants />;
  }

  return (
    <div className="rounded-lg bg-white shadow">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Product Variants
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage different sizes, colors, or variations of this product
          </p>
        </div>
        {variants.length > 0 && (
          <Button
            variant="primary"
            onClick={handleAddVariant}
            className="flex items-center"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Variant
          </Button>
        )}
      </div>

      {/* Variants Table */}
      <div className="overflow-x-auto">
        {variants.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No variants
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new product variant.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                variant="primary"
                onClick={handleAddVariant}
                className="flex items-center"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Variant
              </Button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Variant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {variants.map((variant: ProductVariant) => (
                <tr key={variant.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {variant.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">{variant.sku}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {variant.barcode || "-"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(variant.purchasePrice, settings)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(variant.sellingPrice, settings)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margin:{" "}
                      {(
                        ((variant.sellingPrice - variant.purchasePrice) /
                          variant.sellingPrice) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div
                      className={`text-sm font-medium ${(variant.stockQuantity || 0) > 10
                        ? "text-green-600"
                        : (variant.stockQuantity || 0) > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                        }`}
                    >
                      {variant.stockQuantity || 0}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${variant.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {variant.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="space-x-3 whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => {
                        setPrintVariant(variant);
                        setShowPrintModal(true);
                      }}
                      className="rounded-lg p-2 text-purple-600 transition-colors hover:bg-purple-50"
                      title="Print Barcode"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditVariant(variant)}
                      className="rounded-lg p-2 text-indigo-600 transition-colors hover:bg-indigo-50"
                      title="Edit Variant"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleVariantStatus(variant)}
                      className={`rounded-lg p-2 transition-colors ${variant.isActive
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                      title={variant.isActive ? "Deactivate" : "Activate"}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {variant.isActive ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteVariant(variant.id)}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {variants.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold">{variants.length}</span> variant
              {variants.length !== 1 ? "s" : ""} •{" "}
              <span className="font-semibold">
                {variants.filter((v: ProductVariant) => v.isActive).length}
              </span>{" "}
              active
            </div>
            <div>
              Total Stock:{" "}
              <span className="font-semibold">
                {variants.reduce(
                  (sum: number, v: ProductVariant) =>
                    sum + (v.stockQuantity || 0),
                  0,
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <ProductVariantModal
        isOpen={showModal}
        onClose={handleModalClose}
        product={product}
        variant={editingVariant}
        onSuccess={handleSuccess}
      />

      {/* Print Barcode Modal */}
      {printVariant && (
        <Modal
          isOpen={showPrintModal}
          onClose={() => {
            setShowPrintModal(false);
            setPrintVariant(null);
            setPrintCopies(1);
          }}
          title={
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Variant Barcode Sticker Generator
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Design a printable barcode price sticker for variant:{" "}
                <strong>{product.name} - {printVariant.name}</strong>
              </p>
            </div>
          }
          size="3xl"
          footer={
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPrintModal(false);
                  setPrintVariant(null);
                  setPrintCopies(1);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const printOptions = {
                    template: labelTemplate,
                    showProductName,
                    showSku,
                    showPrice,
                    showBarcodeText,
                  };
                  printVariantBarcodeLabel({ ...printVariant, product }, printCopies, printOptions);
                  setShowPrintModal(false);
                  setPrintVariant(null);
                  setPrintCopies(1);
                }}
              >
                🖨️ Generate & Print
              </Button>
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Label Template
                  </label>
                  <select
                    value={labelTemplate}
                    onChange={(e) =>
                      setLabelTemplate(e.target.value as any)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="thermal-40x30">Thermal 40 x 30 mm</option>
                    <option value="thermal-50x30">Thermal 50 x 30 mm</option>
                    <option value="thermal-60x40">Thermal 60 x 40 mm</option>
                    <option value="a4-sheet-3x8">
                      A4 Sheet (3 x 8 labels)
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Labels
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={printCopies}
                    onChange={(e) =>
                      setPrintCopies(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quick Select
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPrintCopies(num)}
                      className={`rounded-lg border px-3 py-2 transition-all duration-150 ${printCopies === num
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setPrintCopies(
                        Math.max(
                          1,
                          Math.round(printVariant.stockQuantity || 1),
                        ),
                      )
                    }
                    className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition-all duration-150 hover:border-emerald-400 hover:bg-emerald-100"
                  >
                    Current Qty (
                    {Math.max(1, Math.round(printVariant.stockQuantity || 1))})
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Sticker Content
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Product Name", showProductName, setShowProductName],
                    ["SKU Line", showSku, setShowSku],
                    ["Price Tag", showPrice, setShowPrice],
                    ["Barcode Text", showBarcodeText, setShowBarcodeText],
                  ].map(([label, value, setter]) => (
                    <label
                      key={label as string}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) =>
                          (
                            setter as React.Dispatch<
                              React.SetStateAction<boolean>
                            >
                          )(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{label as string}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                  Live Preview
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  {labelTemplate.replace(/-/g, " ")}
                </span>
              </div>

              <div className="w-full rounded-xl border border-slate-900/10 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                {showProductName && (
                  <div className="text-center text-[13px] font-black uppercase tracking-wide text-slate-900 border-b border-slate-100 pb-1.5 mb-1.5">
                    {product.name} - {printVariant.name}
                  </div>
                )}
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  {barcodePreviewSrc ? (
                    <img
                      src={barcodePreviewSrc}
                      alt={`Barcode preview for ${printVariant.name}`}
                      className="h-24 w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-slate-200 text-xs font-medium text-slate-500">
                      Loading barcode preview...
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-2">
                  <div className="flex flex-col items-start leading-tight">
                    {showSku && (
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        SKU: {printVariant.sku}
                      </span>
                    )}
                    {showBarcodeText && (
                      <span className="font-mono text-[9px] font-bold text-slate-900 tracking-wider">
                        {printVariant.barcode ||
                          printVariant.sku ||
                          product.barcode ||
                          product.sku ||
                          String(product.id)}
                      </span>
                    )}
                  </div>
                  {showPrice && (
                    <span className="text-[15px] font-black text-slate-900 leading-none">
                      ${printVariant.sellingPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
