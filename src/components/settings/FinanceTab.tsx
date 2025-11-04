import { Input, Select } from "../common/Input";

interface FinanceTabProps {
  settings: any;
  saving: boolean;
  handleNumberFieldChange: (
    field: string,
    e: React.FocusEvent<HTMLInputElement>,
    min?: number,
    max?: number,
  ) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const FinanceTab: React.FC<FinanceTabProps> = ({
  settings,
  saving,
  handleNumberFieldChange,
  handleSelectChange,
}) => {
  const getCurrencyConfig = (code: string) => {
    switch (code) {
      case "USD":
        return {
          symbol: "$",
          symbolPosition: "before",
          name: "USD - US Dollar",
        };
      case "BDT":
        return {
          symbol: "৳",
          symbolPosition: "before",
          name: "BDT - Bangladeshi Taka",
        };
      case "EUR":
        return { symbol: "€", symbolPosition: "after", name: "EUR - Euro" };
      case "GBP":
        return {
          symbol: "£",
          symbolPosition: "before",
          name: "GBP - British Pound",
        };
      case "INR":
        return {
          symbol: "₹",
          symbolPosition: "before",
          name: "INR - Indian Rupee",
        };
      case "JPY":
        return {
          symbol: "¥",
          symbolPosition: "before",
          name: "JPY - Japanese Yen",
        };
      default:
        return { symbol: "$", symbolPosition: "before", name: code };
    }
  };
  const getCurrencyOptions = () => [
    { value: "USD", label: "USD - US Dollar ($)" },
    { value: "BDT", label: "BDT - Bangladeshi Taka (৳)" },
    { value: "EUR", label: "EUR - Euro (€)" },
    { value: "GBP", label: "GBP - British Pound (£)" },
    { value: "INR", label: "INR - Indian Rupee (₹)" },
    { value: "JPY", label: "JPY - Japanese Yen (¥)" },
  ];
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          💰 Tax & Currency
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure pricing and tax settings
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="taxRate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Default Tax Rate (%)
          </label>
          <Input
            type="number"
            id="taxRate"
            min={0}
            max={100}
            step={0.01}
            defaultValue={settings.taxRate}
            onBlur={(e) => handleNumberFieldChange("taxRate", e, 0, 100)}
            disabled={saving}
            fullWidth
            placeholder="0.00"
          />
          <p className="mt-1 text-sm text-gray-500">
            Applied to all products unless overridden
          </p>
        </div>
        <div>
          <label
            htmlFor="currencyCode"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Currency
          </label>
          <Select
            id="currencyCode"
            value={settings.currencyCode || "USD"}
            onChange={(e) => {
              const currencyCode = e.target.value;
              const config = getCurrencyConfig(currencyCode);
              handleSelectChange("currencyCode", currencyCode);
              handleSelectChange("currencySymbol", config.symbol);
              handleSelectChange("currencyPosition", config.symbolPosition);
            }}
            disabled={saving}
            fullWidth
            options={getCurrencyOptions()}
          />
          <p className="mt-1 text-sm text-gray-500">
            Preview: {getCurrencyConfig(settings.currencyCode).symbol}1,234.56
            {getCurrencyConfig(settings.currencyCode).symbolPosition ===
              "after" && getCurrencyConfig(settings.currencyCode).symbol}
          </p>
        </div>
        <div>
          <label
            htmlFor="loyaltyPointsPerUnit"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Loyalty Points Rate
          </label>
          <Input
            type="number"
            id="loyaltyPointsPerUnit"
            min={0.01}
            step={0.01}
            defaultValue={settings.loyaltyPointsPerUnit || 10}
            onBlur={(e) =>
              handleNumberFieldChange("loyaltyPointsPerUnit", e, 0.01, 10000)
            }
            disabled={saving || !settings.enableLoyaltyPoints}
            fullWidth
            placeholder="10.00"
          />
          <p className="mt-1 text-sm text-gray-500">
            1 point per {settings.loyaltyPointsPerUnit || 10}{" "}
            {getCurrencyConfig(settings.currencyCode).symbol} spent
            {!settings.enableLoyaltyPoints && " (Enable Loyalty Points first)"}
          </p>
        </div>
        <div>
          <label
            htmlFor="pointsRedemptionRate"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Points Redemption Rate
          </label>
          <Input
            type="number"
            id="pointsRedemptionRate"
            min={1}
            step={1}
            defaultValue={settings.pointsRedemptionRate || 100}
            onBlur={(e) =>
              handleNumberFieldChange("pointsRedemptionRate", e, 1, 10000)
            }
            disabled={saving || !settings.enableLoyaltyPoints}
            fullWidth
            placeholder="100"
          />
          <p className="mt-1 text-sm text-gray-500">
            {settings.pointsRedemptionRate || 100} points ={" "}
            {getCurrencyConfig(settings.currencyCode).symbol}1 discount
            {!settings.enableLoyaltyPoints && " (Enable Loyalty Points first)"}
          </p>
        </div>
        <div className="col-span-2">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-blue-400"
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
                <h3 className="text-sm font-medium text-blue-800">
                  Currency & Loyalty System
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Select your preferred currency from the dropdown. Each
                    currency includes:
                  </p>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    <li>
                      <strong>USD</strong> - US Dollar ($) with standard
                      formatting
                    </li>
                    <li>
                      <strong>BDT</strong> - Bangladeshi Taka (৳) with English
                      numerals
                    </li>
                    <li>
                      <strong>EUR, GBP, INR, JPY</strong> - Additional
                      currencies available
                    </li>
                  </ul>
                  <p className="mt-2">
                    The currency will be applied across all prices, reports, and
                    receipts in the system.
                  </p>
                  <p className="mt-2 font-medium">
                    <strong>Earning Points:</strong> Customers earn 1 point per{" "}
                    {settings.loyaltyPointsPerUnit || 10}{" "}
                    {getCurrencyConfig(settings.currencyCode).symbol} spent.
                  </p>
                  <p className="mt-1 font-medium">
                    <strong>Redeeming Points:</strong>{" "}
                    {settings.pointsRedemptionRate || 100} points ={" "}
                    {getCurrencyConfig(settings.currencyCode).symbol}1 discount.
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

export default FinanceTab;
