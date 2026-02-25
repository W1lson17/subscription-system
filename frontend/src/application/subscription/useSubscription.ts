import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionRepository } from '@/infrastructure/repositories/SubscriptionRepository'
import type { CreateSubscriptionPayload } from '@/domain/subscription/Subscription'

export const SUBSCRIPTION_KEYS = {
  all: ['subscriptions'] as const,
  byId: (id: string) => ['subscriptions', id] as const,
}

export const useGetSubscription = (id: string) => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.byId(id),
    queryFn: () => subscriptionRepository.findById(id),
    enabled: !!id,
    retry: 2,
  })
}

export const useCreateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      subscriptionRepository.create(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(SUBSCRIPTION_KEYS.byId(data.id), data)
    },
  })
}