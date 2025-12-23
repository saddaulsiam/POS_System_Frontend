import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSubscription } from "../../context/SubscriptionContext";
import LoadingSpinner from "../common/LoadingSpinner";
import { SubscriptionExpiredModal } from "./SubscriptionExpiredModal";
import { SubscriptionWarningModal } from "./SubscriptionWarningModal";

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
    navigate("/subscription");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If subscription is expired, force user to purchase
  if (subscription?.isExpired || (subscription && !subscription.isActive)) {
    // Allow access to purchase page and settings page
    if (
      location.pathname === "/subscription" ||
      location.pathname === "/settings"
    ) {
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
