import { z } from 'zod'

export const subscriptionSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required' }),
  userEmail: z.email({ message: 'Invalid email format' }),
  userName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL'], {
    message: 'Please select a payment method',
  }),
  amount: z.coerce.number<number>().positive({ message: 'Amount must be greater than zero' }),
})

export type SubscriptionFormValues = z.infer<typeof subscriptionSchema>