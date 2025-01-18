/**
 * Validation utility functions
 */

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a phone number (Vietnamese format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export const isValidPhoneNumber = (phone) => {
  if (!phone) return false;
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength and messages
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Mật khẩu không được để trống' };
  }
  
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length;

  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
      strength: 0 
    };
  }

  return {
    isValid: strength >= 3,
    message: strength >= 3 
      ? 'Mật khẩu hợp lệ' 
      : 'Mật khẩu cần có chữ hoa, chữ thường, số và ký tự đặc biệt',
    strength: strength
  };
};
