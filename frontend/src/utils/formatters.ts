/**
 * Global Bangladeshi Taka (BDT) Currency Formatter
 * Formats numbers into BDT currency format with proper comma separators and prefix '৳'
 * Example: formatCurrency(12500) -> "৳ 12,500.00"
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '৳ 0.00';
  }

  const num = Number(amount);
  const formatted = num.toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return `৳ ${formatted}`;
}

/**
 * Formats a date string into standard readable format
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}
