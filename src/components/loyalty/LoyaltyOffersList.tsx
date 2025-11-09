import React, { useState } from "react";
import { Tag, Calendar, TrendingUp, X } from "lucide-react";
import { useLoyaltyOffers } from "../../services/queries";
import type { LoyaltyTier } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface LoyaltyOffer {
  id: number;
  title: string;
  description?: string;
  offerType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_ITEM";
  discountValue: number;
  minimumPurchase?: number;
  requiredTier?: LoyaltyTier;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface LoyaltyOffersListProps {
  customerTier?: LoyaltyTier;
}

const LoyaltyOffersList: React.FC<LoyaltyOffersListProps> = ({
  customerTier,
}) => {
  const { data: allOffers = [], isLoading: loading } = useLoyaltyOffers();
  // Only show active offers
  const offers = allOffers.filter((offer: LoyaltyOffer) => offer.isActive);
  const [selectedOffer, setSelectedOffer] = useState<LoyaltyOffer | null>(null);
  const { settings } = useSettings();

  const isOfferEligible = (offer: LoyaltyOffer) => {
    if (!offer.requiredTier) return true;
    if (!customerTier) return false;

    const tierOrder: LoyaltyTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
    const requiredIndex = tierOrder.indexOf(offer.requiredTier);
    const customerIndex = tierOrder.indexOf(customerTier);

    return customerIndex >= requiredIndex;
  };

  const isOfferActive = (offer: LoyaltyOffer) => {
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    return now >= start && now <= end;
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getOfferTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      PERCENTAGE: "Percentage Discount",
      FIXED_AMOUNT: "Fixed Discount",
      FREE_ITEM: "Free Item",
    };
    return labels[type] || type;
  };

  const getOfferTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      PERCENTAGE: "bg-purple-100 text-purple-800",
      FIXED_AMOUNT: "bg-blue-100 text-blue-800",
      FREE_ITEM: "bg-green-100 text-green-800",
    };
    return badges[type] || "bg-gray-100 text-gray-800";
  };

  const formatDiscountValue = (offer: LoyaltyOffer) => {
    if (offer.offerType === "PERCENTAGE") {
      return `${offer.discountValue}% OFF`;
    } else if (offer.offerType === "FIXED_AMOUNT") {
      return `${formatCurrency(offer.discountValue, settings)} OFF`;
    }
    return offer.title;
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Loading offers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Active Offers & Promotions
          </h2>
          <Tag className="h-6 w-6 text-blue-500" />
        </div>

        {offers.length === 0 ? (
          <div className="rounded-lg bg-gray-50 py-12 text-center">
            <Tag className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="mb-2 text-lg font-medium text-gray-600">
              No active offers
            </p>
            <p className="text-sm text-gray-500">
              Check back later for exciting promotions!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer: LoyaltyOffer) => {
              const eligible = isOfferEligible(offer);
              const active = isOfferActive(offer);
              const daysRemaining = getDaysRemaining(offer.endDate);

              return (
                <div
                  key={offer.id}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    eligible && active
                      ? "cursor-pointer border-blue-300 hover:border-blue-500 hover:shadow-lg"
                      : "border-gray-200 opacity-60"
                  }`}
                  onClick={() => eligible && active && setSelectedOffer(offer)}
                >
                  {/* Ribbon for urgency */}
                  {daysRemaining <= 3 && daysRemaining > 0 && (
                    <div className="absolute right-0 top-0 rounded-bl bg-red-500 px-3 py-1 text-xs font-bold text-white">
                      {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left!
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            {offer.title}
                          </h3>
                          <span
                            className={`rounded px-2 py-1 text-xs font-medium ${getOfferTypeBadge(offer.offerType)}`}
                          >
                            {getOfferTypeLabel(offer.offerType)}
                          </span>
                        </div>

                        <div className="mb-2 text-3xl font-extrabold text-blue-600">
                          {formatDiscountValue(offer)}
                        </div>

                        {offer.description && (
                          <p className="mb-3 text-sm text-gray-600">
                            {offer.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(offer.startDate).toLocaleDateString()} -{" "}
                              {new Date(offer.endDate).toLocaleDateString()}
                            </span>
                          </div>

                          {offer.minimumPurchase && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>
                                Min. purchase:{" "}
                                {formatCurrency(
                                  offer.minimumPurchase,
                                  settings,
                                )}
                              </span>
                            </div>
                          )}

                          {offer.requiredTier && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              <span>
                                Requires: {offer.requiredTier} tier
                                {!eligible && (
                                  <span className="ml-1 text-red-600">
                                    (Not eligible)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!active && (
                      <div className="mt-3 rounded border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-800">
                        This offer is not currently active
                      </div>
                    )}

                    {eligible && active && (
                      <div className="mt-3 text-sm font-medium text-green-600">
                        ✓ You're eligible for this offer!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedOffer.title}
              </h3>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
              <div className="mb-2 text-4xl font-extrabold">
                {formatDiscountValue(selectedOffer)}
              </div>
              <p className="text-sm opacity-90">{selectedOffer.description}</p>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Valid Period</div>
                  <div className="text-gray-600">
                    {new Date(selectedOffer.startDate).toLocaleDateString()} -{" "}
                    {new Date(selectedOffer.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {selectedOffer.minimumPurchase && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Minimum Purchase</div>
                    <div className="text-gray-600">
                      {formatCurrency(selectedOffer.minimumPurchase, settings)}
                    </div>
                  </div>
                </div>
              )}

              {selectedOffer.requiredTier && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Tag className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Required Tier</div>
                    <div className="text-gray-600">
                      {selectedOffer.requiredTier} or higher
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded border-l-4 border-blue-500 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>How to use:</strong> This offer will be automatically
                applied at checkout when you meet the requirements.
              </p>
            </div>

            <button
              onClick={() => setSelectedOffer(null)}
              className="mt-6 w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyOffersList;
