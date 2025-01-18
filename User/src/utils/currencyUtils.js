const currencyFormat = {
  locale: 'vi-VN',
  currency: 'VND',
  options: {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '';
  
  try {
    return new Intl.NumberFormat(currencyFormat.locale, currencyFormat.options).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toString();
  }
}; 