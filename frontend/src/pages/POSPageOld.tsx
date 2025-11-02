import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { CustomerModal } from "../components/customers/CustomerModal";
import { RedeemPointsDialog } from "../components/loyalty";
import { POSBarcodeScanner } from "../components/pos/POSBarcodeScanner";
import { POSCart } from "../components/pos/POSCart";
import { POSCustomerSearch } from "../components/pos/POSCustomerSearch";
import { POSPaymentModal } from "../components/pos/POSPaymentModal";
import { POSProductGrid } from "../components/pos/POSProductGrid";
import { ParkSaleDialog } from "../components/pos/ParkSaleDialog";
import { ParkedSalesList } from "../components/pos/ParkedSalesList";
import { QuickSaleButtons } from "../components/pos/QuickSaleButtons";
import { SplitPaymentDialog } from "../components/pos/SplitPaymentDialog";
import { VariantSelectorModal } from "../components/pos/VariantSelectorModal";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import {
  categoriesAPI,
  customersAPI,
  parkedSalesAPI,
  productsAPI,
  productVariantsAPI,
  receiptsAPI,
  salesAPI,
} from "../services";
import {
  CartItem,
  Category,
  CreateCustomerRequest,
  Customer,
  ParkedSale,
  Product,
  ProductVariant,
} from "../types";
import { formatCurrency } from "../utils/currencyUtils";
import {
  calculateChange,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "../utils/posUtils";

const POSPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Barcode state
  const [barcode, setBarcode] = useState("");

  // Customer state
  const [customerPhone, setCustomerPhone] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerNotFound, setCustomerNotFound] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);

  // Products and categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Payment state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSplitPaymentModal, setShowSplitPaymentModal] = useState(false);
  const [showParkSaleDialog, setShowParkSaleDialog] = useState(false);
  const [showParkedSalesList, setShowParkedSalesList] = useState(false);
  const [showRedeemPointsDialog, setShowRedeemPointsDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CASH");
  const [cashReceived, setCashReceived] = useState("");
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);

  // Variant selection state
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<Product | null>(null);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProducts = async (categoryId?: number) => {
    try {
      const data = await productsAPI.getAll({
        categoryId,
        isActive: true,
        limit: 50,
      });
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    loadProducts(categoryId || undefined);
  };

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    try {
      // STEP 1: Check if barcode matches a product variant (silently)
      if (barcode.match(/^\d+$/)) {
        try {
          const variant = await productVariantsAPI.lookup(barcode);

          // Found a variant! Get the parent product and add variant directly
          if (variant && variant.productId) {
            const product = await productsAPI.getById(variant.productId);
            addVariantToCart(variant, product);
            setBarcode("");
            return;
          }
        } catch (variantError: any) {
          // Silently ignore 404 - variant not found, will try product lookup
          // Only show error if it's a server error (500)
          if (variantError.response?.status >= 500) {
            toast.error("Error looking up variant");
          }
          // Continue to regular product lookup
        }
      } // STEP 2: Try to find regular product by barcode or name
      let product: Product;

      if (barcode.match(/^\d+$/)) {
        try {
          product = await productsAPI.getByBarcode(barcode);
        } catch {
          // If barcode not found, search by name
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
      } else {
        // Search by name
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

      addToCart(product);
      setBarcode("");
    } catch (error) {
      console.error("Error searching product:", error);
      toast.error("Error searching product");
    }
  };

  const addToCart = (product: Product) => {
    // Check if product has variants
    if (product.hasVariants) {
      setSelectedProductForVariant(product);
      setShowVariantSelector(true);
      return;
    }

    // Standard product without variants
    if (product.stockQuantity <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const existingItem = cart.find(
      (item) => item.product.id === product.id && !item.variant,
    );

    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        toast.error("Not enough stock available");
        return;
      }

      setCart(
        cart.map((item) =>
          item.product.id === product.id && !item.variant
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item,
        ),
      );
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        price: product.sellingPrice,
        subtotal: product.sellingPrice,
      };
      setCart([...cart, newItem]);
    }

    toast.success(`${product.name} added to cart`);
  };

  const addVariantToCart = (variant: ProductVariant, product?: Product) => {
    // Use provided product or fallback to selectedProductForVariant
    const parentProduct = product || selectedProductForVariant;
    if (!parentProduct) return;

    if ((variant.stockQuantity || 0) <= 0) {
      toast.error("Variant is out of stock");
      return;
    }

    // Check if this specific variant is already in cart
    const existingItem = cart.find(
      (item) =>
        item.product.id === parentProduct.id && item.variant?.id === variant.id,
    );

    if (existingItem) {
      if (existingItem.quantity >= (variant.stockQuantity || 0)) {
        toast.error("Not enough stock available");
        return;
      }

      setCart(
        cart.map((item) =>
          item.product.id === parentProduct.id &&
          item.variant?.id === variant.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item,
        ),
      );
    } else {
      const newItem: CartItem = {
        product: parentProduct,
        variant,
        quantity: 1,
        price: variant.sellingPrice,
        subtotal: variant.sellingPrice,
      };
      setCart([...cart, newItem]);
    }

    toast.success(`${parentProduct.name} - ${variant.name} added to cart`);
  };

  const updateCartItemQuantity = (
    productId: number,
    quantity: number,
    variantId?: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    const item = cart.find(
      (item) =>
        item.product.id === productId &&
        (variantId ? item.variant?.id === variantId : !item.variant),
    );

    if (!item) return;

    const maxStock = item.variant
      ? item.variant.stockQuantity || 0
      : item.product.stockQuantity;
    if (quantity > maxStock) {
      toast.error("Not enough stock available");
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.id === productId &&
        (variantId ? item.variant?.id === variantId : !item.variant)
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price,
            }
          : item,
      ),
    );
  };

  const removeFromCart = (productId: number, variantId?: number) => {
    setCart(
      cart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (variantId ? item.variant?.id === variantId : !item.variant)
          ),
      ),
    );
  };

  const searchCustomer = async () => {
    if (!customerPhone.trim()) {
      setCustomer(null);
      setCustomerNotFound(false);
      return;
    }

    try {
      const customerData = await customersAPI.getByPhone(customerPhone);
      setCustomer(customerData);
      setCustomerNotFound(false);
      toast.success(`Customer found: ${customerData.name}`);
    } catch (error) {
      setCustomer(null);
      setCustomerNotFound(true);
      // Don't show error toast, let the UI show the create button instead
    }
  };

  const handleCreateCustomer = () => {
    setShowCreateCustomerModal(true);
  };

  const handleClearCustomer = () => {
    setCustomer(null);
    setCustomerPhone("");
    setCustomerNotFound(false);
    setLoyaltyDiscount(0);
  };

  const handleCustomerFormSubmit = async (formData: any) => {
    try {
      const customerData: CreateCustomerRequest = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || customerPhone.trim(), // Use searched phone if form phone is empty
        email: formData.email.trim() || undefined,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      const newCustomer = await customersAPI.create(customerData);
      setCustomer(newCustomer);
      setCustomerPhone(newCustomer.phoneNumber || "");
      setCustomerNotFound(false);
      setShowCreateCustomerModal(false);
      toast.success(`Customer created: ${newCustomer.name}`);
    } catch (error: any) {
      console.error("Error creating customer:", error);
      toast.error(error.response?.data?.error || "Failed to create customer");
      throw error;
    }
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleSplitPayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowSplitPaymentModal(true);
  };

  const handleParkSale = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowParkSaleDialog(true);
  };

  const confirmParkSale = async (notes: string) => {
    try {
      const parkData = {
        customerId: customer?.id,
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
      };

      await parkedSalesAPI.create(parkData);
      toast.success("Sale parked successfully");

      // Clear cart
      setCart([]);
      setCustomer(null);
      setCustomerPhone("");
      setShowParkSaleDialog(false);
    } catch (error: any) {
      console.error("Error parking sale:", error);
      toast.error(error.response?.data?.error || "Failed to park sale");
    }
  };

  const handleResumeParkedSale = (parkedSale: ParkedSale) => {
    try {
      // Convert parked items to cart items
      const parkedItems = parkedSale.items as any[];
      const cartItems: CartItem[] = parkedItems.map((item: any) => ({
        product: {
          id: item.productId,
          name: item.productName || "Product",
          sku: item.productSku || "",
          barcode: item.productBarcode || "",
          description: "",
          categoryId: item.categoryId || 0,
          supplierId: undefined,
          costPrice: item.price,
          purchasePrice: item.price,
          sellingPrice: item.price,
          stockQuantity: 999,
          reorderLevel: 0,
          lowStockThreshold: 0,
          taxRate: item.taxRate || 0,
          isActive: true,
          isWeighted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDeleted: false,
        } as Product,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price,
      }));

      setCart(cartItems);

      if (parkedSale.customer) {
        setCustomer(parkedSale.customer);
        setCustomerPhone(parkedSale.customer.phoneNumber || "");
      }

      toast.success("Parked sale resumed");
    } catch (error) {
      console.error("Error resuming parked sale:", error);
      toast.error("Failed to resume parked sale");
    }
  };

  const handlePointsRedeemed = (discountAmount: number, points: number) => {
    setLoyaltyDiscount(discountAmount);
    setShowRedeemPointsDialog(false);
    toast.success(
      `Applied ${formatCurrency(discountAmount, settings)} loyalty discount using ${points} points!`,
    );
  };

  const handleConfirmSplitPayment = async (splits: any[]) => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      const saleData = {
        customerId: customer?.id,
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
        loyaltyDiscount,
      };

      const sale = await salesAPI.create(saleData);

      toast.success(`Sale completed! Receipt ID: ${sale.receiptId}`);

      // Auto-email receipt if enabled and customer has email
      if (settings?.emailReceiptAuto && customer?.email) {
        try {
          console.log("Sending email receipt", {
            saleId: sale.id,
            customerEmail: customer.email,
            customerName: customer.name,
          });
          const emailResult = await receiptsAPI.send({
            saleId: sale.id,
            customerEmail: customer.email,
            customerName: customer.name,
            includePDF: true,
          });
          console.log("Email send result", emailResult);
          toast.success(`Receipt emailed to ${customer.email}`, {
            duration: 3000,
            icon: "📧",
          });
        } catch (emailError) {
          console.error("Error sending receipt email:", emailError);
          toast.error("Sale completed but failed to send receipt email");
        }
      }

      // Auto-print receipt if enabled
      if (settings?.printReceiptAuto) {
        try {
          // Fetch HTML receipt with authentication
          const htmlContent = await receiptsAPI.getHTML(sale.id);

          // Open new window and write HTML content
          const printWindow = window.open("", "_blank", "width=800,height=600");
          if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Trigger print dialog after content is loaded
            setTimeout(() => {
              printWindow.print();
            }, 500); // Small delay to ensure content is rendered
          } else {
            console.warn("[DEBUG] Print window blocked or failed to open");
          }

          toast.success("Receipt ready to print", {
            duration: 2000,
            icon: "🖨️",
          });
        } catch (printError) {
          console.error("[DEBUG] Error printing receipt:", printError);
          toast.error("Failed to open receipt for printing");
        }
      }

      // Auto-print thermal receipt if enabled
      if (settings?.autoPrintThermal) {
        try {
          console.log("[DEBUG] Printing thermal receipt", { saleId: sale.id });
          const thermalContent = await receiptsAPI.getThermal(sale.id);
          console.log("[DEBUG] Thermal receipt content", thermalContent);
          const printWindow = window.open("", "_blank", "width=400,height=600");
          if (printWindow) {
            printWindow.document.write(
              `<pre style='font-size:16px; font-family:monospace;'>${thermalContent}</pre>`,
            );
            printWindow.document.close();
            setTimeout(() => {
              printWindow.print();
            }, 300);
          } else {
            console.warn("[DEBUG] Print window blocked or failed to open");
          }
          toast.success("Thermal receipt ready to print", { icon: "🧾" });
        } catch (err) {
          console.error("[DEBUG] Error printing thermal receipt:", err);
          toast.error("Failed to print thermal receipt");
        }
      }

      // Clear cart and reset form
      setCart([]);
      setCustomer(null);
      setCustomerPhone("");
      setShowSplitPaymentModal(false);
      setLoyaltyDiscount(0);

      // Reload products to update stock quantities
      loadProducts(selectedCategory || undefined);
    } catch (error) {
      console.error("Error processing split payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleClearCart = () => {
    if (confirm("Clear the entire cart?")) {
      setCart([]);
      setLoyaltyDiscount(0);
    }
  };

  const processPayment = async () => {
    if (isProcessingPayment) return;

    setIsProcessingPayment(true);

    try {
      const total = calculateTotal(cart);
      const finalTotal = total - loyaltyDiscount;

      // Validate cash payment
      if (paymentMethod === "CASH") {
        if (!cashReceived || cashReceived.trim() === "") {
          toast.error("Please enter cash received amount");
          setIsProcessingPayment(false);
          return;
        }

        const cashAmount = parseFloat(cashReceived);
        if (isNaN(cashAmount) || cashAmount < 0) {
          toast.error("Please enter a valid cash amount");
          setIsProcessingPayment(false);
          return;
        }

        if (cashAmount < finalTotal) {
          toast.error(
            `Insufficient cash. Need ${formatCurrency(finalTotal, settings)}, received ${formatCurrency(
              cashAmount,
              settings,
            )}`,
          );
          setIsProcessingPayment(false);
          return;
        }
      }

      // Build sale data - only include cashReceived for CASH payments
      const saleData: any = {
        customerId: customer?.id,
        items: cart.map((item) => ({
          productId: item.product.id,
          productVariantId: item.variant?.id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
        })),
        paymentMethod,
        loyaltyDiscount,
      };

      // Only include cashReceived for CASH payments
      if (paymentMethod === "CASH") {
        saleData.cashReceived = parseFloat(cashReceived);
      }

      const sale = await salesAPI.create(saleData);

      toast.success(`Sale completed! Receipt ID: ${sale.receiptId}`);

      // Auto-print receipt if enabled
      if (settings?.printReceiptAuto) {
        try {
          // Fetch HTML receipt with authentication
          const htmlContent = await receiptsAPI.getHTML(sale.id);

          // Open new window and write HTML content
          const printWindow = window.open("", "_blank", "width=800,height=600");
          if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Trigger print dialog after content is loaded
            setTimeout(() => {
              printWindow.print();
            }, 500); // Small delay to ensure content is rendered
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

      // Auto-print receipt if enabled
      if (settings?.autoPrintThermal) {
        try {
          let thermalContent = await receiptsAPI.getThermal(sale.id);
          // Replace hardcoded $ with dynamic currency symbol from settings
          const currencySymbol = settings?.currencySymbol || "$";
          // Regex: replace $ before numbers with currencySymbol
          thermalContent = thermalContent.replace(
            /\$(\d+[.,]?\d*)/g,
            `${currencySymbol}$1`,
          );
          console.log({ thermalContent });
          const printWindow = window.open("", "_blank", "width=400,height=600");
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

      // Clear cart and reset form
      setCart([]);
      setCustomer(null);
      setCustomerPhone("");
      setShowPaymentModal(false);
      setCashReceived("");
      setPaymentMethod("CASH");
      setLoyaltyDiscount(0);

      // Reload products to update stock quantities
      loadProducts(selectedCategory || undefined);
    } catch (error: any) {
      console.error("Error processing payment:", error);

      // Show meaningful error message
      let errorMessage = "Failed to process payment";

      if (
        error.response?.data?.errors &&
        error.response.data.errors.length > 0
      ) {
        // Backend validation errors
        const firstError = error.response.data.errors[0];
        errorMessage = firstError.msg || errorMessage;
      } else if (error.response?.data?.error) {
        // Generic backend error
        errorMessage = error.response.data.error;
      } else if (error.message) {
        // Network or other errors
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Calculate totals
  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(cart);
  const total = calculateTotal(cart);
  const finalTotal = total - loyaltyDiscount;
  const changeAmount = calculateChange(
    parseFloat(cashReceived) || 0,
    finalTotal,
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left: Store Logo and Name */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">🛒</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {settings?.storeName || "POS System"}
            </span>
            <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {user?.role}
            </span>
          </div>
          {/* Right: User Info and Actions */}
          <div className="flex items-center space-x-4">
            <span className="hidden text-sm text-gray-700 sm:inline">
              Welcome, {user?.name}
            </span>
            {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
              <Link
                to="/admin"
                className="rounded px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={logout}
              className="rounded border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Product Scanning & Categories */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Barcode Scanner - conditionally shown */}
          {settings?.enableBarcodeScanner && (
            <POSBarcodeScanner
              barcode={barcode}
              onBarcodeChange={setBarcode}
              onSubmit={handleBarcodeSubmit}
              onProductSelect={addToCart}
            />
          )}

          {/* Quick Sale Buttons - conditionally shown */}
          {settings?.enableQuickSale && (
            <div className="px-4 pt-2">
              <QuickSaleButtons onProductSelect={addToCart} />
            </div>
          )}

          {/* Quick Access Categories & Products Grid */}
          <POSProductGrid
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            onProductClick={addToCart}
          />
        </div>

        {/* Right Panel - Shopping Cart */}
        <div className="flex w-96 flex-col border-l border-gray-200 bg-white">
          {/* Customer Info - conditionally shown */}
          {settings?.enableCustomerSearch && (
            <POSCustomerSearch
              customerPhone={customerPhone}
              customer={customer}
              customerNotFound={customerNotFound}
              onPhoneChange={setCustomerPhone}
              onSearch={searchCustomer}
              onCreateCustomer={handleCreateCustomer}
              onClearCustomer={handleClearCustomer}
            />
          )}

          {/* Cart */}
          <POSCart
            cart={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={handleClearCart}
            onProcessPayment={handlePayment}
            onSplitPayment={handleSplitPayment}
            onParkSale={handleParkSale}
            onViewParkedSales={() => setShowParkedSalesList(true)}
            onRedeemPoints={() => setShowRedeemPointsDialog(true)}
            subtotal={subtotal}
            tax={tax}
            total={total}
            loyaltyDiscount={loyaltyDiscount}
            customer={customer}
          />
        </div>
      </div>

      {/* Payment Modal */}
      <POSPaymentModal
        isOpen={showPaymentModal}
        subtotal={subtotal}
        tax={tax}
        total={finalTotal}
        paymentMethod={paymentMethod}
        cashReceived={cashReceived}
        changeAmount={changeAmount}
        isProcessing={isProcessingPayment}
        onClose={() => setShowPaymentModal(false)}
        onPaymentMethodChange={setPaymentMethod}
        onCashReceivedChange={setCashReceived}
        onConfirm={processPayment}
        loyaltyDiscount={loyaltyDiscount}
      />

      {/* Split Payment Modal */}
      <SplitPaymentDialog
        isOpen={showSplitPaymentModal}
        onClose={() => setShowSplitPaymentModal(false)}
        totalAmount={finalTotal}
        onConfirm={handleConfirmSplitPayment}
      />

      {/* Park Sale Dialog */}
      <ParkSaleDialog
        isOpen={showParkSaleDialog}
        onClose={() => setShowParkSaleDialog(false)}
        cartItems={cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
        }))}
        customerId={customer?.id}
        subtotal={subtotal}
        taxAmount={tax}
        discountAmount={0}
        onConfirm={confirmParkSale}
      />

      {/* Parked Sales List */}
      <ParkedSalesList
        isOpen={showParkedSalesList}
        onClose={() => setShowParkedSalesList(false)}
        onResume={handleResumeParkedSale}
      />

      {/* Redeem Loyalty Points Dialog */}
      {customer && (
        <RedeemPointsDialog
          isOpen={showRedeemPointsDialog}
          onClose={() => setShowRedeemPointsDialog(false)}
          customerId={customer.id}
          customerName={customer.name}
          availablePoints={customer.loyaltyPoints || 0}
          cartTotal={total}
          onRedeemed={handlePointsRedeemed}
        />
      )}

      {/* Variant Selector Modal */}
      {selectedProductForVariant && (
        <VariantSelectorModal
          isOpen={showVariantSelector}
          onClose={() => {
            setShowVariantSelector(false);
            setSelectedProductForVariant(null);
          }}
          product={selectedProductForVariant}
          onSelectVariant={addVariantToCart}
        />
      )}

      {/* Create Customer Modal */}
      <CustomerModal
        isOpen={showCreateCustomerModal}
        editingCustomer={null}
        initialPhoneNumber={customerPhone}
        onClose={() => setShowCreateCustomerModal(false)}
        onSubmit={handleCustomerFormSubmit}
      />
    </div>
  );
};

export default POSPage;
