// src/utils/formatters.js

/**
 * Formats numbers into a compact currency string (e.g., $1.2M, $15.5K)
 * @param {number} value - The amount to format
 * @returns {string} 
 */
export const formatCurrencyCompact = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

/**
 * Formats numbers into a standard currency string (e.g., $1,242,256.99)
 */
export const formatCurrencyFull = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};