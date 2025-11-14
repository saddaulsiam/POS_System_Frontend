import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { productsAPI, productVariantsAPI } from "../services";
import {
  useCreateCustomer,
  useCreateParkedSale,
  useCreateSale,
  useLookupVariant,
} from "../services/queries";
import type { CartItem, ParkedSale, Product } from "../types";
import { formatCurrency } from "../utils/currencyUtils";

interface UsePOSHandlersArgs {
  salesAPI?: any;
  receiptsAPI?: any; // Optional, for testability and type safety
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  customer: any;
  setCustomer: (customer: any) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerNotFound: (notFound: boolean) => void;
  setShowCreateCustomerModal: (open: boolean) => void;
  setShowParkSaleDialog: (open: boolean) => void;
  setShowSplitPaymentModal: (open: boolean) => void;
  setLoyaltyDiscount: (amount: number) => void;
  loyaltyDiscount: number;
  settings: any;
  selectedCategory: number | null;
  loadProducts: (categoryId?: number) => void;
  addVariantToCart: (variant: any, product: Product) => void;
  addToCart: (product: Product) => void;
  setShowVariantSelector: (open: boolean) => void;
  setSelectedProductForVariant: (product: Product | null) => void;
  setBarcode?: (barcode: string) => void;
  customerPhone?: string;
  setShowRedeemPointsDialog?: (open: boolean) => void;
}

export function usePOSHandlers(args: UsePOSHandlersArgs) {
  const { addToCart, addVariantToCart } = args;

  // Use a ref to always have the latest cart
  const cartRef = useRef(args.cart);
  useEffect(() => {
    cartRef.current = args.cart;
  }, [args.cart]);

  // React Query mutations and client
  const queryClient = useQueryClient();
  const lookupVariant = useLookupVariant();
  const createCustomer = useCreateCustomer();
  const createParkedSale = useCreateParkedSale();
  const createSale = useCreateSale();

  // Handler: Barcode submit (matches POSBarcodeScanner prop signature)
  const handleBarcodeSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!args.cart || !args.setCart) return;
      const barcode = (e.target as any).barcode?.value || "";
      if (!barcode.trim()) return;
      try {
        if (barcode.match(/^\d+$/)) {
          try {
            const variant = await lookupVariant.mutateAsync({
              barcode,
              silent: true,
            });
            if (variant && variant.productId) {
              const product = await productsAPI.getById(variant.productId);
              addVariantToCart(variant, product);
              args.setBarcode && args.setBarcode("");
              return;
            }
          } catch (variantError: any) {
            // Silently fall through to product lookup - no error toast needed
            // If 404, fall through to product lookup
          }
        }
        // Try product lookup if variant not found or not a number barcode
        let product;
        try {
          product = await productsAPI.getByBarcode(barcode, true); // silent mode
        } catch {
          const searchResults = await productsAPI.getAll({
            search: barcode,
            isActive: true,
            limit: 1,
          });
          if (searchResults.data && searchResults.data.length > 0) {
            product = searchResults.data[0];
          } else {
            toast.error("Product not found");
            return;
          }
        }
        // If product has variants, show variant selector modal
        if (
          product.hasVariants &&
          args.setShowVariantSelector &&
          args.setSelectedProductForVariant
        ) {
          args.setSelectedProductForVariant(product);
          args.setShowVariantSelector(true);
        } else {
          addToCart(product);
        }
        args.setBarcode && args.setBarcode("");
      } catch (error) {
        console.error("Error searching product:", error);
        toast.error("Error searching product");
      }
    },
    [addToCart, addVariantToCart],
  );

  // Handler: Add to cart (matches POSProductGrid prop signature)
  const handleAddToCart = useCallback(
    (product: Product) => {
      if (
        product.hasVariants &&
        args.setShowVariantSelector &&
        args.setSelectedProductForVariant
      ) {
        args.setSelectedProductForVariant(product);
        args.setShowVariantSelector(true);
        return;
      }
      addToCart(product);
    },
    [addToCart],
  );

  // Handler: Customer form submit (matches CustomerModal prop signature)
  const handleCustomerFormSubmit = useCallback(async (formData: any) => {
    try {
      const customerData = {
        name: formData.name.trim(),
        phoneNumber:
          formData.phoneNumber.trim() || (args.customerPhone?.trim?.() ?? ""),
        email: formData.email.trim() || undefined,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        address: formData.address.trim() || undefined,
      };
      const newCustomer = await createCustomer.mutateAsync(customerData);
      args.setCustomer(newCustomer);
      args.setCustomerPhone(newCustomer.phoneNumber || "");
      args.setCustomerNotFound(false);
      args.setShowCreateCustomerModal(false);
      toast.success(`Customer created: ${newCustomer.name}`);
    } catch (error) {
      console.error("Error creating customer:", error);
      if (typeof error === "object" && error && "response" in error) {
        toast.error(
          (error as any).response?.data?.error || "Failed to create customer",
        );
      } else {
        toast.error("Failed to create customer");
      }
      throw error;
    }
  }, []);

  // Handler: Confirm park sale (matches ParkSaleDialog prop signature)
  const confirmParkSale = useCallback(async (notes: string) => {
    // Always use the latest cart state
    const cart = cartRef.current;
    console.log("[DEBUG] Cart at start of confirmParkSale:", cart);
    if (!cart || cart.length === 0) {
      toast.error("Cannot park an empty cart. Please add items first.");
      console.error("[DEBUG] Attempted to park sale with empty cart:", cart);
      return;
    }
    try {
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const tax = cart.reduce(
        (sum, item) =>
          sum +
          ((item.product.taxRate || 0) * item.price * item.quantity) / 100,
        0,
      );
      // Set expiresAt to 7 days from now
      const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const parkData = {
        customerId: args.customer?.id,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productSku: item.product.sku,
          productBarcode: item.product.barcode,
          productVariantId: item.variant?.id,
          productVariantName: item.variant?.name,
          productVariantSku: item.variant?.sku,
          quantity: item.quantity,
          price: item.price,
          taxRate: item.product.taxRate || 0,
          categoryId: item.product.categoryId,
        })),
        subtotal,
        taxAmount: tax,
        discountAmount: 0,
        notes,
        expiresAt,
      };
      // Debug: log parkData before sending to backend
      console.log("[DEBUG] parkData sent to backend:", parkData);
      await createParkedSale.mutateAsync(parkData);
      toast.success("Sale parked successfully");
      args.setCart([]);
      args.setCustomer(null);
      args.setCustomerPhone("");
      args.setShowParkSaleDialog(false);
      args.setLoyaltyDiscount(0);
    } catch (error) {
      console.error("Error parking sale:", error);
      if (typeof error === "object" && error && "response" in error) {
        toast.error(
          (error as any).response?.data?.error || "Failed to park sale",
        );
      } else {
        toast.error("Failed to park sale");
      }
    }
  }, []);

  // Handler: Resume parked sale (matches ParkedSalesList prop signature)
  const handleResumeParkedSale = useCallback(async (parkedSale: ParkedSale) => {
    try {
      const parkedItems = parkedSale.items as any[];
      const cartItems = [];
      const outOfStockItems = [];
      for (const item of parkedItems) {
        let product = null;
        let variant = null;
        try {
          product =
            (queryClient.getQueryData(["product", item.productId]) as any) ||
            (await productsAPI.getById(item.productId));
        } catch (e) {
          outOfStockItems.push(
            item.productName || `Product #${item.productId}`,
          );
          continue;
        }
        if (item.productVariantId) {
          try {
            variant =
              (queryClient.getQueryData([
                "productVariant",
                item.productVariantId,
              ]) as any) ||
              (await productVariantsAPI.getById(item.productVariantId));
          } catch (e) {
            outOfStockItems.push(
              `${product.name} (Variant #${item.productVariantId})`,
            );
            continue;
          }
          // Check variant stock
          if (variant.stockQuantity >= item.quantity) {
            cartItems.push({
              product,
              variant,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.quantity * item.price,
            });
          } else {
            outOfStockItems.push(`${product.name} (${variant.name})`);
          }
        } else {
          // No variant, check product stock
          if (product.stockQuantity >= item.quantity) {
            cartItems.push({
              product,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.quantity * item.price,
            });
          } else {
            outOfStockItems.push(product.name || `Product #${item.productId}`);
          }
        }
      }
      args.setCart(cartItems);
      if (parkedSale.customer) {
        args.setCustomer(parkedSale.customer);
        args.setCustomerPhone(parkedSale.customer.phoneNumber || "");
      }
      if (outOfStockItems.length > 0) {
        toast.error(
          `Some items could not be resumed due to insufficient stock: ${outOfStockItems.join(", ")}`,
        );
      } else {
        toast.success("Parked sale resumed");
      }
    } catch (error) {
      console.error("Error resuming parked sale:", error);
      toast.error("Failed to resume parked sale");
    }
  }, []);

  // Handler: Points redeemed (matches RedeemPointsDialog prop signature)
  const handlePointsRedeemed = useCallback(
    (discountAmount: number, points: number) => {
      args.setLoyaltyDiscount(discountAmount);
      args.setShowRedeemPointsDialog && args.setShowRedeemPointsDialog(false);
      toast.success(
        `Applied ${formatCurrency(discountAmount, args.settings)} loyalty discount using ${points} points!`,
      );
    },
    [],
  );

  // Handler: Confirm split payment (matches SplitPaymentDialog prop signature)
  const handleConfirmSplitPayment = useCallback(async (splits: any[]) => {
    // Always use the latest cart
    const cart = cartRef.current;
    try {
      const saleData = {
        customerId: args.customer?.id,
        items: cart.map((item) => ({
          productId: item.product.id,
          productVariantId: item.variant?.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        })),
        paymentMethod: "MIXED" as any,
        paymentSplits: splits.map((split) => ({
          paymentMethod: split.method,
          amount: split.amount,
        })),
        loyaltyDiscount: args.loyaltyDiscount || 0,
      };

      // Create sale via React Query mutation
      const sale = await createSale.mutateAsync(saleData);
      toast.success(
        `Sale completed! Receipt ID: ${sale.receiptId || sale.id || ""}`,
      );

      // Auto-print receipt if enabled
      try {
        const settings = args.settings;
        // Dynamically import receiptsAPI if not present in args
        const receiptsAPI =
          args.receiptsAPI ||
          (window as any).receiptsAPI ||
          (await import("../services")).receiptsAPI;
        if (settings?.printReceiptAuto) {
          try {
            const htmlContent = await receiptsAPI.getHTML(sale.id);
            const printWindow = window.open(
              "",
              "_blank",
              "width=800,height=600",
            );
            if (printWindow) {
              printWindow.document.write(htmlContent);
              printWindow.document.close();
              setTimeout(() => {
                printWindow.print();
              }, 500);
            }
            toast.success("Receipt ready to print", {
              duration: 2000,
              icon: "🖨️",
            });
          } catch (printError) {
            console.error("Error printing receipt:", printError);
            toast.error("Failed to open receipt for printing");
          }
        }
        if (settings?.autoPrintThermal) {
          try {
            let thermalContent = await receiptsAPI.getThermal(sale.id);
            const currencySymbol = settings?.currencySymbol || "$";
            thermalContent = thermalContent.replace(
              /\$(\d+[.,]?\d*)/g,
              `${currencySymbol}$1`,
            );
            const printWindow = window.open(
              "",
              "_blank",
              "width=400,height=600",
            );
            if (printWindow) {
              printWindow.document.write(
                `<pre style='font-size:16px; font-family:monospace;'>${thermalContent}</pre>`,
              );
              printWindow.document.close();
              setTimeout(() => {
                printWindow.print();
              }, 300);
            }
            toast.success("Thermal receipt ready to print", { icon: "🧾" });
          } catch (err) {
            toast.error("Failed to print thermal receipt");
          }
        }
      } catch (autoPrintErr) {
        // Ignore auto print errors
      }

      args.setCart([]);
      args.setCustomer(null);
      args.setCustomerPhone("");
      args.setShowSplitPaymentModal(false);
      args.setLoyaltyDiscount(0);
      args.loadProducts(args.selectedCategory || undefined);
    } catch (error: any) {
      let errorMessage = "Failed to process payment";
      if (
        error?.response?.data?.errors &&
        error.response.data.errors.length > 0
      ) {
        const firstError = error.response.data.errors[0];
        errorMessage = firstError.msg || errorMessage;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  }, []);

  return {
    handleBarcodeSubmit,
    handleAddToCart,
    handleCustomerFormSubmit,
    confirmParkSale,
    handleResumeParkedSale,
    handlePointsRedeemed,
    handleConfirmSplitPayment,
  };
}
