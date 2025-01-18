/**
 * Array and object utility functions
 */

/**
 * Groups an array of objects by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Removes duplicate items from an array
 * @param {Array} array - Array to deduplicate
 * @param {string} [key] - Optional key for object arrays
 * @returns {Array} Deduplicated array
 */
export const removeDuplicates = (array, key) => {
  if (!array) return [];
  if (key) {
    return Array.from(new Map(array.map(item => [item[key], item])).values());
  }
  return [...new Set(array)];
};

/**
 * Sorts an array of objects by a key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Deep clones an object or array
 * @param {Object|Array} obj - Object to clone
 * @returns {Object|Array} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
