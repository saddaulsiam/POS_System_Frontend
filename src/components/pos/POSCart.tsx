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
  onUpdateDiscount: (
    productId: number,
    discountType: "FIXED" | "PERCENTAGE",
    discountValue: number,
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
  onUpdateDiscount,
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

  // Total item-level discount across cart
  const itemDiscountTotal = cart.reduce(
    (sum, item) => sum + (item.discountAmount || 0),
    0,
  );

  // Loyalty per-item distribution
  let perItemLoyalty: Record<string, number> = {};
  if (loyaltyDiscount > 0 && cart.length > 0) {
    const totalSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    let distributed = 0;
    cart.forEach((item, idx) => {
      const itemKey = item.variant
        ? `${item.product.id}-${item.variant.id}`
        : `${item.product.id}`;
      if (idx === cart.length - 1) {
        perItemLoyalty[itemKey] = loyaltyDiscount - distributed;
      } else {
        const share =
          Math.round((item.subtotal / totalSubtotal) * loyaltyDiscount * 100) /
          100;
        perItemLoyalty[itemKey] = share;
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
                const loyaltyShare = perItemLoyalty[itemKey] || 0;
                const discountType = item.discountType || "FIXED";
                const discountValue = item.discountValue ?? 0;
                const discountAmount = item.discountAmount || 0;
                const purchasePrice =
                  item.variant?.purchasePrice ?? item.product.purchasePrice ?? 0;
                const maxUnitDiscount =
                  purchasePrice > 0 ? Math.max(0, item.price - purchasePrice) : item.price;
                const maxPercent =
                  item.price > 0 ? Math.floor(((maxUnitDiscount / item.price) * 100) * 10) / 10 : 100;
                const maxAllowed = discountType === "PERCENTAGE" ? maxPercent : maxUnitDiscount;

                return (
                  <div
                    key={itemKey}
                    className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs hover:border-slate-300 transition-all"
                  >
                    {/* Row 1: Name + Remove */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 text-sm leading-tight truncate">
                          {displayName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {item.variant && (
                            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                              SKU: {item.variant.sku}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {formatCurrency(item.price, settings)} each &bull; Stock: {stockQuantity}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          onRemoveItem(item.product.id, item.variant?.id)
                        }
                        className="flex-shrink-0 rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Row 2: Quantity Stepper (Left) & Subtotal (Right) */}
                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-2xs">
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.variant?.id,
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 rounded-md bg-white text-slate-700 text-sm font-bold shadow-2xs hover:bg-slate-100 flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-white"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const q = parseInt(e.target.value) || 1;
                            onUpdateQuantity(
                              item.product.id,
                              q,
                              item.variant?.id,
                            );
                          }}
                          className="w-9 text-center font-bold text-slate-800 text-sm focus:outline-none bg-transparent"
                          min="1"
                          max={stockQuantity}
                        />
                        <button
                          onClick={() =>
                            onUpdateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.variant?.id,
                            )
                          }
                          disabled={item.quantity >= stockQuantity}
                          className="w-6 h-6 rounded-md bg-white text-slate-700 text-sm font-bold shadow-2xs hover:bg-slate-100 flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:hover:bg-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        {discountAmount > 0 && (
                          <p className="text-[11px] text-slate-400 line-through leading-none mb-0.5">
                            {formatCurrency(item.price * item.quantity, settings)}
                          </p>
                        )}
                        <p className="text-base font-bold text-slate-900 leading-tight">
                          {formatCurrency(item.subtotal, settings)}
                        </p>
                        {loyaltyShare > 0 && (
                          <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">
                            🎁 −{formatCurrency(loyaltyShare, settings)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Dedicated Discount Toolbar (Controlled by Admin Feature Setting) */}
                    {settings?.enableItemDiscount !== false ? (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            🏷️ Discount:
                          </span>
                          <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20">
                            <input
                              type="number"
                              value={discountValue === 0 ? "" : discountValue}
                              placeholder="0"
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                onUpdateDiscount(
                                  item.product.id,
                                  discountType,
                                  val,
                                  item.variant?.id,
                                );
                              }}
                              className="w-12 px-1.5 py-0.5 text-xs text-center font-semibold text-slate-800 focus:outline-none"
                              min="0"
                              max={maxAllowed}
                            />
                            <div className="flex border-l border-slate-200 bg-slate-50 p-0.5 text-[10px] font-bold">
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateDiscount(
                                    item.product.id,
                                    "FIXED",
                                    discountValue,
                                    item.variant?.id,
                                  )
                                }
                                className={`px-1.5 py-0.5 rounded transition-all ${
                                  discountType === "FIXED"
                                    ? "bg-white text-blue-600 shadow-2xs font-extrabold"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                                title="Fixed Amount"
                              >
                                {settings?.currencySymbol || "৳"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateDiscount(
                                    item.product.id,
                                    "PERCENTAGE",
                                    discountValue,
                                    item.variant?.id,
                                  )
                                }
                                className={`px-1.5 py-0.5 rounded transition-all ${
                                  discountType === "PERCENTAGE"
                                    ? "bg-white text-blue-600 shadow-2xs font-extrabold"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                                title="Percentage"
                              >
                                %
                              </button>
                            </div>
                          </div>
                          {purchasePrice > 0 && (
                            <span
                              className="text-[10px] text-slate-400 font-medium"
                              title={`Cost price: ${formatCurrency(purchasePrice, settings)}. Price cannot fall below this.`}
                            >
                              (Max: {discountType === "PERCENTAGE" ? `${maxPercent}%` : formatCurrency(maxUnitDiscount, settings)})
                            </span>
                          )}
                        </div>

                        {/* Savings badge or clear */}
                        {discountAmount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                              −{formatCurrency(discountAmount, settings)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateDiscount(
                                  item.product.id,
                                  discountType,
                                  0,
                                  item.variant?.id,
                                )
                              }
                              className="text-slate-400 hover:text-red-500 text-xs p-0.5 rounded hover:bg-slate-100 transition-colors"
                              title="Remove discount"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">No discount</span>
                        )}
                      </div>
                    ) : (
                      discountAmount > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">🏷️ Applied Discount:</span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                            −{formatCurrency(discountAmount, settings)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart Summary & Payment */}
      <div className="space-y-4 border-t border-gray-200 p-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span>{formatCurrency(subtotal, settings)}</span>
          </div>
          {itemDiscountTotal > 0 && (
            <div className="flex justify-between text-sm text-orange-600">
              <span>🏷️ Item Discounts:</span>
              <span>−{formatCurrency(itemDiscountTotal, settings)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span>{formatCurrency(tax, settings)}</span>
          </div>
          {loyaltyDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>🎁 Loyalty Discount:</span>
              <span>−{formatCurrency(loyaltyDiscount, settings)}</span>
            </div>
          )}
          {offerDiscount > 0 && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>🏷️ Special Offer ({customer?.loyaltyTier}):</span>
              <span>−{formatCurrency(offerDiscount, settings)}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 text-lg font-semibold">
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
          {/* Loyalty Points Button */}
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
