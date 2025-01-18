/**
 * Local storage utility functions
 */

const PREFIX = 'user_app_';

/**
 * Sets an item in localStorage with prefix
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setStorageItem = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(PREFIX + key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Gets an item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default value
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Removes an item from localStorage
 * @param {string} key - Storage key to remove
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clears all app-specific items from localStorage
 */
export const clearStorage = () => {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
