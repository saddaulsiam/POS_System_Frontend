import { useEffect, useState } from "react";
import { loyaltyAPI } from "../../services";

type OfferBadgeProps = {
  customer: any;
  cart: any[];
  appliedOffer: any;
};

export function OfferBadge({ customer, cart, appliedOffer }: OfferBadgeProps) {
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    (async function check() {
      if (!customer) {
        return;
      }
      try {
        const all = await loyaltyAPI.getAllOffers();
        if (!all.length) {
          setReason("No special offers are currently configured.");
          return;
        }
        const total = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const reasons: string[] = [];
        all.forEach((offer: any) => {
          if (!offer.isActive) {
            return;
          }
          if (
            offer.requiredTier &&
            offer.requiredTier !== customer.loyaltyTier
          ) {
            return;
          }
          const now = new Date();
          const start = new Date(offer.startDate);
          const end = new Date(offer.endDate);
          if (
            offer.minimumPurchase &&
            total < offer.minimumPurchase &&
            end > now &&
            start <= now
          ) {
            reasons.push(
              `${offer.title}: Minimum purchase ${offer.minimumPurchase}.`,
            );
            return;
          }
        });
        setReason(reasons.length > 0 ? reasons.join(" ") : "");
      } catch {
        setReason("Could not check special offers.");
      }
    })();
  }, [customer, cart]);

  if (!customer) return null;

  return (
    <div className="flex justify-center">
      {appliedOffer ? (
        <div className="mx-2 my-1.5 flex items-center gap-2 rounded border border-blue-400 bg-blue-100 px-2 py-1 text-sm text-blue-800 shadow-sm">
          <span className="font-medium">Special Offer Applied:</span>
          <span className="font-semibold">{appliedOffer.title}</span>
          <span className="rounded bg-blue-200 px-2 py-1 text-xs text-blue-900">
            {appliedOffer.offerType.replace("DISCOUNT_", "")}
            {appliedOffer.discountValue
              ? `: ${appliedOffer.discountValue}${appliedOffer.offerType === "DISCOUNT_PERCENTAGE" ? "%" : ""}`
              : ""}
          </span>
        </div>
      ) : (
        <>
          {reason !== "" && (
            <div className="px-2 py-1.5 text-sm capitalize italic text-gray-500">
              {reason}
            </div>
          )}
        </>
      )}
    </div>
  );
}
