import React from "react";
import { Button } from "../common";

interface SubscriptionWarningModalProps {
  daysRemaining: number;
  planType?: string | null;
  onClose: () => void;
  onPurchase: () => void;
}

export const SubscriptionWarningModal: React.FC<
  SubscriptionWarningModalProps
> = ({ daysRemaining, planType, onClose, onPurchase }) => {
  const handleDismiss = () => {
    onClose();
  };

  const isTrial = !planType;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
          {isTrial ? "Trial Ending Soon" : "Subscription Ending Soon"}
        </h2>

        <p className="mb-6 text-center text-gray-600">
          Your {isTrial ? "trial period" : "subscription"} will expire in{" "}
          <span className="font-bold text-yellow-600">
            {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
          </span>
          . Renew or purchase a plan to prevent system interruption.
        </p>

        <div className="mb-4 rounded-lg bg-yellow-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-900">
            What happens after expiration?
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• POS register and checkout will be locked</li>
            <li>• Employees won't be able to log in or process sales</li>
            <li>• Your store data and parameters remain secure</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button fullWidth variant="ghost" onClick={handleDismiss}>
            Remind Me Later
          </Button>
          <Button fullWidth variant="primary" onClick={onPurchase}>
            Purchase Now
          </Button>
        </div>
      </div>
    </div>
  );
};
