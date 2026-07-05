import React from "react";
import { CartItem, Customer } from "../../types";
import { Button } from "../common";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface POSCartProps {
  cart: CartItem[];
  onUpdateQuantity: (
    productId: number,
    quantity: number,
    variantId?: number,
  ) => void;
  onRemoveItem: (productId: number, variantId?: number) => void;
  onClearCart: () => void;
  onProcessPayment: () => void;
  onSplitPayment?: () => void;
  onParkSale?: () => void;
  onViewParkedSales?: () => void;
  onRedeemPoints?: () => void;
  subtotal: number;
  tax: number;
  total: number;
  loyaltyDiscount?: number;
  offerDiscount?: number;
  customer: Customer | null;
}

export const POSCart: React.FC<POSCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProcessPayment,
  onSplitPayment,
  onParkSale,
  onViewParkedSales,
  onRedeemPoints,
  subtotal,
  tax,
  total,
  loyaltyDiscount = 0,
  offerDiscount = 0,
  customer,
}) => {
  const { settings } = useSettings();

  // Optionally, distribute loyalty discount per item (proportional)
  let perItemDiscounts: Record<string, number> = {};
  if (loyaltyDiscount > 0 && cart.length > 0) {
    const totalSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    let distributed = 0;
    cart.forEach((item, idx) => {
      const itemKey = item.variant
        ? `${item.product.id}-${item.variant.id}`
        : `${item.product.id}`;
      // Last item gets the remainder to avoid floating point issues
      if (idx === cart.length - 1) {
        perItemDiscounts[itemKey] = loyaltyDiscount - distributed;
      } else {
        const share =
          Math.round((item.subtotal / totalSubtotal) * loyaltyDiscount * 100) /
          100;
        perItemDiscounts[itemKey] = share;
        distributed += share;
      }
    });
  }

  return (
    <>
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-3">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            Cart ({cart.length} items)
          </h3>

          {cart.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                />
              </svg>
              <p>Cart is empty</p>
              <p className="text-sm">Scan a product to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => {
                const itemKey = item.variant
                  ? `${item.product.id}-${item.variant.id}`
                  : `${item.product.id}`;
                const displayName = item.variant
                  ? `${item.product.name} - ${item.variant.name}`
                  : item.product.name;
                const stockQuantity = item.variant
                  ? item.variant.stockQuantity || 0
                  : item.product.stockQuantity;
                const itemDiscount = perItemDiscounts[itemKey] || 0;

                return (
                  <div
                    key={itemKey}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {displayName}
                      </h4>
                      {item.variant && (
                        <p className="text-xs text-blue-600">
                          SKU: {item.variant.sku}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.price, settings)} each
                      </p>
                      <p className="text-xs text-gray-500">
                        Stock: {stockQuantity}
                      </p>
                      {itemDiscount > 0 && (
                        <p className="mt-1 text-xs text-green-600">
                          🎁 Loyalty Discount: -
                          {formatCurrency(itemDiscount, settings)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          onUpdateQuantity(
                            item.product.id,
                            newQuantity,
                            item.variant?.id,
                          );
                        }}
                        className="w-16 rounded border border-gray-300 px-2 py-1 text-center"
                        min="1"
                        max={stockQuantity}
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.subtotal, settings)}
                      </div>
                      <button
                        onClick={() =>
                          onRemoveItem(item.product.id, item.variant?.id)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary & Payment */}
      <div className="space-y-4 border-t border-gray-200 p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal, settings)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>{formatCurrency(tax, settings)}</span>
          </div>
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>🎁 Loyalty Discount:</span>
              <span>-{formatCurrency(loyaltyDiscount, settings)}</span>
            </div>
          )}
          {offerDiscount > 0 && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>🏷️ Special Offer Discount ({customer?.loyaltyTier}):</span>
              <span>-{formatCurrency(offerDiscount, settings)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-lg font-medium">
            <span>Total:</span>
            <span>
              {formatCurrency(
                total - loyaltyDiscount - offerDiscount,
                settings,
              )}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Loyalty Points Button - Show if customer has points and setting enabled */}
          {settings?.enableLoyaltyPoints &&
            onRedeemPoints &&
            customer &&
            customer.loyaltyPoints > 0 &&
            loyaltyDiscount === 0 &&
            cart.length > 0 && (
              <Button variant="primary" fullWidth onClick={onRedeemPoints}>
                ⭐ Use Loyalty Points ({customer.loyaltyPoints} pts)
              </Button>
            )}
          <Button
            variant="success"
            fullWidth
            onClick={onProcessPayment}
            disabled={cart.length === 0}
          >
            💳 Process Payment
          </Button>
          {settings?.enableSplitPayment && onSplitPayment && (
            <Button
              variant="primary"
              fullWidth
              onClick={onSplitPayment}
              disabled={cart.length === 0}
            >
              🔀 Split Payment
            </Button>
          )}
          {settings?.enableParkSale && (
            <div className="grid grid-cols-2 gap-2">
              {onParkSale && (
                <Button
                  variant="warning"
                  onClick={onParkSale}
                  disabled={cart.length === 0}
                >
                  🅿️ Park Sale
                </Button>
              )}
              {onViewParkedSales && (
                <Button variant="secondary" onClick={onViewParkedSales}>
                  📋 Parked
                </Button>
              )}
            </div>
          )}
          <Button
            variant="secondary"
            fullWidth
            onClick={onClearCart}
            disabled={cart.length === 0}
          >
            🗑️ Clear Cart
          </Button>
        </div>
      </div>
    </>
  );
};
