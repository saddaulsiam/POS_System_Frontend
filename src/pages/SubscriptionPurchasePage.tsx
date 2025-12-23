import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/common";
import { useSubscription } from "../context/SubscriptionContext";
import { subscriptionAPI } from "../services/subscriptionAPI";
import { POSHeader } from "../components/pos";
import { useAuth, useSettings } from "../context";

export default function SubscriptionPurchasePage() {
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { refetch } = useSubscription();
  const [searchParams] = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">(
    "YEARLY",
  );
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: "success" | "failed" | "cancelled" | "error" | null;
    message: string;
    transactionId?: string;
  }>({ type: null, message: "" });

  // Handle payment callback from SSL Commerz
  useEffect(() => {
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    const transaction = searchParams.get("transaction");
    const transactionId = searchParams.get("transactionId");

    if (status === "success") {
      setPaymentStatus({
        type: "success",
        message: "Payment successful! Your subscription is now active.",
        transactionId: transaction || transactionId || "",
      });
      toast.success("Payment successful! Your subscription is now active.");
      refetch(); // Refresh subscription data
      setTimeout(() => navigate("/settings?tab=subscription"), 3000);
    } else if (status === "failed") {
      setPaymentStatus({
        type: "failed",
        message: message || "Payment failed. Please try again.",
      });
      toast.error(message || "Payment failed. Please try again.");
    } else if (status === "cancelled") {
      setPaymentStatus({
        type: "cancelled",
        message: "Payment was cancelled. You can try again anytime.",
      });
      toast.error("Payment was cancelled.");
    } else if (status === "error") {
      setPaymentStatus({
        type: "error",
        message: message || "Payment processing failed. Please try again.",
      });
      toast.error(message || "Payment processing failed.");
    }

    // Clear URL parameters after 5 seconds
    if (status) {
      setTimeout(() => {
        window.history.replaceState({}, "", "/subscription");
        setPaymentStatus({ type: null, message: "" });
      }, 10000);
    }
  }, [searchParams, navigate, refetch]);

  // --- Configuration & Pricing Logic ---
  const isYearly = billingCycle === "YEARLY";
  const price = isYearly ? 59 : 79;
  const yearlyBillAmount = 708;
  const yearlySavings = 240;

  const features = [
    {
      name: "Unlimited Products & Inventory",
      description: "Track stock in real-time",
    },
    {
      name: "Cashier & Manager Accounts",
      description: "Secure role-based access",
    },
    {
      name: "Advanced Sales Reports",
      description: "Daily, weekly & monthly insights",
    },
    {
      name: "Customer Loyalty Program",
      description: "Built-in points system",
    },
    {
      name: "Receipt Customization",
      description: "Add your logo and footer",
    },
    {
      name: "24/7 Priority Support",
      description: "Phone, chat, and email",
    },
  ];

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // Validate user is logged in
      if (!user) {
        toast.error("Please login to continue");
        setLoading(false);
        navigate("/login");
        return;
      }

      // Validate user information
      if (!user.name || !user.email || !user.phone) {
        toast.error(
          "Please complete your profile before purchasing. Add your name, email, and phone number in profile settings.",
        );
        setLoading(false);
        navigate("/settings?tab=profile");
        return;
      }

      // Prepare payment data
      const paymentData = {
        plan: billingCycle,
        amount: isYearly ? yearlyBillAmount : price,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
        platform: (window.electron ? "electron" : "web") as "electron" | "web", // Detect if running in Electron
      };

      // Initiate payment with SSL Commerz
      const response = await subscriptionAPI.initiatePayment(paymentData);

      // Redirect to SSL Commerz payment gateway
      if (response.gatewayUrl) {
        window.location.href = response.gatewayUrl;
      } else {
        toast.error("Failed to initiate payment. Please try again.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment",
      );
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <POSHeader
        storeName={settings?.storeName}
        user={user || undefined}
        onLogout={logout}
      />

      {/* --- Ambient Background Effects --- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] -top-[20%] h-[800px] w-[800px] rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/30 mix-blend-multiply blur-3xl filter" />
        <div className="absolute -right-[10%] top-[10%] h-[700px] w-[700px] rounded-full bg-gradient-to-bl from-indigo-200/40 to-purple-200/30 mix-blend-multiply blur-3xl filter" />
        <div className="absolute bottom-[10%] left-[20%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-purple-200/30 to-pink-200/20 mix-blend-multiply blur-3xl filter" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* --- Payment Status Alert --- */}
        {paymentStatus.type && (
          <div className="mx-auto mb-8 max-w-3xl">
            <div
              className={`rounded-lg border-2 p-6 shadow-lg ${
                paymentStatus.type === "success"
                  ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                  : paymentStatus.type === "cancelled"
                    ? "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
                    : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 rounded-full p-2 ${
                    paymentStatus.type === "success"
                      ? "bg-green-100"
                      : paymentStatus.type === "cancelled"
                        ? "bg-yellow-100"
                        : "bg-red-100"
                  }`}
                >
                  {paymentStatus.type === "success" ? (
                    <svg
                      className="h-6 w-6 text-green-600"
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
                  ) : paymentStatus.type === "cancelled" ? (
                    <svg
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      paymentStatus.type === "success"
                        ? "text-green-900"
                        : paymentStatus.type === "cancelled"
                          ? "text-yellow-900"
                          : "text-red-900"
                    }`}
                  >
                    {paymentStatus.type === "success"
                      ? "Payment Successful!"
                      : paymentStatus.type === "cancelled"
                        ? "Payment Cancelled"
                        : "Payment Failed"}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      paymentStatus.type === "success"
                        ? "text-green-700"
                        : paymentStatus.type === "cancelled"
                          ? "text-yellow-700"
                          : "text-red-700"
                    }`}
                  >
                    {paymentStatus.message}
                  </p>
                  {paymentStatus.transactionId && (
                    <p
                      className={`mt-2 font-mono text-xs ${
                        paymentStatus.type === "success"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      Transaction ID: {paymentStatus.transactionId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Header Section --- */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-1.5 shadow-sm ring-1 ring-inset ring-blue-700/10 backdrop-blur-sm">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-700">
              Start your 7-day free trial
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Simple pricing,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              powerful features.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Everything you need to manage your store, inventory, and customers
            in one place. No hidden fees, no surprises.
          </p>
        </div>

        {/* --- Toggle Switch --- */}
        <div className="mb-8 flex justify-center">
          <div className="relative inline-flex items-center rounded-full bg-white p-1 shadow-md shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm">
            {/* Sliding Background Pill */}
            <div
              className={`absolute bottom-1 top-1 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 shadow-md transition-all duration-300 ease-out ${
                isYearly
                  ? "left-[calc(50%)] right-1"
                  : "left-1 right-[calc(50%)]"
              }`}
            />

            <button
              onClick={() => setBillingCycle("MONTHLY")}
              className={`relative z-10 flex w-32 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                !isYearly ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("YEARLY")}
              className={`relative z-10 flex w-36 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isYearly ? "text-white" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Yearly
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide transition-colors duration-200 ${
                  isYearly
                    ? "bg-white/20 text-white ring-1 ring-white/30"
                    : "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 ring-1 ring-green-200"
                }`}
              >
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* --- Pricing Card --- */}
        <div className="group overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-slate-900/15">
          <div className="grid lg:grid-cols-5">
            {/* Left Side: Pricing & Action (3/5 width) */}
            <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">
                    Pro License
                  </h3>
                  {isYearly && (
                    <span className="animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-blue-500/30">
                      Best Value
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-6xl font-black tracking-tight text-transparent">
                    ${price}
                  </span>
                  <span className="text-xl font-bold text-slate-500">/mo</span>
                </div>

                <div className="mt-3 space-y-2">
                  {isYearly ? (
                    <>
                      <p className="text-sm font-semibold text-slate-700">
                        Billed{" "}
                        <span className="font-black text-slate-900">
                          ${yearlyBillAmount}
                        </span>{" "}
                        yearly
                      </p>
                      <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 px-2.5 py-1 ring-1 ring-green-200/50">
                        <svg
                          className="h-4 w-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-bold text-green-700">
                          You save ${yearlySavings} a year!
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-600">
                      Standard monthly billing. Cancel anytime.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <Button
                  fullWidth
                  variant="primary"
                  onClick={handlePurchase}
                  disabled={loading}
                  className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-base font-bold text-white shadow-2xl shadow-blue-500/30 ring-1 ring-blue-400/20 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get Started with {isYearly ? "Yearly" : "Monthly"}
                        <svg
                          className="h-5 w-5 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </span>
                </Button>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure Payment</span>
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="h-4 w-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Cancel Anytime</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Features List (2/5 width) */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 lg:col-span-2 lg:border-l lg:border-slate-200/50 lg:p-10">
              <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">
                What's included
              </h4>
              <ul className="mt-6 space-y-5">
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="group flex items-start gap-4 transition-all duration-200 hover:translate-x-1"
                  >
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30 ring-2 ring-green-100 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/40">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                        {feature.name}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- Trust Footer (Payment Gateway & Security Badges) --- */}
        <div className="mx-auto mt-12 max-w-5xl space-y-8 border-t border-slate-200 pt-10">
          {/* Payment Gateway Section */}
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-1.5 shadow-sm ring-1 ring-inset ring-green-600/20 backdrop-blur-sm">
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-green-700">
                Secure Payment Processing
              </span>
            </div>
            <h3 className="mb-4 text-3xl font-bold text-slate-900">
              Powered by SSL Commerz
            </h3>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-600">
              Your payment information is encrypted and secure. We support all
              major payment methods in Bangladesh.
            </p>
            <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-lg shadow-slate-900/5 ring-1 ring-slate-200/50">
              <img
                src="https://res.cloudinary.com/dtkl4ic8s/image/upload/v1765388870/srije6e3lucgl7wdmxxm.png"
                alt="SSL Commerz - Visa, Mastercard, American Express, bKash, Nagad, Rocket"
                className="h-44 w-full object-contain"
              />
            </div>
          </div>

          {/* Trust Badges Grid */}
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Global Support */}
            <div className="group flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-lg shadow-slate-900/5 ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 hover:ring-slate-300">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-blue-500/50">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </div>
              <h4 className="mb-1 text-sm font-bold text-slate-900">
                24/7 Support
              </h4>
              <p className="text-xs leading-relaxed text-slate-600">
                Expert help whenever you need it
              </p>
            </div>

            {/* SSL Encrypted */}
            <div className="group flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-lg shadow-slate-900/5 ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 hover:ring-slate-300">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-green-500/50">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
              </div>
              <h4 className="mb-1 text-sm font-bold text-slate-900">
                SSL Encrypted
              </h4>
              <p className="text-xs leading-relaxed text-slate-600">
                Bank-level security standards
              </p>
            </div>

            {/* Money Back Guarantee */}
            <div className="group flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-lg shadow-slate-900/5 ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 hover:ring-slate-300">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-purple-500/50">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h4 className="mb-1 text-sm font-bold text-slate-900">
                30-Day Guarantee
              </h4>
              <p className="text-xs leading-relaxed text-slate-600">
                Full refund if not satisfied
              </p>
            </div>
          </div>

          {/* Fine Print */}
          <p className="text-center text-sm text-slate-500">
            By subscribing, you agree to our{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-700/50"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="font-semibold text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition-colors hover:text-blue-700 hover:decoration-blue-700/50"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
