import React from "react";

interface FeatureToggle {
  key: string;
  title: string;
  description: string;
  icon: string;
  detailedInfo: any;
}

interface FeaturesTabProps {
  settings: any;
  saving: boolean;
  handleToggle: (key: string, value: boolean) => void;
  setSelectedFeature: (key: string | null) => void;
  setShowInfoModal: (show: boolean) => void;
  showInfoModal?: boolean;
  selectedFeature?: string | null;
}

const featureToggles: FeatureToggle[] = [
  {
    key: "enableQuickSale",
    title: "Quick Sale Buttons",
    description:
      "Enable quick access buttons for frequently sold products on POS",
    icon: "⚡",
    detailedInfo: {
      whatIs:
        "Quick Sale feature allows you to create customizable buttons for your most frequently sold products, providing instant access without searching.",
      howItWorks: [
        "Admin creates Quick Sale items from the Products page",
        "These items appear as buttons at the top of the POS interface",
        "Cashiers can add products to cart with a single click",
        "Ideal for fast-moving items like coffee, snacks, or common services",
      ],
      whenToUse:
        "Enable when you have high-volume, repeat products that need quick access",
      whenToDisable:
        "Disable during training periods or if your inventory changes frequently",
    },
  },
  {
    key: "enableSplitPayment",
    title: "Split Payment",
    description: "Allow customers to pay using multiple payment methods",
    icon: "💳",
    detailedInfo: {
      whatIs:
        "Split Payment allows customers to divide a single transaction across multiple payment methods (cash, card, mobile payment, etc.).",
      howItWorks: [
        "Customer selects 'Split Payment' option at checkout",
        "Cashier specifies amount for each payment method",
        "System validates that total matches transaction amount",
        "All payment methods are recorded in the sale record",
      ],
      whenToUse: "Enable when customers commonly use multiple payment methods",
      whenToDisable:
        "Disable if your store policy requires single payment method only",
    },
  },
  {
    key: "enableParkSale",
    title: "Park Sale",
    description: "Ability to temporarily save and resume transactions",
    icon: "📦",
    detailedInfo: {
      whatIs:
        "Park Sale allows cashiers to temporarily save incomplete transactions and resume them later, freeing up the POS for other customers.",
      howItWorks: [
        "Cashier adds items to cart but customer isn't ready to pay",
        "Click 'Park Sale' to save transaction with a name/reference",
        "Transaction is stored temporarily (24 hours by default)",
        "Resume parked sale anytime from 'Parked Sales' list",
        "Complete payment when customer returns",
      ],
      whenToUse:
        "Enable for high-traffic stores where customers may need to step aside",
      whenToDisable:
        "Disable if all transactions complete immediately or you want to prevent incomplete sales",
    },
  },
  {
    key: "enableCustomerSearch",
    title: "Customer Search",
    description:
      "Search and link customers to transactions for loyalty tracking",
    icon: "👤",
    detailedInfo: {
      whatIs:
        "Customer Search enables linking transactions to customer profiles for loyalty points, purchase history, and personalized service.",
      howItWorks: [
        "Cashier enters customer phone number in POS",
        "System finds matching customer profile",
        "Transaction is linked to customer account",
        "Loyalty points are automatically calculated and awarded",
        "Customer can redeem points for discounts",
      ],
      whenToUse:
        "Enable if you have a loyalty program or want to track customer purchases",
      whenToDisable:
        "Disable for anonymous-only sales or privacy-focused businesses",
    },
  },
  {
    key: "enableBarcodeScanner",
    title: "Barcode Scanner",
    description: "Enable barcode scanning functionality",
    icon: "📷",
    detailedInfo: {
      whatIs:
        "Barcode Scanner input allows using physical barcode scanners or manual barcode entry to quickly add products to cart.",
      howItWorks: [
        "Physical barcode scanner connected via USB acts as keyboard",
        "Scan product barcode - item automatically added to cart",
        "Manual entry: type barcode and press Enter",
        "Autocomplete suggestions appear as you type",
        "System finds product by barcode and adds to transaction",
      ],
      whenToUse:
        "Enable when using barcode scanners or products have barcode labels",
      whenToDisable:
        "Disable if you don't use barcodes or want to prevent accidental scans",
    },
  },
  {
    key: "enableLoyaltyPoints",
    title: "Loyalty Points",
    description: "Enable customer loyalty points and rewards system",
    icon: "🎁",
    detailedInfo: {
      whatIs:
        "Loyalty Points system rewards customers with points for purchases, which they can redeem for discounts on future transactions.",
      howItWorks: [
        "Customers earn points based on purchase amount (configured in Loyalty Admin)",
        "Points accumulate in customer profile",
        "Different tiers (Bronze, Silver, Gold) offer different benefits",
        "Customers can redeem points for discounts at checkout",
        "Birthday rewards and special promotions available",
      ],
      whenToUse:
        "Enable to encourage repeat customers and increase customer retention",
      whenToDisable:
        "Disable if not using loyalty program or during system maintenance",
    },
  },
];

const FeaturesTab: React.FC<FeaturesTabProps> = ({
  settings,
  saving,
  handleToggle,
  setSelectedFeature,
  setShowInfoModal,
  showInfoModal,
  selectedFeature,
}) => {
  return (
    <>
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            🎯 POS Feature Controls
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Enable or disable core point of sale features
          </p>
        </div>
        <div className="space-y-4 p-6">
          {featureToggles.map((feature) => (
            <div
              key={feature.key}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {feature.title}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedFeature(feature.key);
                        setShowInfoModal(true);
                      }}
                      className="text-blue-600 transition-colors hover:text-blue-800"
                      title="View detailed information"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleToggle(feature.key, !settings[feature.key])
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  settings[feature.key] ? "bg-blue-600" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={!!settings[feature.key]}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    settings[feature.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        {/* Info Box */}
        <div className="mx-6 mb-6 mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start">
            <svg
              className="mr-3 mt-0.5 h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Quick Tip</h4>
              <p className="mt-1 text-sm text-blue-700">
                Changes take effect immediately. Click the{" "}
                <strong>ℹ️ info icon</strong> next to each feature for detailed
                explanations.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Info Modal (moved from SettingsPage) */}
      {showInfoModal && selectedFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            {(() => {
              const feature = featureToggles.find(
                (f) => f.key === selectedFeature,
              );
              if (!feature) return null;
              return (
                <>
                  {/* Modal Header */}
                  <div className="sticky top-0 rounded-t-lg bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{feature.icon}</span>
                        <div>
                          <h2 className="text-2xl font-bold">
                            {feature.title}
                          </h2>
                          <p className="mt-1 text-sm text-blue-100">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowInfoModal(false);
                          setSelectedFeature(null);
                        }}
                        className="text-white transition-colors hover:text-gray-200"
                      >
                        <svg
                          className="h-6 w-6"
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
                      </button>
                    </div>
                  </div>
                  {/* Modal Content */}
                  <div className="space-y-6 p-6">
                    {/* What is it? */}
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <span className="text-blue-600">📘</span>
                        What is it?
                      </h3>
                      <p className="leading-relaxed text-gray-700">
                        {feature.detailedInfo.whatIs}
                      </p>
                    </div>
                    {/* How it works */}
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <span className="text-green-600">⚙️</span>
                        How it works
                      </h3>
                      <ol className="space-y-2">
                        {feature.detailedInfo.howItWorks.map(
                          (step: string, index: number) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                                {index + 1}
                              </span>
                              <span className="pt-0.5 text-gray-700">
                                {step}
                              </span>
                            </li>
                          ),
                        )}
                      </ol>
                    </div>
                    {/* When to use */}
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-green-900">
                        <span>✅</span>
                        When to Enable
                      </h3>
                      <p className="text-green-800">
                        {feature.detailedInfo.whenToUse}
                      </p>
                    </div>
                    {/* When to disable */}
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-orange-900">
                        <span>❌</span>
                        When to Disable
                      </h3>
                      <p className="text-orange-800">
                        {feature.detailedInfo.whenToDisable}
                      </p>
                    </div>
                  </div>
                  {/* Modal Footer */}
                  <div className="sticky bottom-0 rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <button
                      onClick={() => {
                        setShowInfoModal(false);
                        setSelectedFeature(null);
                      }}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Got it!
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturesTab;
