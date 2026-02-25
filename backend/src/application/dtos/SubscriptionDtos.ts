import { PaymentMethod, SubscriptionStatus } from '@domain/entities/Subscription';

export interface CreateSubscriptionDto {
  userId: string;
  userEmail: string;
  userName: string;
  paymentMethod: PaymentMethod;
  amount: number;
}

export interface SubscriptionResponseDto {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}