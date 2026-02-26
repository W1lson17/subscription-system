import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useCreateSubscription } from '@/application/subscription/useSubscription'
import { useSubscriptionStore } from '@/application/subscription/useSubscriptionStore'
import { subscriptionSchema, type SubscriptionFormValues } from './subscriptionSchema'

export const useSubscriptionForm = () => {
  const { mutate, isPending } = useCreateSubscription()
  const { setCurrentSubscription, addNotification } = useSubscriptionStore()
  const navigate = useNavigate()

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      userId: '',
      userEmail: '',
      userName: '',
      amount: 0,
    },
  })

  const onSubmit = (values: SubscriptionFormValues) => {
    mutate(values, {
      onSuccess: (data) => {
        setCurrentSubscription(data)
        addNotification('Payment successful! Your subscription is now active.', 'success')
        toast.success('Subscription created successfully!')
        form.reset()
        navigate(`/dashboard/${data.id}`)
      },
      onError: (error) => {
        addNotification(error.message, 'error')
        toast.error(error.message)
      },
    })
  }

  return { form, onSubmit, isPending }
}