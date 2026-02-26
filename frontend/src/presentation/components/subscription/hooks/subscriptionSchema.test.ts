import { describe, it, expect } from 'vitest'
import { subscriptionSchema } from './subscriptionSchema'

describe('subscriptionSchema', () => {
  const validData = {
    userId: 'user-123',
    userEmail: 'test@example.com',
    userName: 'John Doe',
    paymentMethod: 'CREDIT_CARD' as const,
    amount: 99.99,
  }

  it('should pass with valid data', () => {
    const result = subscriptionSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should fail when userId is empty', () => {
    const result = subscriptionSchema.safeParse({ ...validData, userId: '' })
    expect(result.success).toBe(false)
  })

  it('should fail when userEmail is invalid', () => {
    const result = subscriptionSchema.safeParse({ ...validData, userEmail: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('should fail when userName is less than 2 characters', () => {
    const result = subscriptionSchema.safeParse({ ...validData, userName: 'J' })
    expect(result.success).toBe(false)
  })

  it('should fail when paymentMethod is invalid', () => {
    const result = subscriptionSchema.safeParse({ ...validData, paymentMethod: 'BITCOIN' })
    expect(result.success).toBe(false)
  })

  it('should fail when amount is zero', () => {
    const result = subscriptionSchema.safeParse({ ...validData, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('should fail when amount is negative', () => {
    const result = subscriptionSchema.safeParse({ ...validData, amount: -10 })
    expect(result.success).toBe(false)
  })

  it('should return correct error message when userId is empty', () => {
    const result = subscriptionSchema.safeParse({ ...validData, userId: '' })
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('User ID is required')
    }
  })
})