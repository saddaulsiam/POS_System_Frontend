import React from "react";

interface ReceiptTabProps {
  settings: any;
  saving: boolean;
  handleToggle: (field: string, value: boolean) => void;
  handleTextFieldChange: (
    field: string,
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const ReceiptTab: React.FC<ReceiptTabProps> = ({
  settings,
  saving,
  handleToggle,
  handleTextFieldChange,
}) => {
  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🧾 Receipt Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure receipt printing options
        </p>
      </div>
      <div className="space-y-6 p-6">
        {/* Receipt Toggles */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <h4 className="font-medium text-gray-900">Auto-Print Receipt</h4>
              <p className="text-sm text-gray-500">
                Automatically print after sale
              </p>
            </div>
            <button
              onClick={() =>
                handleToggle("printReceiptAuto", !settings.printReceiptAuto)
              }
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                settings.printReceiptAuto ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  settings.printReceiptAuto ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          {/* Auto-Email Receipt option removed */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div>
              <h4 className="font-medium text-gray-900">
                Auto-Print Thermal Receipt
              </h4>
              <p className="text-sm text-gray-500">
                Automatically print thermal receipt after sale
              </p>
            </div>
            <button
              onClick={() =>
                handleToggle("autoPrintThermal", !settings.autoPrintThermal)
              }
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                settings.autoPrintThermal ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  settings.autoPrintThermal ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            <strong>Which option should I enable?</strong>
            <br />
            <ul className="mb-1 mt-1 list-inside list-disc">
              <li>
                <strong>Auto-Print Receipt</strong>: Enable if you use a regular
                (A4/Letter) printer for full-page receipts.
              </li>
              <li>
                <strong>Auto-Print Thermal Receipt</strong>: Enable if you use a
                thermal receipt printer (80mm/58mm) for narrow, text-based
                receipts.
              </li>
              <li>
                <strong>Both</strong>: Enable both only if you want both
                receipts to print automatically after each sale.
              </li>
            </ul>
            Most users only need to enable the one that matches their printer.
          </p>
        </div>
        {/* Receipt Footer */}
        <div>
          <label
            htmlFor="receiptFooter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Receipt Footer Text
          </label>
          <textarea
            id="receiptFooter"
            rows={3}
            defaultValue={settings.receiptFooterText || ""}
            onBlur={(e) => handleTextFieldChange("receiptFooterText", e)}
            disabled={saving}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Thank you for shopping with us!"
          />
          <p className="mt-1 text-sm text-gray-500">
            Displayed at the bottom of printed receipts
          </p>
        </div>
        {/* Return Policy */}
        <div>
          <label
            htmlFor="returnPolicy"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Return Policy Text (Optional)
          </label>
          <textarea
            id="returnPolicy"
            rows={3}
            defaultValue={settings.returnPolicy || ""}
            onBlur={(e) => handleTextFieldChange("returnPolicy", e)}
            disabled={saving}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Returns accepted within 30 days with receipt"
          />
          <p className="mt-1 text-sm text-gray-500">
            Return policy displayed on receipts
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTab;
