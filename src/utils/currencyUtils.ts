/**
 * Currency formatting utilities
 * Uses POS Settings with full currency support (USD, BDT, etc.)
 */

import { getCurrencyConfig, formatWithSymbol } from "../config/currencyConfig";

interface CurrencySettings {
  currencyCode?: string;
  currencySymbol?: string;
  currencyPosition?: string;
}

/**
 * Format a number as currency using POS settings
 * @param amount - The numeric amount to format
 * @param settings - Currency settings (with currencyCode preferred, or fallback to symbol/position)
 * @param decimals - Number of decimal places (optional, uses currency config default)
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(1234.56, { currencyCode: "USD" }) // "$1,234.56"
 * formatCurrency(1234.56, { currencyCode: "BDT" }) // "৳1,234.56"
 * formatCurrency(1234.56, { currencySymbol: "€", currencyPosition: "after" }) // "1,234.56€"
 */
export const formatCurrency = (
  amount: number,
  settings?: CurrencySettings | null,
  decimals?: number,
): string => {
  // If currencyCode is provided, use the currency configuration system
  if (settings?.currencyCode) {
    const config = getCurrencyConfig(settings.currencyCode);

    // Override decimals if provided
    if (decimals !== undefined) {
      const customConfig = { ...config, decimals };
      return formatWithSymbol(amount, customConfig);
    }

    return formatWithSymbol(amount, config);
  }

  // Fallback to legacy symbol/position format for backward compatibility
  const symbol = settings?.currencySymbol || "$";
  const position = settings?.currencyPosition || "before";
  const decimalPlaces = decimals !== undefined ? decimals : 2;

  const formattedAmount = amount.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  if (position === "after") {
    return `${formattedAmount}${symbol}`;
  }

  return `${symbol}${formattedAmount}`;
};

/**
 * Format currency with sign (for negative amounts like discounts)
 * @param amount - The numeric amount to format
 * @param settings - Currency settings
 * @param showPositiveSign - Whether to show + for positive numbers
 * @returns Formatted currency string with sign
 *
 * @example
 * formatCurrencyWithSign(-10, { currencyCode: "USD" }) // "-$10.00"
 * formatCurrencyWithSign(10, { currencyCode: "BDT" }, true) // "+৳10.00"
 */
export const formatCurrencyWithSign = (
  amount: number,
  settings?: CurrencySettings | null,
  showPositiveSign: boolean = false,
): string => {
  const absAmount = Math.abs(amount);
  let formattedAmount = formatCurrency(absAmount, settings);

  let sign = "";
  if (amount < 0) {
    sign = "-";
  } else if (amount > 0 && showPositiveSign) {
    sign = "+";
  }

  return sign + formattedAmount;
};

/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse
 * @param settings - Currency settings
/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse
 * @returns Numeric value
 *
 * @example
 * parseCurrency("$1,234.56") // 1234.56
 * parseCurrency("৳1,234.56") // 1234.56
 */
export const parseCurrency = (currencyString: string): number => {
  // Remove all non-numeric characters except decimal point and minus sign
  const cleanString = currencyString.replace(/[^0-9.-]/g, "");
  return parseFloat(cleanString) || 0;
};
