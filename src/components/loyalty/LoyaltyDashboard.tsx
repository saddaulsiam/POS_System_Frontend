import React from "react";
import { Trophy, TrendingUp, Gift, Star, Award, Zap } from "lucide-react";
import { useCustomerLoyalty } from "../../services/queries";
import { RefreshButton } from "../common";
import type { Customer, LoyaltyTier } from "../../types";

interface LoyaltyTierConfig {
  tier: LoyaltyTier;
  minimumPoints: number;
  pointsMultiplier: number;
  discountPercentage: number;
  birthdayBonus: number;
}

interface LoyaltyDashboardProps {
  customer: Customer;
  onRefresh?: () => void;
}

interface TierInfo {
  tier: LoyaltyTier;
  config: LoyaltyTierConfig;
}

interface CustomerLoyaltyData {
  currentPoints: number;
  lifetimePoints: number;
  currentTier: TierInfo;
  nextTier: TierInfo | null;
  pointsToNextTier: number;
  progressPercentage: number;
  availableRewards: number;
  pendingPoints: number;
}

const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({
  customer,
  onRefresh,
}) => {
  // Fetch loyalty data using React Query
  const {
    data: loyaltyResponse,
    isLoading: loading,
    error: errorObj,
    refetch,
  } = useCustomerLoyalty(customer.id);

  const processLoyaltyData = (): CustomerLoyaltyData | null => {
    if (!loyaltyResponse) return null;

    const currentPoints = loyaltyResponse.points?.current || 0;
    const lifetimePoints = loyaltyResponse.points?.lifetime || 0;
    const tierData = loyaltyResponse.tier || {};

    // Get tier minimums from tier order
    const tierMinimums: Record<string, number> = {
      BRONZE: 0,
      SILVER: 500,
      GOLD: 1500,
      PLATINUM: 3000,
    };

    const currentTierMin = tierMinimums[tierData.current] || 0;
    const nextTierMin = tierData.next
      ? tierData.next.minimumPoints
      : currentTierMin;

    // Calculate progress percentage
    // Progress is based on CURRENT AVAILABLE POINTS
    let progressPercentage = 100;
    let pointsToNextTier = 0;

    if (tierData.next) {
      // Use backend's calculated values if available
      if (
        tierData.next.progressPoints !== undefined &&
        tierData.next.totalPointsInTier !== undefined
      ) {
        // Backend provided relative progress values
        const pointsInCurrentTier = tierData.next.progressPoints;
        const pointsNeededForNextTier = tierData.next.totalPointsInTier;
        pointsToNextTier = tierData.next.pointsNeeded || 0;

        if (pointsNeededForNextTier > 0) {
          progressPercentage =
            (pointsInCurrentTier / pointsNeededForNextTier) * 100;
        }
      } else {
        // Fallback: calculate from current available points
        pointsToNextTier = Math.max(0, tierData.next.pointsNeeded || 0);
        const pointsInCurrentTier = Math.max(0, currentPoints - currentTierMin);
        const pointsNeededForNextTier = nextTierMin - currentTierMin;

        if (pointsNeededForNextTier > 0) {
          progressPercentage =
            (pointsInCurrentTier / pointsNeededForNextTier) * 100;
        }
      }
    }

    // Debug: Log parsed data
    console.log("Parsed Data:", {
      currentPoints,
      lifetimePoints,
      currentTier: tierData.current,
      currentTierMin,
      nextTier: tierData.next?.tier,
      nextTierMin,
      pointsToNextTier,
      pointsInCurrentTier: Math.max(0, currentPoints - currentTierMin),
      pointsNeededForNextTier: nextTierMin - currentTierMin,
      progressPercentage: progressPercentage.toFixed(2) + "%",
      backendPointsNeeded: tierData.next?.pointsNeeded,
      note: "Progress based on CURRENT POINTS, not lifetime",
    });

    return {
      currentPoints,
      lifetimePoints,
      currentTier: {
        tier: tierData.current as LoyaltyTier,
        config: {
          tier: tierData.current as LoyaltyTier,
          minimumPoints: currentTierMin,
          pointsMultiplier: tierData.multiplier || 1,
          discountPercentage: tierData.discountPercentage || 0,
          birthdayBonus: tierData.birthdayBonus || 0,
        } as LoyaltyTierConfig,
      },
      nextTier: tierData.next
        ? {
            tier: tierData.next.tier as LoyaltyTier,
            config: {
              tier: tierData.next.tier as LoyaltyTier,
              minimumPoints: nextTierMin,
              pointsMultiplier: 1,
              discountPercentage: 0,
              birthdayBonus: 0,
            } as LoyaltyTierConfig,
          }
        : null,
      pointsToNextTier: Math.max(0, pointsToNextTier),
      progressPercentage: Math.min(Math.max(progressPercentage, 0), 100),
      availableRewards: loyaltyResponse.activeRewards?.length || 0,
      pendingPoints: 0,
    };
  };

  const loyaltyData = processLoyaltyData();
  const error = errorObj?.message || null;

  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      BRONZE: "text-orange-700 bg-orange-100 border-orange-300",
      SILVER: "text-gray-700 bg-gray-100 border-gray-300",
      GOLD: "text-yellow-700 bg-yellow-100 border-yellow-300",
      PLATINUM: "text-purple-700 bg-purple-100 border-purple-300",
    };
    return colors[tier] || "text-gray-700 bg-gray-100 border-gray-300";
  };

  const getTierIcon = (tier: string) => {
    const icons: Record<string, any> = {
      BRONZE: Trophy,
      SILVER: Award,
      GOLD: Star,
      PLATINUM: Zap,
    };
    const Icon = icons[tier] || Trophy;
    return <Icon className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Loading loyalty data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex h-64 flex-col items-center justify-center text-red-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!loyaltyData) {
    return null;
  }

  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Loyalty Program</h2>
        <RefreshButton
          onClick={() => {
            refetch();
            onRefresh?.();
          }}
          loading={loading}
        />
      </div>

      {/* Current Tier Badge */}
      <div className="mb-6">
        <div
          className={`inline-flex items-center gap-2 rounded-lg border-2 px-4 py-3 ${getTierColor(
            loyaltyData.currentTier.tier,
          )}`}
        >
          {getTierIcon(loyaltyData.currentTier.tier)}
          <div>
            <div className="text-xs font-medium opacity-70">Current Tier</div>
            <div className="text-lg font-bold">
              {loyaltyData.currentTier.tier}
            </div>
          </div>
        </div>
      </div>

      {/* Points Overview Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Current Points */}
        <div className="rounded-lg border-2 border-blue-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">
                Available Points
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {loyaltyData.currentPoints.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Lifetime Points */}
        <div className="rounded-lg border-2 border-purple-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">
                Lifetime Points
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {loyaltyData.lifetimePoints.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="rounded-lg border-2 border-green-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-3">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">
                Available Rewards
              </div>
              <div className="text-2xl font-bold text-green-600">
                {loyaltyData.availableRewards}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      {loyaltyData.nextTier && (
        <div className="mb-6 rounded-lg bg-white p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              Progress to {loyaltyData.nextTier.tier}
            </div>
            <div className="text-sm font-bold text-blue-600">
              {loyaltyData.pointsToNextTier.toLocaleString()} points to go
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-blue-500 to-purple-500 pr-2 transition-all duration-500"
                style={{
                  width: `${Math.min(loyaltyData.progressPercentage, 100)}%`,
                }}
              >
                {loyaltyData.progressPercentage > 10 && (
                  <span className="text-xs font-bold text-white">
                    {loyaltyData.progressPercentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{loyaltyData.currentTier.tier}</span>
            <span>{loyaltyData.nextTier.tier}</span>
          </div>
        </div>
      )}

      {/* Tier Benefits */}
      <div className="rounded-lg bg-white p-5">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Your Benefits
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>
              Earn{" "}
              <strong>
                {loyaltyData.currentTier.config?.pointsMultiplier || 1}x
              </strong>{" "}
              points on purchases
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>
              Discount:{" "}
              <strong>
                {loyaltyData.currentTier.config?.discountPercentage || 0}%
              </strong>{" "}
              on all items
            </span>
          </div>
          {loyaltyData.currentTier.config?.birthdayBonus && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>
                Birthday bonus:{" "}
                <strong>
                  {loyaltyData.currentTier.config.birthdayBonus} points
                </strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Pending Points Notice */}
      {loyaltyData.pendingPoints > 0 && (
        <div className="mt-4 rounded border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                {loyaltyData.pendingPoints} points pending
              </p>
              <p className="mt-1 text-xs text-yellow-700">
                Points will be credited after purchase confirmation
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyDashboard;
