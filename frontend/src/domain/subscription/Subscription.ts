export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL';

export interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CreateSubscriptionPayload {
  userId: string;
  userEmail: string;
  userName: string;
  paymentMethod: PaymentMethod;
  amount: number;
}