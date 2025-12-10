import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  subscriptionAPI,
  type SubscriptionStatus,
} from "../../services/subscriptionAPI";

const SubscriptionTab: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const data = await subscriptionAPI.getStatus();
      setSubscription(data);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      toast.error("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You will lose access when it expires.",
      )
    ) {
      return;
    }

    try {
      setCancelling(true);
      const updated = await subscriptionAPI.cancel();
      setSubscription(updated);
      toast.success("Subscription cancelled successfully");
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      toast.error(
        error?.response?.data?.error || "Failed to cancel subscription",
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = "/subscription";
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200"></div>
          <div className="h-4 w-full rounded bg-gray-200"></div>
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <p className="text-gray-600">Failed to load subscription details</p>
        <button
          onClick={fetchSubscription}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (subscription.status) {
      case "ACTIVE":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            Active
          </span>
        );
      case "TRIAL":
        return (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            Trial
          </span>
        );
      case "EXPIRED":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            Expired
          </span>
        );
      case "CANCELLED":
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = () => {
    switch (subscription.status) {
      case "ACTIVE":
        return "✅";
      case "TRIAL":
        return "🎁";
      case "EXPIRED":
        return "⚠️";
      case "CANCELLED":
        return "🚫";
      default:
        return "ℹ️";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Subscription Status Card */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{getStatusIcon()}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Subscription Status
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your POS system subscription
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Current Plan */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl">📦</span>
                <span className="text-sm font-medium">Current Plan</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {subscription.plan || "Trial"}
              </p>
            </div>

            {/* Days Remaining */}
            {subscription.daysRemaining !== null && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-xl">⏰</span>
                  <span className="text-sm font-medium">Days Remaining</span>
                </div>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    subscription.daysRemaining < 7
                      ? "text-red-600"
                      : "text-gray-900"
                  }`}
                >
                  {subscription.daysRemaining} days
                </p>
              </div>
            )}

            {/* Trial Period */}
            {subscription.status === "TRIAL" && (
              <>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-xl">🎯</span>
                    <span className="text-sm font-medium">Trial Started</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {formatDate(subscription.trialStartDate)}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-xl">🏁</span>
                    <span className="text-sm font-medium">Trial Ends</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {formatDate(subscription.trialEndDate)}
                  </p>
                </div>
              </>
            )}

            {/* Subscription End Date */}
            {subscription.subscriptionEndDate && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 md:col-span-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-xl">📅</span>
                  <span className="text-sm font-medium">
                    Subscription Expires
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {formatDate(subscription.subscriptionEndDate)}
                </p>
              </div>
            )}
          </div>

          {/* Warning Message */}
          {subscription.showWarning && (
            <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900">
                    Subscription Expiring Soon
                  </h3>
                  <p className="mt-1 text-sm text-yellow-800">
                    Your subscription will expire in{" "}
                    {subscription.daysRemaining} days. Renew now to continue
                    enjoying uninterrupted service.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Expired Message */}
          {subscription.isExpired && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">
                    Subscription Expired
                  </h3>
                  <p className="mt-1 text-sm text-red-800">
                    Your subscription has expired. Subscribe now to restore
                    access to your POS system.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {/* Upgrade/Renew Button */}
          {(subscription.status === "TRIAL" ||
            subscription.status === "EXPIRED" ||
            subscription.showWarning) && (
            <button
              onClick={handleUpgrade}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
            >
              <span>🚀</span>
              {subscription.status === "TRIAL"
                ? "Upgrade Now"
                : "Renew Subscription"}
            </button>
          )}

          {/* Cancel Subscription */}
          {subscription.status === "ACTIVE" && (
            <button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="flex items-center gap-2 rounded-lg border border-red-300 bg-white px-6 py-3 font-semibold text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
            >
              <span>🚫</span>
              {cancelling ? "Cancelling..." : "Cancel Subscription"}
            </button>
          )}

          {/* View Plans */}
          <button
            onClick={handleUpgrade}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            <span>💎</span>
            View Plans
          </button>
        </div>
      </div>

      {/* Subscription Features */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {subscription.status === "ACTIVE"
            ? "Your Plan Includes"
            : "Premium Features"}
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">
              Unlimited products & sales
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">
              Advanced inventory management
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">
              Customer loyalty program
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">
              Detailed reports & analytics
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">
              Multi-employee support
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-gray-700">
              Priority customer support
            </span>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-blue-900">Need Help?</h3>
            <p className="mt-1 text-sm text-blue-800">
              If you have any questions about your subscription or need
              assistance, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
