import { apiClient } from '@/infrastructure/http/axiosClient'
import type { Subscription, CreateSubscriptionPayload } from '@/domain/subscription/Subscription'

export interface ISubscriptionRepository {
  create(payload: CreateSubscriptionPayload): Promise<Subscription>
  findById(id: string): Promise<Subscription>
}

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(payload: CreateSubscriptionPayload): Promise<Subscription> {
    const response = await apiClient.post<{ status: string; data: Subscription }>(
      '/subscriptions',
      payload
    )
    return response.data.data!
  }

  async findById(id: string): Promise<Subscription> {
    const response = await apiClient.get<{ status: string; data: Subscription }>(
      `/subscriptions/${id}`
    )
    return response.data.data!
  }
}

export const subscriptionRepository = new SubscriptionRepository()