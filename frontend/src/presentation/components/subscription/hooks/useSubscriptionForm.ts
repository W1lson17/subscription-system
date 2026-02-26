import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useCreateSubscription } from '@/application/subscription/useSubscription'
import { useSubscriptionStore } from '@/application/subscription/useSubscriptionStore'

export const subscriptionSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  userEmail: z.email({ message: 'Invalid email format' }),
  userName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL'], {
    message: 'Please select a payment method',
  }),
  amount: z.coerce.number().positive({ message: 'Amount must be greater than zero' }),
})

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>

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