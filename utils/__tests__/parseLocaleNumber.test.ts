import { parseLocaleNumber } from '../parseLocaleNumber'

describe('parseLocaleNumber', () => {
  describe('de-DE locale (comma as decimal separator, dot as grouping)', () => {
    it('parses a simple decimal value "3,33"', () => {
      expect(parseLocaleNumber({ numberString: '3,33', locale: 'de-DE' })).toBeCloseTo(3.33)
    })

    it('parses an integer "42"', () => {
      expect(parseLocaleNumber({ numberString: '42', locale: 'de-DE' })).toBe(42)
    })

    it('parses zero "0"', () => {
      expect(parseLocaleNumber({ numberString: '0', locale: 'de-DE' })).toBe(0)
    })

    it('parses a large number with grouping separator "1.000,99"', () => {
      expect(parseLocaleNumber({ numberString: '1.000,99', locale: 'de-DE' })).toBeCloseTo(1000.99)
    })

    it('parses a large number without cents "2.500"', () => {
      expect(parseLocaleNumber({ numberString: '2.500', locale: 'de-DE' })).toBe(2500)
    })

    it('strips a currency symbol before parsing', () => {
      expect(
        parseLocaleNumber({ numberString: '3,33 €', locale: 'de-DE', currency: '€' }),
      ).toBeCloseTo(3.33)
    })
  })

  describe('en-US locale (dot as decimal separator, comma as grouping)', () => {
    it('parses a simple decimal value "3.33"', () => {
      expect(parseLocaleNumber({ numberString: '3.33', locale: 'en-US' })).toBeCloseTo(3.33)
    })

    it('parses an integer "42"', () => {
      expect(parseLocaleNumber({ numberString: '42', locale: 'en-US' })).toBe(42)
    })

    it('parses zero "0"', () => {
      expect(parseLocaleNumber({ numberString: '0', locale: 'en-US' })).toBe(0)
    })

    it('parses a large number with grouping separator "1,000.99"', () => {
      expect(parseLocaleNumber({ numberString: '1,000.99', locale: 'en-US' })).toBeCloseTo(1000.99)
    })

    it('parses a large number without cents "2,500"', () => {
      expect(parseLocaleNumber({ numberString: '2,500', locale: 'en-US' })).toBe(2500)
    })

    it('strips a currency symbol before parsing', () => {
      expect(
        parseLocaleNumber({ numberString: '$3.33', locale: 'en-US', currency: '$' }),
      ).toBeCloseTo(3.33)
    })
  })

  describe('fr-FR locale (comma as decimal separator, narrow no-break space as grouping)', () => {
    it('parses a simple decimal value "3,33"', () => {
      expect(parseLocaleNumber({ numberString: '3,33', locale: 'fr-FR' })).toBeCloseTo(3.33)
    })

    it('parses an integer "100"', () => {
      expect(parseLocaleNumber({ numberString: '100', locale: 'fr-FR' })).toBe(100)
    })
  })

  describe('es-ES locale (comma as decimal separator)', () => {
    it('parses "19,99" as 19.99', () => {
      expect(parseLocaleNumber({ numberString: '19,99', locale: 'es-ES' })).toBeCloseTo(19.99)
    })

    it('parses an integer "42"', () => {
      expect(parseLocaleNumber({ numberString: '42', locale: 'es-ES' })).toBe(42)
    })
  })

  describe('currency stripping', () => {
    it('removes a custom currency symbol before parsing (de-DE, comma decimal)', () => {
      expect(
        parseLocaleNumber({ numberString: '10,50 €', locale: 'de-DE', currency: '€' }),
      ).toBeCloseTo(10.5)
    })

    it('removes a custom currency symbol before parsing (en-US, dot decimal)', () => {
      expect(
        parseLocaleNumber({ numberString: '$10.50', locale: 'en-US', currency: '$' }),
      ).toBeCloseTo(10.5)
    })

    it('handles no currency option', () => {
      expect(parseLocaleNumber({ numberString: '5.00', locale: 'en-US' })).toBeCloseTo(5)
    })
  })

  describe('edge cases', () => {
    it('returns NaN for an empty string', () => {
      expect(parseLocaleNumber({ numberString: '', locale: 'en-US' })).toBeNaN()
    })

    it('returns NaN for a non-numeric string', () => {
      expect(parseLocaleNumber({ numberString: 'abc', locale: 'en-US' })).toBeNaN()
    })

    it('handles a value without a decimal separator', () => {
      expect(parseLocaleNumber({ numberString: '100', locale: 'en-US' })).toBe(100)
    })
  })
})
