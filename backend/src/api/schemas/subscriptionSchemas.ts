import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  userEmail: z.email({ message: 'Invalid email format' }),
  userName: z.string().min(2, 'userName must be at least 2 characters'),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL'], {
    message: 'Invalid payment method. Must be CREDIT_CARD, DEBIT_CARD or PAYPAL',
  }),
  amount: z.number().positive('Amount must be greater than zero'),
});

export const getSubscriptionSchema = z.object({
  id: z.string().uuid('Invalid subscription ID format'),
})

export type CreateSubscriptionRequest = z.infer<typeof createSubscriptionSchema>;