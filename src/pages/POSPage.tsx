import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CustomerModal } from "../components/customers/CustomerModal";
import { RedeemPointsDialog } from "../components/loyalty";
import {
  OfferBadge,
  POSBarcodeScanner,
  POSCart,
  POSCustomerSearch,
  POSHeader,
  POSPaymentModal,
  POSProductGrid,
  ParkSaleDialog,
  ParkedSalesList,
  QuickSaleButtons,
  SplitPaymentDialog,
  VariantSelectorModal,
} from "../components/pos";
import { useAuth, useSettings } from "../context";
import {
  usePOSCart,
  usePOSCustomer,
  usePOSHandlers,
  usePOSPayment,
} from "../hooks";
import { loyaltyAPI, receiptsAPI, salesAPI } from "../services";
import { useCategories } from "../services/queries/commonQueries";
import { useProducts } from "../services/queries/productsQueries";
import { Product } from "../types";
import { formatCurrency } from "../utils/currencyUtils";
import {
  calculateChange,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "../utils/posUtils";

const POSPage: FC = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  // Cart state
  const {
    cart,
    setCart,
    addToCart,
    addVariantToCart,
    updateCartItemQuantity,
    removeFromCart,
  } = usePOSCart();

  // Barcode state
  const [barcode, setBarcode] = useState("");

  // Customer state (hook)
  const {
    customerPhone,
    setCustomerPhone,
    customer,
    setCustomer,
    customerNotFound,
    setCustomerNotFound,
    showCreateCustomerModal,
    setShowCreateCustomerModal,
    searchCustomer,
    handleCreateCustomer,
    handleClearCustomer,
  } = usePOSCustomer();

  // Products and categories state (use React Query)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { data: categoriesResp } = useCategories();
  const categories = categoriesResp || [];
  const { data: productsResp, refetch: refetchProducts } = useProducts({
    page: 1,
    limit: 50,
    categoryId: selectedCategory,
    isActive: true,
  });
  const products = productsResp?.data || [];
  const loadProducts = (_categoryId?: number) => {
    return refetchProducts();
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    refetchProducts();
  };

  // Payment state (hook)
  const {
    isProcessingPayment,
    setIsProcessingPayment,
    showPaymentModal,
    setShowPaymentModal,
    showSplitPaymentModal,
    setShowSplitPaymentModal,
    showParkSaleDialog,
    setShowParkSaleDialog,
    showParkedSalesList,
    setShowParkedSalesList,
    showRedeemPointsDialog,
    setShowRedeemPointsDialog,
    paymentMethod,
    setPaymentMethod,
    cashReceived,
    setCashReceived,
    loyaltyDiscount,
    setLoyaltyDiscount,
    handleClearCart,
    handlePayment,
    handleSplitPayment,
    handleParkSale,
  } = usePOSPayment({ cart, setCart });

  // Variant selection state
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [selectedProductForVariant, setSelectedProductForVariant] =
    useState<Product | null>(null);

  // Modularized POS handlers
  const {
    handleBarcodeSubmit,
    handleAddToCart,
    handleCustomerFormSubmit,
    confirmParkSale,
    handleResumeParkedSale,
    handlePointsRedeemed,
    handleConfirmSplitPayment,
  } = usePOSHandlers({
    cart,
    setCart,
    customer,
    setCustomer,
    setCustomerPhone,
    setCustomerNotFound,
    setShowCreateCustomerModal,
    setShowParkSaleDialog,
    setShowSplitPaymentModal,
    setLoyaltyDiscount,
    loyaltyDiscount,
    salesAPI,
    settings,
    selectedCategory,
    loadProducts,
    addVariantToCart,
    addToCart,
    setShowVariantSelector,
    setSelectedProductForVariant,
    setBarcode,
    customerPhone,
    setShowRedeemPointsDialog,
  });

  // Track offer discount and applied offer in state for UI
  const [offerDiscount, setOfferDiscount] = useState(0);
  const [appliedOffer, setAppliedOffer] = useState<any>(null);

  // Fetch and update offers when customer or cart changes
  useEffect(() => {
    const updateOffers = async () => {
      if (!customer) {
        setOfferDiscount(0);
        setAppliedOffer(null);
        return;
      }
      try {
        const total = calculateTotal(cart);
        const offers = await loyaltyAPI.getAllOffers();
        const now = new Date();
        const eligible = (offers || []).filter((offer: any) => {
          if (!offer.isActive) return false;
          if (offer.requiredTier && offer.requiredTier !== customer.loyaltyTier)
            return false;
          if (offer.minimumPurchase && total < offer.minimumPurchase)
            return false;
          const start = new Date(offer.startDate);
          const end = new Date(offer.endDate);
          if (now < start || now > end) return false;
          return true;
        });
        let _appliedOffer = null;
        let _offerDiscount = 0;
        if (eligible.length > 0) {
          _appliedOffer = eligible.reduce((best: any, curr: any) => {
            if (!best) return curr;
            if ((curr.discountValue || 0) > (best.discountValue || 0))
              return curr;
            return best;
          }, null);
          if (_appliedOffer) {
            if (_appliedOffer.offerType === "DISCOUNT_PERCENTAGE") {
              _offerDiscount =
                (total * (_appliedOffer.discountValue || 0)) / 100;
            } else if (_appliedOffer.offerType === "DISCOUNT_FIXED") {
              _offerDiscount = _appliedOffer.discountValue || 0;
            }
          }
        }
        setOfferDiscount(_offerDiscount);
        setAppliedOffer(_appliedOffer);
      } catch (e) {
        setOfferDiscount(0);
        setAppliedOffer(null);
      }
    };
    updateOffers();
  }, [customer, cart]);

  const processPayment = async () => {
    if (isProcessingPayment) return;
    setIsProcessingPayment(true);
    try {
      let _offerDiscount = 0;
      let _appliedOffer = null;
      const total = calculateTotal(cart);
      // 1. Fetch and filter active offers if customer exists
      if (customer) {
        try {
          const offers = await loyaltyAPI.getAllOffers();
          const now = new Date();
          // Find best eligible offer
          const eligible = (offers || []).filter((offer: any) => {
            if (!offer.isActive) return false;
            if (
              offer.requiredTier &&
              offer.requiredTier !== customer.loyaltyTier
            )
              return false;
            if (offer.minimumPurchase && total < offer.minimumPurchase)
              return false;
            const start = new Date(offer.startDate);
            const end = new Date(offer.endDate);
            if (now < start || now > end) return false;
            return true;
          });
          // Pick the best offer (highest discount)
          if (eligible.length > 0) {
            _appliedOffer = eligible.reduce((best: any, curr: any) => {
              if (!best) return curr;
              if ((curr.discountValue || 0) > (best.discountValue || 0))
                return curr;
              return best;
            }, null);
            if (_appliedOffer) {
              if (_appliedOffer.offerType === "DISCOUNT_PERCENTAGE") {
                _offerDiscount =
                  (total * (_appliedOffer.discountValue || 0)) / 100;
              } else if (_appliedOffer.offerType === "DISCOUNT_FIXED") {
                _offerDiscount = _appliedOffer.discountValue || 0;
              }
            }
          }
        } catch (e: any) {
          console.error("Failed to fetch/apply loyalty offers", e);
        }
      } else {
        // No customer selected, so no offer can be applied.
      }
      setOfferDiscount(_offerDiscount);
      setAppliedOffer(_appliedOffer);
      // Loyalty points and offer discount are both applied if present
      const finalTotal = total - loyaltyDiscount - _offerDiscount;
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
        offerDiscount: _offerDiscount,
        offerId: _appliedOffer?.id || null,
        offerTitle: _appliedOffer?.title || null,
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
      setOfferDiscount(0);
      setAppliedOffer(null);
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
  const finalTotal = total - loyaltyDiscount - offerDiscount;
  const changeAmount = calculateChange(
    parseFloat(cashReceived) || 0,
    finalTotal,
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Offer Badge or Message Above Cart */}
      <OfferBadge customer={customer} cart={cart} appliedOffer={appliedOffer} />

      {/* Header */}
      <POSHeader
        storeName={settings?.storeName}
        user={user || undefined}
        onLogout={logout}
      />

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
              <QuickSaleButtons onProductSelect={handleAddToCart} />
            </div>
          )}

          {/* Quick Access Categories & Products Grid */}
          <POSProductGrid
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
            onProductClick={handleAddToCart}
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
            offerDiscount={offerDiscount}
            // offerTitle={appliedOffer?.title || null}
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
        offerDiscount={offerDiscount}
        customer={customer}
        // offerTitle={appliedOffer?.title || null}
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
          onSelectVariant={(variant) => {
            if (selectedProductForVariant) {
              addVariantToCart(variant, selectedProductForVariant);
              setShowVariantSelector(false);
              setSelectedProductForVariant(null);
            }
          }}
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
