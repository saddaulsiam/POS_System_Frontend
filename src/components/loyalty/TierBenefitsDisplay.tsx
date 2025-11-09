import React from "react";
import { Trophy, Award, Star, Zap, TrendingUp } from "lucide-react";
import { useTierConfig } from "../../services/queries";
import type { LoyaltyTier } from "../../types";

interface LoyaltyTierConfig {
  tier: LoyaltyTier;
  minimumPoints: number;
  pointsMultiplier: number;
  discountPercentage: number;
  birthdayBonus: number;
  description?: string;
}

interface TierBenefitsDisplayProps {
  currentTier?: LoyaltyTier;
  lifetimePoints?: number;
}

const TierBenefitsDisplay: React.FC<TierBenefitsDisplayProps> = ({
  currentTier,
  lifetimePoints = 0,
}) => {
  const { data: tierConfigs = [], isLoading: loading } = useTierConfig();

  const getTierIcon = (tier: LoyaltyTier) => {
    const icons: Record<LoyaltyTier, any> = {
      BRONZE: Trophy,
      SILVER: Award,
      GOLD: Star,
      PLATINUM: Zap,
    };
    return icons[tier];
  };

  const getTierGradient = (tier: LoyaltyTier) => {
    const gradients: Record<LoyaltyTier, string> = {
      BRONZE: "from-orange-400 to-orange-600",
      SILVER: "from-gray-400 to-gray-600",
      GOLD: "from-yellow-400 to-yellow-600",
      PLATINUM: "from-purple-400 to-purple-600",
    };
    return gradients[tier];
  };

  const getTierBorder = (tier: LoyaltyTier) => {
    const borders: Record<LoyaltyTier, string> = {
      BRONZE: "border-orange-300",
      SILVER: "border-gray-300",
      GOLD: "border-yellow-300",
      PLATINUM: "border-purple-300",
    };
    return borders[tier];
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Loading tier information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Loyalty Tier Benefits
          </h2>
          <TrendingUp className="h-6 w-6 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tierConfigs.map((config: LoyaltyTierConfig) => {
            const Icon = getTierIcon(config.tier);
            const gradient = getTierGradient(config.tier);
            const border = getTierBorder(config.tier);
            const isCurrent = currentTier === config.tier;
            const isUnlocked = lifetimePoints >= config.minimumPoints;

            return (
              <div
                key={config.tier}
                className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                  isCurrent
                    ? `${border} ring-4 ring-blue-200`
                    : isUnlocked
                      ? `${border}`
                      : "border-gray-200 opacity-60"
                }`}
              >
                {/* Current Badge */}
                {isCurrent && (
                  <div className="absolute right-0 top-0 rounded-bl bg-blue-500 px-3 py-1 text-xs font-bold text-white">
                    CURRENT
                  </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-r ${gradient} p-4 text-white`}>
                  <Icon className="mb-2 h-10 w-10" />
                  <h3 className="mb-1 text-xl font-bold">{config.tier}</h3>
                  <p className="text-sm opacity-90">
                    {config.minimumPoints.toLocaleString()} points
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-3 p-4">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <div>
                      <span className="text-gray-600">Earn </span>
                      <span className="font-bold text-gray-800">
                        {config.pointsMultiplier}x
                      </span>
                      <span className="text-gray-600">
                        {" "}
                        points on every purchase
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                    <div>
                      <span className="text-gray-600">Get </span>
                      <span className="font-bold text-gray-800">
                        {config.discountPercentage}%
                      </span>
                      <span className="text-gray-600">
                        {" "}
                        discount on all purchases
                      </span>
                    </div>
                  </div>

                  {config.birthdayBonus > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                      <div>
                        <span className="text-gray-600">Receive </span>
                        <span className="font-bold text-gray-800">
                          {config.birthdayBonus}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          bonus points on your birthday
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Progress indicator for locked tiers */}
                  {!isUnlocked && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="mb-2 text-xs text-gray-500">
                        {(
                          config.minimumPoints - lifetimePoints
                        ).toLocaleString()}{" "}
                        points to unlock
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`bg-gradient-to-r ${gradient} h-2 rounded-full transition-all`}
                          style={{
                            width: `${Math.min((lifetimePoints / config.minimumPoints) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Unlocked badge */}
                  {isUnlocked && !isCurrent && (
                    <div className="mt-4 border-t border-gray-200 pt-4 text-center">
                      <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                        ✓ Unlocked
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Banner */}
        <div className="mt-6 rounded border-l-4 border-blue-500 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> Your tier is determined by your
            lifetime points. As you earn more points, you'll automatically
            advance to higher tiers with better benefits!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TierBenefitsDisplay;
