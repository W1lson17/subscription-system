import { Badge } from '@/presentation/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import type { Subscription, SubscriptionStatus } from '@/domain/subscription/Subscription'
import { formatAmount, formatDate } from '@/lib/formatters';

const statusConfig: Record<SubscriptionStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  ACTIVE: { label: 'Active', variant: 'default' },
  EXPIRED: { label: 'Expired', variant: 'secondary' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
}

interface SubscriptionDashboardProps {
  subscription: Subscription
}

export const SubscriptionDashboard = ({ subscription }: SubscriptionDashboardProps) => {
const { label, variant } = statusConfig[subscription.status]

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Subscription</CardTitle>
        <Badge variant={variant}>{label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium">{subscription.userName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{subscription.userEmail}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Method</span>
          <span className="font-medium">{subscription.paymentMethod.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-medium">{formatAmount(subscription.amount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Start Date</span>
          <span className="font-medium">{formatDate(subscription.startDate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">End Date</span>
          <span className="font-medium">{formatDate(subscription.endDate)}</span>
        </div>
      </CardContent>
    </Card>
  )
}