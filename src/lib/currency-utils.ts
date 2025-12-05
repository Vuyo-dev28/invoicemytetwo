/**
 * Format a number as currency using the specified currency code
 * @param amount - The amount to format
 * @param currencyCode - The ISO currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - Optional locale (defaults to 'en-US')
 * @returns Formatted currency string with symbol
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD', locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    // Fallback to USD if currency code is invalid
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - The ISO currency code
 * @param locale - Optional locale (defaults to 'en-US')
 * @returns Currency symbol (e.g., '$', '€', '£')
 */
export function getCurrencySymbol(currencyCode: string = 'USD', locale: string = 'en-US'): string {
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(0).replace(/\d/g, '').trim();
  } catch (error) {
    return '$'; // Fallback to USD symbol
  }
}

