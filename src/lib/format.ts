/** Formats a price stored in cents, for example 650000 LKR becomes "LKR 6,500.00". */
export function formatPrice(cents: number, currency: string, locale = "en-LK"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
}
