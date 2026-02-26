export interface WebhookPayload {
  event: 'PAYMENT_SUCCESS' | 'SUBSCRIPTION_CANCELLED' | 'SUBSCRIPTION_EXPIRED';
  subscriptionId: string;
  userId: string;
  userEmail: string;
  amount: number;
  timestamp: Date;
}

export interface WebhookService {
  notify(payload: WebhookPayload): Promise<void>;
}