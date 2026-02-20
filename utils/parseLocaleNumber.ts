/**
 * Parses a locale-formatted number string into a JavaScript number.
 *
 * Uses `Intl.NumberFormat.formatToParts` with the user's locale to correctly
 * identify the decimal separator and grouping separator, so that input from
 * keyboards that only provide a comma (e.g. European locales) is handled
 * correctly.
 *
 * Examples:
 *   locale "de-DE": "3,33"  → 3.33  (comma is decimal separator)
 *   locale "en-US": "3.33"  → 3.33  (dot is decimal separator)
 *   locale "de-DE": "1.000,99" → 1000.99
 *   locale "en-US": "1,000.99" → 1000.99
 */
export function parseLocaleNumber({
  numberString,
  locale,
  currency,
}: {
  numberString: string
  locale: string
  currency?: string
}): number {
  // Remove currency symbol and surrounding whitespace
  const withoutCurrency = numberString.replace(currency ?? '', '').trim()

  // Use Intl to detect the locale-specific decimal and grouping separators
  const parts = new Intl.NumberFormat(locale).formatToParts(1234.5)
  const decimalSeparator = parts.find((p) => p.type === 'decimal')?.value ?? '.'
  const groupingSeparator = parts.find((p) => p.type === 'group')?.value

  // Escape special regex characters so separators like '.' work correctly
  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // Remove grouping separators (if distinct from decimal), then normalise decimal separator to '.'
  let normalized = withoutCurrency
  if (groupingSeparator && groupingSeparator !== decimalSeparator) {
    normalized = normalized.replace(new RegExp(escapeRegex(groupingSeparator), 'g'), '')
  }
  normalized = normalized.replace(new RegExp(escapeRegex(decimalSeparator)), '.')

  return parseFloat(normalized)
}
