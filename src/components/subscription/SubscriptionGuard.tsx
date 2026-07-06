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

  const showGraceBanner = subscription?.isGracePeriod;
  const showExpiringSoonBanner =
    !showGraceBanner &&
    subscription &&
    subscription.daysRemaining !== null &&
    subscription.daysRemaining <= 3 &&
    subscription.daysRemaining > 0;

  return (
    <>
      {showGraceBanner && subscription && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-center text-xs font-bold shadow-sm flex items-center justify-center gap-2 animate-pulse z-40 relative">
          <span>⚠️ Your store subscription has expired! You are in a {subscription.gracePeriodDays}-day grace period ({subscription.graceDaysRemaining} days remaining). Please renew to prevent service lockouts.</span>
          <button
            onClick={handlePurchase}
            className="ml-2 rounded bg-white px-3 py-1 text-2xs font-extrabold text-amber-700 hover:bg-slate-50 transition-all shadow"
          >
            Renew Now
          </button>
        </div>
      )}

      {showExpiringSoonBanner && subscription && (
        <div className="bg-orange-500 text-white px-4 py-2.5 text-center text-xs font-bold shadow-sm flex items-center justify-center gap-2 z-40 relative">
          <span>⚠️ Your {subscription.status === "TRIAL" ? "trial period" : "subscription"} is ending soon ({subscription.daysRemaining} days remaining). Renew your plan to avoid system disruptions.</span>
          <button
            onClick={handlePurchase}
            className="ml-2 rounded bg-white px-3 py-1 text-2xs font-extrabold text-orange-600 hover:bg-slate-50 transition-all shadow"
          >
            Renew Now
          </button>
        </div>
      )}

      {children}
      {showWarning && subscription && (
        <SubscriptionWarningModal
          daysRemaining={subscription.daysRemaining || 0}
          planType={subscription.plan}
          onClose={handleCloseWarning}
          onPurchase={handlePurchase}
        />
      )}
    </>
  );
};
