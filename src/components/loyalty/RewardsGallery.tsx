import React, { useState } from "react";
import { Gift, Star, ShoppingBag, Sparkles, X } from "lucide-react";
import { useCustomerRewards, useReward } from "../../services/queries";
import toast from "react-hot-toast";
import type { LoyaltyReward } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface RewardsGalleryProps {
  customerId: number;
  customerPoints: number;
  onRewardRedeemed?: () => void;
}

const RewardsGallery: React.FC<RewardsGalleryProps> = ({
  customerId,
  customerPoints,
  onRewardRedeemed,
}) => {
  const { data: rewards = [], isLoading: loading } =
    useCustomerRewards(customerId);
  const useRewardMutation = useReward();
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(
    null,
  );
  const { settings } = useSettings();

  const handleUseReward = async (reward: LoyaltyReward) => {
    if (useRewardMutation.isPending) return;

    try {
      await useRewardMutation.mutateAsync(reward.id);
      toast.success(`Reward "${reward.description}" activated successfully!`);
      setSelectedReward(null);
      onRewardRedeemed?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to use reward");
      console.error("Error using reward:", err);
    }
  };

  const availableRewards = rewards.filter((r: LoyaltyReward) => !r.redeemedAt);
  const usedRewards = rewards.filter((r: LoyaltyReward) => r.redeemedAt);
  const expiredRewards = rewards.filter((r: LoyaltyReward) => {
    if (!r.expiresAt) return false;
    return new Date(r.expiresAt) < new Date() && !r.redeemedAt;
  });

  const getRewardIcon = (type: string) => {
    const icons: Record<string, any> = {
      DISCOUNT: Star,
      FREE_PRODUCT: Gift,
      STORE_CREDIT: ShoppingBag,
      SPECIAL_OFFER: Sparkles,
    };
    const Icon = icons[type] || Gift;
    return Icon;
  };

  const getRewardColor = (type: string) => {
    const colors: Record<string, string> = {
      DISCOUNT: "from-yellow-400 to-orange-500",
      FREE_PRODUCT: "from-green-400 to-emerald-500",
      STORE_CREDIT: "from-blue-400 to-indigo-500",
      SPECIAL_OFFER: "from-purple-400 to-pink-500",
    };
    return colors[type] || "from-gray-400 to-gray-500";
  };

  const formatRewardValue = (reward: LoyaltyReward) => {
    if (reward.rewardType === "DISCOUNT") {
      return `${reward.rewardValue}% OFF`;
    } else if (reward.rewardType === "STORE_CREDIT") {
      return `${formatCurrency(reward.rewardValue, settings)} Credit`;
    }
    return reward.description;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Loading rewards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Your Rewards</h2>
          <div className="text-sm text-gray-600">
            Available Points:{" "}
            <span className="font-bold text-blue-600">
              {customerPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Available Rewards */}
        {availableRewards.length > 0 ? (
          <>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Available to Use
            </h3>
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableRewards.map((reward: LoyaltyReward) => {
                const Icon = getRewardIcon(reward.rewardType);
                const gradient = getRewardColor(reward.rewardType);

                return (
                  <div
                    key={reward.id}
                    className="relative overflow-hidden rounded-lg border-2 border-gray-200 transition-all hover:border-blue-400 hover:shadow-lg"
                  >
                    {/* Gradient Header */}
                    <div
                      className={`bg-gradient-to-r ${gradient} p-4 text-white`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Icon className="h-8 w-8" />
                        <span className="rounded bg-white bg-opacity-20 px-2 py-1 text-xs font-medium">
                          {reward.pointsCost} pts
                        </span>
                      </div>
                      <h4 className="text-lg font-bold">
                        {formatRewardValue(reward)}
                      </h4>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="mb-4 text-sm text-gray-600">
                        {reward.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {reward.expiresAt && (
                            <span>
                              Expires:{" "}
                              {new Date(reward.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedReward(reward)}
                          className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                        >
                          Use Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="mb-8 rounded-lg bg-gray-50 py-12 text-center">
            <Gift className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="mb-2 text-lg font-medium text-gray-600">
              No rewards available yet
            </p>
            <p className="text-sm text-gray-500">
              Keep earning points to unlock exciting rewards!
            </p>
          </div>
        )}

        {/* Used Rewards */}
        {usedRewards.length > 0 && (
          <>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Used Rewards
            </h3>
            <div className="mb-6 space-y-2">
              {usedRewards.map((reward: LoyaltyReward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-gray-200 p-2">
                      {React.createElement(getRewardIcon(reward.rewardType), {
                        className: "w-5 h-5 text-gray-600",
                      })}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {reward.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        Used:{" "}
                        {reward.redeemedAt
                          ? new Date(reward.redeemedAt).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    USED
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Expired Rewards */}
        {expiredRewards.length > 0 && (
          <>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Expired Rewards
            </h3>
            <div className="space-y-2">
              {expiredRewards.map((reward: LoyaltyReward) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between rounded border border-red-200 bg-red-50 p-3 opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-red-200 p-2">
                      {React.createElement(getRewardIcon(reward.rewardType), {
                        className: "w-5 h-5 text-red-600",
                      })}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {reward.description}
                      </div>
                      <div className="text-xs text-red-600">
                        Expired:{" "}
                        {reward.expiresAt
                          ? new Date(reward.expiresAt).toLocaleDateString()
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-red-600">
                    EXPIRED
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Use Reward</h3>
              <button
                onClick={() => setSelectedReward(null)}
                className="text-gray-400 hover:text-gray-600"
                disabled={useRewardMutation.isPending}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div
              className={`bg-gradient-to-r ${getRewardColor(selectedReward.rewardType)} mb-4 rounded-lg p-6 text-white`}
            >
              <div className="mb-3 flex items-center gap-3">
                {React.createElement(getRewardIcon(selectedReward.rewardType), {
                  className: "w-10 h-10",
                })}
                <div>
                  <div className="text-2xl font-bold">
                    {formatRewardValue(selectedReward)}
                  </div>
                  <div className="text-sm opacity-90">
                    {selectedReward.pointsCost} points
                  </div>
                </div>
              </div>
              <p className="text-sm opacity-90">{selectedReward.description}</p>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm text-gray-600">
                Are you sure you want to use this reward? This action cannot be
                undone.
              </p>
              {selectedReward.expiresAt && (
                <p className="text-xs text-red-600">
                  Expires:{" "}
                  {new Date(selectedReward.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedReward(null)}
                disabled={useRewardMutation.isPending}
                className="flex-1 rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUseReward(selectedReward)}
                disabled={useRewardMutation.isPending}
                className="flex-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {useRewardMutation.isPending ? "Using..." : "Confirm Use"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsGallery;
