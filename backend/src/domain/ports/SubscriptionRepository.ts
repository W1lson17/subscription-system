import { Subscription } from '@domain/entities/Subscription';

export interface SubscriptionRepository {
  save(subscription: Subscription): Promise<void>;
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription | null>;
  update(subscription: Subscription): Promise<void>;
}