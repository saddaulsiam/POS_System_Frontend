import { getCurrencyConfig, formatWithSymbol } from "../config/currencyConfig";

interface CurrencySettings {
  currencyCode?: string;
  currencySymbol?: string;
  currencyPosition?: string;
}

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

export const parseCurrency = (currencyString: string): number => {
  // Remove all non-numeric characters except decimal point and minus sign
  const cleanString = currencyString.replace(/[^0-9.-]/g, "");
  return parseFloat(cleanString) || 0;
};
