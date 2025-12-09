import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/common";
import { subscriptionAPI } from "../services/subscriptionAPI";
import { useSubscription } from "../context/SubscriptionContext";

export default function SubscriptionPurchasePage() {
  const navigate = useNavigate();
  const { refetch } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<
    "MONTHLY" | "YEARLY" | "LIFETIME"
  >("MONTHLY");
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: "MONTHLY" as const,
      name: "Monthly",
      price: "$29",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "All POS features",
        "Unlimited products",
        "24/7 Support",
        "Regular updates",
      ],
    },
    {
      id: "YEARLY" as const,
      name: "Yearly",
      price: "$290",
      period: "/year",
      badge: "Save 17%",
      description: "Best value for growing businesses",
      features: [
        "All Monthly features",
        "Priority support",
        "Advanced analytics",
        "2 months free",
      ],
    },
    {
      id: "LIFETIME" as const,
      name: "Lifetime",
      price: "$999",
      period: "one-time",
      badge: "Best Deal",
      description: "Pay once, use forever",
      features: [
        "All Yearly features",
        "Lifetime updates",
        "VIP support",
        "Future features included",
      ],
    },
  ];

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // In production, integrate with actual payment gateway (Stripe, PayPal, etc.)
      // For now, simulate payment

      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate payment processing

      await subscriptionAPI.activate({
        plan: selectedPlan,
        paymentMethod: "DEMO", // Replace with actual payment method
      });

      toast.success("Subscription activated successfully! 🎉");
      await refetch();

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to activate subscription",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the plan that best fits your business needs
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white p-8 shadow-lg transition-all ${
                selectedPlan === plan.id
                  ? "scale-105 ring-4 ring-blue-500"
                  : "hover:shadow-xl"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg
                      className="mr-3 h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                fullWidth
                variant={selectedPlan === plan.id ? "primary" : "ghost"}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {selectedPlan === plan.id ? "Selected" : "Select Plan"}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="primary"
            onClick={handlePurchase}
            disabled={loading}
            className="px-12 py-4 text-lg font-semibold"
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 inline h-5 w-5 animate-spin"
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
                Processing...
              </>
            ) : (
              `Purchase ${selectedPlan.charAt(0) + selectedPlan.slice(1).toLowerCase()} Plan`
            )}
          </Button>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 text-center shadow-md">
          <p className="text-sm text-gray-600">
            🔒 Secure payment • 💯 Money-back guarantee • 📞 24/7 Support
          </p>
        </div>
      </div>
    </div>
  );
}
