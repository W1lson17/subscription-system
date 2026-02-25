import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/presentation/components/ui/sonner'
import { SubscriptionPage } from '@/presentation/pages/SubscriptionPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SubscriptionPage />
      <Toaster richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App