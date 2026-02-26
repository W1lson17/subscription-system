import { describe, it, expect, beforeEach } from 'vitest'
import { useSubscriptionStore } from './useSubscriptionStore'
import type { Subscription } from '@/domain/subscription/Subscription'

const mockSubscription: Subscription = {
  id: 'sub-123',
  userId: 'user-123',
  userEmail: 'test@example.com',
  userName: 'John Doe',
  status: 'ACTIVE',
  paymentMethod: 'CREDIT_CARD',
  amount: 99.99,
  startDate: '2026-02-25T00:00:00.000Z',
  endDate: '2027-02-25T00:00:00.000Z',
  createdAt: '2026-02-25T00:00:00.000Z',
}

describe('useSubscriptionStore', () => {
  beforeEach(() => {
    useSubscriptionStore.setState({
      currentSubscription: null,
      notifications: [],
    })
  })

  describe('setCurrentSubscription()', () => {
    it('should set the current subscription', () => {
      useSubscriptionStore.getState().setCurrentSubscription(mockSubscription)
      expect(useSubscriptionStore.getState().currentSubscription).toEqual(mockSubscription)
    })

    it('should clear the current subscription when null is passed', () => {
      useSubscriptionStore.getState().setCurrentSubscription(mockSubscription)
      useSubscriptionStore.getState().setCurrentSubscription(null)
      expect(useSubscriptionStore.getState().currentSubscription).toBeNull()
    })
  })

  describe('addNotification()', () => {
    it('should add a notification', () => {
      useSubscriptionStore.getState().addNotification('Payment successful', 'success')
      const { notifications } = useSubscriptionStore.getState()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].message).toBe('Payment successful')
      expect(notifications[0].type).toBe('success')
    })

    it('should add multiple notifications', () => {
      useSubscriptionStore.getState().addNotification('First', 'success')
      useSubscriptionStore.getState().addNotification('Second', 'error')
      expect(useSubscriptionStore.getState().notifications).toHaveLength(2)
    })
  })

  describe('removeNotification()', () => {
    it('should remove a notification by id', () => {
      useSubscriptionStore.getState().addNotification('Test', 'info')
      const { notifications } = useSubscriptionStore.getState()
      const id = notifications[0].id
      useSubscriptionStore.getState().removeNotification(id)
      expect(useSubscriptionStore.getState().notifications).toHaveLength(0)
    })
  })

  describe('clearNotifications()', () => {
    it('should clear all notifications', () => {
      useSubscriptionStore.getState().addNotification('First', 'success')
      useSubscriptionStore.getState().addNotification('Second', 'error')
      useSubscriptionStore.getState().clearNotifications()
      expect(useSubscriptionStore.getState().notifications).toHaveLength(0)
    })
  })
})