import { createBrowserRouter } from 'react-router'
import { lazy, Suspense } from 'react'
import { FullscreenLoader } from '../components/custom/FullScreenLoader'

const SubscriptionPage = lazy(() =>
  import('@/presentation/pages/SubscriptionPage').then((m) => ({
    default: m.SubscriptionPage,
  }))
)

const DashboardPage = lazy(() =>
  import('@/presentation/pages/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  }))
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<FullscreenLoader />}>
        <SubscriptionPage />
      </Suspense>
    ),
  },
  {
    path: '/dashboard/:id',
    element: (
      <Suspense fallback={<FullscreenLoader />}>
        <DashboardPage />
      </Suspense>
    ),
  },
])