/**
 * Currency Configuration System
 * Defines supported currencies with their formatting rules
 */

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: "before" | "after";
  decimals: number;
  thousandSeparator: string;
  decimalSeparator: string;
  locale?: string; // For Intl.NumberFormat
}

/**
 * Supported currencies with their configurations
 */
export const CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    symbolPosition: "before",
    decimals: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    locale: "en-US",
  },
  BDT: {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
    symbolPosition: "before",
    decimals: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    locale: "en-BD",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    symbolPosition: "before",
    decimals: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    locale: "de-DE",
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    symbolPosition: "before",
    decimals: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    locale: "en-GB",
  },
  INR: {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    symbolPosition: "before",
    decimals: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    locale: "en-IN",
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    symbolPosition: "before",
    decimals: 0,
    thousandSeparator: ",",
    decimalSeparator: ".",
    locale: "ja-JP",
  },
};

/**
 * Get currency configuration by code
 * @param code - Currency code (USD, BDT, etc.)
 * @returns Currency configuration or USD as default
 */
export const getCurrencyConfig = (code?: string): CurrencyConfig => {
  if (!code || !CURRENCIES[code]) {
    return CURRENCIES.USD; // Default to USD
  }
  return CURRENCIES[code];
};

/**
 * Get list of all supported currencies for dropdowns
 */
export const getCurrencyOptions = (): Array<{
  value: string;
  label: string;
}> => {
  return Object.values(CURRENCIES).map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.symbol})`,
  }));
};

/**
 * Format number according to currency configuration
 * @param amount - The amount to format
 * @param config - Currency configuration
 * @returns Formatted number (without symbol)
 */
export const formatNumber = (
  amount: number,
  config: CurrencyConfig,
): string => {
  try {
    // Use Intl.NumberFormat for proper locale formatting
    if (config.locale) {
      return new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals,
      }).format(amount);
    }

    // Fallback to manual formatting
    const parts = amount.toFixed(config.decimals).split(".");
    const integerPart = parts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.thousandSeparator,
    );
    const decimalPart = parts[1];

    if (config.decimals > 0 && decimalPart) {
      return `${integerPart}${config.decimalSeparator}${decimalPart}`;
    }

    return integerPart;
  } catch (error) {
    // Fallback to simple formatting
    return amount.toFixed(config.decimals);
  }
};

/**
 * Format amount with currency symbol
 * @param amount - The amount to format
 * @param config - Currency configuration
 * @returns Formatted currency string (e.g., "$1,234.56" or "1,234.56৳")
 */
export const formatWithSymbol = (
  amount: number,
  config: CurrencyConfig,
): string => {
  const formattedNumber = formatNumber(amount, config);

  if (config.symbolPosition === "after") {
    return `${formattedNumber}${config.symbol}`;
  }

  return `${config.symbol}${formattedNumber}`;
};
