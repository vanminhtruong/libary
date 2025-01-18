/**
 * String utility functions
 */

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The input string
 * @returns {string} The capitalized string
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param {string} str - The input string
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string with ellipsis
 */
export const truncateString = (str, maxLength) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Removes special characters from a string
 * @param {string} str - The input string
 * @returns {string} Cleaned string
 */
export const removeSpecialCharacters = (str) => {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9 ]/g, '');
};

/**
 * Converts a string to slug format
 * @param {string} str - The input string
 * @returns {string} Slug formatted string
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
