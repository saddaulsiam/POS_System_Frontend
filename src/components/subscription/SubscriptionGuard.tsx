import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSubscription } from "../../context/SubscriptionContext";
import { SubscriptionWarningModal } from "./SubscriptionWarningModal";
import { SubscriptionExpiredModal } from "./SubscriptionExpiredModal";

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription, isLoading } = useSubscription();
  const [showWarning, setShowWarning] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(() => {
    // Check if warning was already shown in this session
    return sessionStorage.getItem("warningShownThisSession") === "true";
  });

  useEffect(() => {
    if (!subscription || isLoading) return;

    // Show warning modal if trial is ending soon and warning hasn't been shown this session
    if (subscription.showWarning && !hasShownWarning) {
      setShowWarning(true);
    }
  }, [subscription, isLoading, hasShownWarning]);

  const handleCloseWarning = () => {
    setShowWarning(false);
    setHasShownWarning(true);
    // Mark as shown for this browser session only
    sessionStorage.setItem("warningShownThisSession", "true");
  };

  const handlePurchase = () => {
    setShowWarning(false);
    setHasShownWarning(true);
    sessionStorage.setItem("warningShownThisSession", "true");
    navigate("/subscription/purchase");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If subscription is expired, force user to purchase
  if (subscription?.isExpired || (subscription && !subscription.isActive)) {
    // Allow access to purchase page
    if (location.pathname === "/subscription/purchase") {
      return <>{children}</>;
    }
    // Block all other pages
    return <SubscriptionExpiredModal onPurchase={handlePurchase} />;
  }

  return (
    <>
      {children}
      {showWarning && subscription && (
        <SubscriptionWarningModal
          daysRemaining={subscription.daysRemaining || 0}
          onClose={handleCloseWarning}
          onPurchase={handlePurchase}
        />
      )}
    </>
  );
};
