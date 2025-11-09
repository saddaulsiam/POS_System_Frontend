import React, { useState } from "react";
import { Gift, AlertCircle, X } from "lucide-react";
import { useRedeemPoints } from "../../services/queries";
import toast from "react-hot-toast";
import type { RewardType } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface RedeemPointsDialogProps {
  customerId: number;
  customerName: string;
  availablePoints: number;
  cartTotal: number;
  isOpen: boolean;
  onClose: () => void;
  onRedeemed: (discountAmount: number, pointsUsed: number) => void;
}

interface RedemptionOption {
  type: RewardType;
  label: string;
  description: string;
  pointsRequired: number;
  value: number;
  icon: string;
}

const RedeemPointsDialog: React.FC<RedeemPointsDialogProps> = ({
  customerId,
  customerName,
  availablePoints,
  cartTotal,
  isOpen,
  onClose,
  onRedeemed,
}) => {
  const [selectedOption, setSelectedOption] = useState<RedemptionOption | null>(
    null,
  );
  const [customPoints, setCustomPoints] = useState<string>("");
  const redeemPointsMutation = useRedeemPoints();
  const { settings } = useSettings();

  if (!isOpen) return null;

  // Get redemption rate from settings (default: 100 points = 1 currency unit)
  const pointsToMoneyRate = settings?.pointsRedemptionRate || 100;

  const predefinedOptions: RedemptionOption[] = [
    {
      type: "DISCOUNT",
      label: `${formatCurrency(5, settings)} Discount`,
      description: `Get ${formatCurrency(5, settings)} off your purchase`,
      pointsRequired: Math.round(5 * pointsToMoneyRate),
      value: 5,
      icon: "💵",
    },
    {
      type: "DISCOUNT",
      label: `${formatCurrency(10, settings)} Discount`,
      description: `Get ${formatCurrency(10, settings)} off your purchase`,
      pointsRequired: Math.round(10 * pointsToMoneyRate),
      value: 10,
      icon: "💰",
    },
    {
      type: "DISCOUNT",
      label: `${formatCurrency(20, settings)} Discount`,
      description: `Get ${formatCurrency(20, settings)} off your purchase`,
      pointsRequired: Math.round(20 * pointsToMoneyRate),
      value: 20,
      icon: "🎁",
    },
    {
      type: "STORE_CREDIT",
      label: `${formatCurrency(50, settings)} Store Credit`,
      description: "Convert to store credit for future use",
      pointsRequired: Math.round(50 * pointsToMoneyRate),
      value: 50,
      icon: "🏪",
    },
  ];

  const calculateCustomDiscount = (points: number) => {
    return points / pointsToMoneyRate;
  };

  const handleRedeem = async () => {
    if (!selectedOption && !customPoints) {
      toast.error("Please select a redemption option");
      return;
    }

    const pointsToRedeem = selectedOption
      ? selectedOption.pointsRequired
      : parseInt(customPoints);
    const discountValue = selectedOption
      ? selectedOption.value
      : calculateCustomDiscount(pointsToRedeem);
    const rewardType = selectedOption ? selectedOption.type : "DISCOUNT";

    if (pointsToRedeem > availablePoints) {
      toast.error("Insufficient points");
      return;
    }

    if (rewardType === "DISCOUNT" && discountValue > cartTotal) {
      toast.error("Discount cannot exceed cart total");
      return;
    }

    try {
      await redeemPointsMutation.mutateAsync({
        customerId,
        points: pointsToRedeem,
        rewardType,
        rewardValue: discountValue,
        description: selectedOption
          ? selectedOption.label
          : `Custom redemption: ${pointsToRedeem} points for ${formatCurrency(discountValue, settings)}`,
      });

      toast.success(`Successfully redeemed ${pointsToRedeem} points!`);
      onRedeemed(discountValue, pointsToRedeem);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to redeem points");
      console.error("Error redeemPointsMutation.isPending points:", err);
    }
  };

  const customPointsValue = customPoints ? parseInt(customPoints) : 0;
  const customDiscount = calculateCustomDiscount(customPointsValue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <Gift className="h-7 w-7 text-blue-500" />
              Redeem Points
            </h2>
            <p className="mt-1 text-sm text-gray-600">{customerName}</p>
          </div>
          <button
            onClick={onClose}
            disabled={redeemPointsMutation.isPending}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Points Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-blue-200 bg-white p-4">
              <div className="mb-1 text-xs text-gray-600">Available Points</div>
              <div className="text-2xl font-bold text-blue-600">
                {availablePoints.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                ={" "}
                {formatCurrency(
                  calculateCustomDiscount(availablePoints),
                  settings,
                )}{" "}
                value
              </div>
            </div>
            <div className="rounded-lg border border-green-200 bg-white p-4">
              <div className="mb-1 text-xs text-gray-600">Cart Total</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(cartTotal, settings)}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Current purchase amount
              </div>
            </div>
          </div>
        </div>

        {/* Redemption Options */}
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Select Redemption Option
          </h3>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {predefinedOptions.map((option) => {
              const canAfford = availablePoints >= option.pointsRequired;
              const isSelected =
                selectedOption?.pointsRequired === option.pointsRequired;

              return (
                <button
                  key={option.label}
                  onClick={() => {
                    setSelectedOption(option);
                    setCustomPoints("");
                  }}
                  disabled={!canAfford || redeemPointsMutation.isPending}
                  className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : canAfford
                        ? "border-gray-200 bg-white hover:border-blue-300"
                        : "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}

                  <div className="mb-2 text-3xl">{option.icon}</div>
                  <div className="mb-1 font-bold text-gray-800">
                    {option.label}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    {option.description}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={
                        canAfford
                          ? "font-semibold text-blue-600"
                          : "font-semibold text-red-600"
                      }
                    >
                      {option.pointsRequired} points
                    </span>
                    {!canAfford && (
                      <span className="text-red-600">
                        Need {option.pointsRequired - availablePoints} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Redemption */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md mb-3 font-semibold text-gray-800">
              Custom Redemption
            </h4>
            <div className="rounded-lg bg-gray-50 p-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Enter points to redeem ({pointsToMoneyRate} points ={" "}
                {formatCurrency(1, settings)})
              </label>

              {/* Quick Amount Buttons */}
              <div className="mb-4">
                <p className="mb-2 text-xs text-gray-600">Quick amounts:</p>
                <div className="grid grid-cols-5 gap-2">
                  {[50, 100, 200, 500].map((amount) => {
                    const pointsNeeded = Math.round(amount * pointsToMoneyRate);
                    const canAfford = availablePoints >= pointsNeeded;
                    const exceedsCart = amount > cartTotal && cartTotal > 0;
                    const isDisabled =
                      !canAfford ||
                      exceedsCart ||
                      redeemPointsMutation.isPending;

                    return (
                      <button
                        key={amount}
                        onClick={() => {
                          setCustomPoints(pointsNeeded.toString());
                          setSelectedOption(null);
                        }}
                        disabled={isDisabled}
                        className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all ${
                          customPointsValue === pointsNeeded
                            ? "border-blue-500 bg-blue-500 text-white"
                            : isDisabled
                              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                              : "border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                        title={
                          !canAfford
                            ? `Need ${pointsNeeded - availablePoints} more points`
                            : exceedsCart
                              ? "Exceeds cart total"
                              : `${pointsNeeded} points`
                        }
                      >
                        {formatCurrency(amount, settings)}
                      </button>
                    );
                  })}
                  {/* Max Button */}
                  <button
                    onClick={() => {
                      const maxDiscount = Math.min(
                        calculateCustomDiscount(availablePoints),
                        cartTotal || calculateCustomDiscount(availablePoints),
                      );
                      const maxPoints = Math.round(
                        maxDiscount * pointsToMoneyRate,
                      );
                      setCustomPoints(maxPoints.toString());
                      setSelectedOption(null);
                    }}
                    disabled={
                      availablePoints === 0 || redeemPointsMutation.isPending
                    }
                    className={`rounded-lg border-2 px-3 py-2 text-sm font-bold transition-all ${
                      availablePoints === 0 || redeemPointsMutation.isPending
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                        : "border-green-500 bg-white text-green-700 hover:bg-green-500 hover:text-white"
                    }`}
                    title="Use maximum available points"
                  >
                    Max
                  </button>
                </div>
              </div>

              <input
                type="number"
                min="100"
                step="100"
                max={availablePoints}
                value={customPoints}
                onChange={(e) => {
                  setCustomPoints(e.target.value);
                  setSelectedOption(null);
                }}
                disabled={redeemPointsMutation.isPending}
                placeholder="e.g., 500"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {customPointsValue > 0 && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Discount Value:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(customDiscount, settings)}
                  </span>
                </div>
              )}
              {customPointsValue > availablePoints && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Insufficient points</span>
                </div>
              )}
              {customDiscount > cartTotal && cartTotal > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Discount cannot exceed cart total</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-6 rounded border-l-4 border-blue-500 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Redeemed points will be deducted from your
              balance and applied as a discount to this purchase. This action
              cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 bg-gray-50 p-6">
          <button
            onClick={onClose}
            disabled={redeemPointsMutation.isPending}
            className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRedeem}
            disabled={
              redeemPointsMutation.isPending ||
              (!selectedOption && !customPoints) ||
              (customPointsValue > 0 && customPointsValue > availablePoints) ||
              (!!selectedOption &&
                selectedOption.pointsRequired > availablePoints)
            }
            className="flex-1 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {redeemPointsMutation.isPending
              ? "redeemPointsMutation.isPending..."
              : "Redeem Points"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemPointsDialog;
