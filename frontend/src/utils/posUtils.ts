import { CartItem } from "../types";

/**
 * Calculate the subtotal of all items in the cart
 * @param cart - Array of cart items
 * @returns Subtotal amount
 */
export const calculateSubtotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.subtotal, 0);
};

/**
 * Calculate the total tax for all items in the cart
 * @param cart - Array of cart items
 * @returns Tax amount
 */
export const calculateTax = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    const itemTax = (item.subtotal * item.product.taxRate) / 100;
    return total + itemTax;
  }, 0);
};

/**
 * Calculate the grand total (subtotal + tax)
 * @param cart - Array of cart items
 * @returns Total amount
 */
export const calculateTotal = (cart: CartItem[]): number => {
  return calculateSubtotal(cart) + calculateTax(cart);
};

/**
 * Calculate the change amount for cash payment
 * @param cashReceived - Amount of cash received
 * @param total - Total amount due
 * @returns Change amount (0 if cash < total)
 */
export const calculateChange = (
  cashReceived: number,
  total: number,
): number => {
  return Math.max(0, cashReceived - total);
};
