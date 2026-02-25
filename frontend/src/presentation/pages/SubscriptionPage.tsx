import { SubscriptionForm } from '@/presentation/components/subscription/SubscriptionForm'
import { SubscriptionDashboard } from '@/presentation/components/subscription/SubscriptionDashboard'
import { useSubscriptionStore } from '@/application/subscription/useSubscriptionStore'

export const SubscriptionPage = () => {
  const { currentSubscription } = useSubscriptionStore()

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Subscription System</h1>
        <p className="text-muted-foreground mt-2">
          Manage your premium subscription
        </p>
      </div>

      {currentSubscription ? (
        <SubscriptionDashboard subscription={currentSubscription} />
      ) : (
        <SubscriptionForm />
      )}
    </div>
  )
}