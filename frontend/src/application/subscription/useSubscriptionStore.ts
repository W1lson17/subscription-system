import { create } from 'zustand'
import type { Subscription } from '@/domain/subscription/Subscription'

interface NotificationMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface SubscriptionStore {
  // State
  currentSubscription: Subscription | null
  notifications: NotificationMessage[]

  // Actions
  setCurrentSubscription: (subscription: Subscription | null) => void
  addNotification: (message: string, type: NotificationMessage['type']) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  currentSubscription: null,
  notifications: [],

  setCurrentSubscription: (subscription) =>
    set({ currentSubscription: subscription }),

  addNotification: (message, type) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: crypto.randomUUID(), message, type },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}))