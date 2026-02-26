import { describe, it, expect } from 'vitest'
import { formatDate, formatAmount } from '@/lib/formatters'

describe('formatDate()', () => {
  it('should format a date string to readable format', () => {
    const result = formatDate('2026-02-25T00:00:00.000Z')
    expect(result).toBe('February 25, 2026')
  })

  it('should format different dates correctly', () => {
    const result = formatDate('2027-02-25T00:00:00.000Z')
    expect(result).toBe('February 25, 2027')
  })
})

describe('formatAmount()', () => {
  it('should format a number as USD currency', () => {
    const result = formatAmount(99.99)
    expect(result).toBe('$99.99')
  })

  it('should format whole numbers correctly', () => {
    const result = formatAmount(100)
    expect(result).toBe('$100.00')
  })

  it('should format zero correctly', () => {
    const result = formatAmount(0)
    expect(result).toBe('$0.00')
  })
})