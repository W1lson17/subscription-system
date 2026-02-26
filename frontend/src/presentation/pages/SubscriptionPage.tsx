import { SubscriptionForm } from '@/presentation/components/subscription/SubscriptionForm'

export const SubscriptionPage = () => {
  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Subscription System</h1>
        <p className="text-muted-foreground mt-2">
          Manage your premium subscription
        </p>
      </div>
      <SubscriptionForm />
    </div>
  )
}