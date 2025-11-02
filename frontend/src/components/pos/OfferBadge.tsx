import React from "react";
import { loyaltyAPI } from "../../services";

export function OfferBadge({ customer, cart, appliedOffer }: { customer: any; cart: any[]; appliedOffer: any }) {
  const [reason, setReason] = React.useState<string>("");
  React.useEffect(() => {
    async function check() {
      if (!customer) {
        return;
      }
      try {
        const all = await loyaltyAPI.getAllOffers();
        if (!all.length) {
          setReason("No special offers are currently configured.");
          return;
        }
        const now = new Date();
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const reasons: string[] = [];
        all.forEach((offer: any) => {
          if (!offer.isActive) {
            reasons.push(`${offer.title}: Not active.`);
            return;
          }
          if (offer.requiredTier && offer.requiredTier !== customer.loyaltyTier) {
            return;
            reasons.push(`${offer.title}: Requires ${offer.requiredTier} tier.`);
          }
          if (offer.minimumPurchase && total < offer.minimumPurchase) {
            reasons.push(`${offer.title}: Minimum purchase ${offer.minimumPurchase}.`);
            return;
          }
          const start = new Date(offer.startDate);
          const end = new Date(offer.endDate);
          if (now < start || now > end) {
            reasons.push(`${offer.title}: Not in offer date range.`);
            return;
          }
        });
        setReason(reasons.length > 0 ? reasons.join(" ") : "");
      } catch {
        setReason("Could not check special offers.");
      }
    }
    check();
  }, [customer, cart]);
  if (!customer) return null;
  return (
    <div className="flex justify-center">
      {appliedOffer ? (
        <div className="text-sm bg-blue-100 border border-blue-400 text-blue-800 mx-2 my-1.5 px-2 py-1 rounded shadow-sm flex items-center gap-2">
          <span className="font-medium">Special Offer Applied:</span>
          <span className="font-semibold">{appliedOffer.title}</span>
          <span className="text-xs bg-blue-200 text-blue-900 px-2 py-1 rounded">
            {appliedOffer.offerType.replace("DISCOUNT_", "")}
            {appliedOffer.discountValue
              ? `: ${appliedOffer.discountValue}${appliedOffer.offerType === "DISCOUNT_PERCENTAGE" ? "%" : ""}`
              : ""}
          </span>
        </div>
      ) : (
        <>{reason !== "" && <div className=" px-2 py-1.5 text-gray-400 text-sm italic">{reason}</div>}</>
      )}
    </div>
  );
}
