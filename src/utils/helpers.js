/**
 * helpers.js — Small pure-function utilities used across
 * multiple features so formatting stays consistent.
 */

/**
 * Format a number as USD currency string.
 * @param {number} amount
 * @returns {string} e.g. "$1,250.00"
 */
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return '$0.00';
  return `$${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Truncate text to a given length and append ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
};

/**
 * Basic email validation regex.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
