import { useState } from "react";
import toast from "react-hot-toast";
import { CartItem } from "../types";

export function usePOSPayment({
  cart,
  setCart,
}: {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
}) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSplitPaymentModal, setShowSplitPaymentModal] = useState(false);
  const [showParkSaleDialog, setShowParkSaleDialog] = useState(false);
  const [showParkedSalesList, setShowParkedSalesList] = useState(false);
  const [showRedeemPointsDialog, setShowRedeemPointsDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD">("CASH");
  const [cashReceived, setCashReceived] = useState("");
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);

  // Handler: Clear Cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear the entire cart?")) {
      setCart([]);
      setLoyaltyDiscount(0);
    }
  };

  // Handler: Payment Modal
  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowPaymentModal(true);
  };

  // Handler: Split Payment Modal
  const handleSplitPayment = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowSplitPaymentModal(true);
  };

  // Handler: Park Sale Dialog
  const handleParkSale = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowParkSaleDialog(true);
  };

  return {
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
  };
}
