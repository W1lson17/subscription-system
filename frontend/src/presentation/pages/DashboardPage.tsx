import { useParams, useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useGetSubscription } from '@/application/subscription/useSubscription'
import { SubscriptionDashboard } from '@/presentation/components/subscription/SubscriptionDashboard'
import { Button } from '@/presentation/components/ui/button'
import { FullscreenLoader } from '../components/custom/FullScreenLoader'

export const DashboardPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useGetSubscription(id ?? '')

  if (isLoading) return <FullscreenLoader />

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">{error.message}</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <Button variant="outline" onClick={() => navigate('/')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        New Subscription
      </Button>

      {data && <SubscriptionDashboard subscription={data} />}
    </div>
  )
}