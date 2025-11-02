import { Input } from "../common/Input";

interface AlertsTabProps {
  settings: any;
  saving: boolean;
  handleSwitchChange: (field: string, value: boolean) => void;
  handleNumberFieldChange: (
    field: string,
    e: React.FocusEvent<HTMLInputElement>,
    min?: number,
    max?: number,
  ) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const alertTypes = [
  {
    key: "enableLowStockAlerts",
    thresholdKey: "lowStockThreshold",
    label: "Low Stock",
    description: "Notify when inventory is low",
    min: 1,
    max: 1000,
    unit: "qty",
  },
  {
    key: "enableHighStockAlerts",
    thresholdKey: "highStockThreshold",
    label: "High Stock",
    description: "Notify when inventory is too high",
    min: 10,
    max: 10000,
    unit: "qty",
  },
  {
    key: "enableProductExpiryAlerts",
    thresholdKey: "productExpiryDays",
    label: "Product Expiry",
    description: "Notify when products are near expiry",
    min: 1,
    max: 365,
    unit: "days",
  },
  {
    key: "dailySalesTargetAlertEnabled",
    thresholdKey: "dailySalesTargetAmount",
    label: "Daily Sales Target",
    description: "Notify when daily sales target is reached",
    min: 1,
    unit: "amount",
  },
  {
    key: "priceChangeAlertEnabled",
    label: "Price Change",
    description: "Notify when a product price is changed",
  },
  {
    key: "inactiveProductAlertEnabled",
    thresholdKey: "inactiveProductDays",
    label: "Inactive Product",
    description: "Notify if a product has not sold for X days",
    min: 1,
    max: 365,
    unit: "days",
  },
  {
    key: "lowBalanceAlertEnabled",
    thresholdKey: "lowBalanceThreshold",
    label: "Low Balance",
    description: "Notify when cash drawer balance falls below threshold",
    min: 0,
    unit: "amount",
  },
  {
    key: "frequentRefundsAlertEnabled",
    thresholdKey: "frequentRefundsThreshold",
    label: "Frequent Refunds",
    description: "Notify if refunds exceed threshold in a day",
    min: 1,
    unit: "count",
  },
  {
    key: "supplierDeliveryAlertEnabled",
    thresholdKey: "expectedDeliveryDays",
    label: "Supplier Delivery",
    description: "Notify if supplier delivery is overdue",
    min: 1,
    max: 60,
    unit: "days",
  },
  {
    key: "loyaltyPointsExpiryAlertEnabled",
    thresholdKey: "loyaltyPointsExpiryDays",
    label: "Loyalty Points Expiry",
    description: "Notify customers before their loyalty points expire",
    min: 1,
    unit: "days",
  },
  {
    key: "systemErrorAlertEnabled",
    label: "System Error/Failure",
    description: "Notify admins when a critical system error occurs",
  },
];

const AlertsTab: React.FC<AlertsTabProps> = ({
  settings,
  saving,
  handleSwitchChange,
  handleNumberFieldChange,
  handleSelectChange,
}) => {
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🔔 Alerts & Notifications
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure system alerts and notification preferences
        </p>
      </div>
      <div className="space-y-4 p-6">
        {alertTypes.map((alert) => (
          <div
            key={alert.key}
            className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{alert.label}</span>
                <p className="mt-1 text-sm text-gray-600">
                  {alert.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleSwitchChange(alert.key, !settings[alert.key])
                }
                disabled={saving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  settings[alert.key] ? "bg-blue-600" : "bg-gray-200"
                }`}
                role="switch"
                aria-checked={!!settings[alert.key]}
                id={alert.key}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    settings[alert.key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {alert.thresholdKey &&
              typeof settings[alert.thresholdKey] !== "undefined" && (
                <Input
                  type="number"
                  id={alert.thresholdKey}
                  min={alert.min || 0}
                  max={alert.max}
                  step={1}
                  defaultValue={settings[alert.thresholdKey]}
                  onBlur={(e) =>
                    handleNumberFieldChange(
                      alert.thresholdKey,
                      e,
                      alert.min,
                      alert.max,
                    )
                  }
                  disabled={saving || !settings[alert.key]}
                  fullWidth
                  className="mt-2"
                  placeholder={
                    alert.unit ? `Enter value (${alert.unit})` : "Enter value"
                  }
                />
              )}
          </div>
        ))}
        <div className="col-span-2">
          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Alert System
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Enable or disable alerts for important events. Thresholds
                    can be set for each alert type.
                  </p>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    {alertTypes.map((alert) => (
                      <li key={alert.key}>
                        <strong>{alert.label}:</strong> {alert.description}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    You will receive notifications in-app and via email (if
                    configured) when an alert is triggered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsTab;
