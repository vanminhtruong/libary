/**
 * Date utility functions
 */

/**
 * Formats a date to local string with custom options
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string (e.g., 'en-US', 'vi-VN')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'vi-VN') => {
  if (!date) return '';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Gets relative time string (e.g., "2 hours ago", "yesterday")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const dateObj = new Date(date);
  const diff = now - dateObj;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  return formatDate(date);
};
