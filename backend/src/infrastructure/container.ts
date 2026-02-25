import pool from '@infrastructure/database/connection';
import { PostgresSubscriptionRepository } from '@infrastructure/database/PostgresSubscriptionRepository';
import { WebhookNotifier } from '@infrastructure/webhook/WebhookNotifier';
import { SubscribeUser } from '@application/use-cases/SubscribeUser';
import { GetSubscription } from '@application/use-cases/GetSubscription';
import { SubscriptionController } from '@api/controllers/SubscriptionController';

// Infrastructure
const subscriptionRepository = new PostgresSubscriptionRepository(pool);
const webhookNotifier = new WebhookNotifier();

// Use cases
const subscribeUser = new SubscribeUser(subscriptionRepository, webhookNotifier);
const getSubscription = new GetSubscription(subscriptionRepository);

// Controllers
export const subscriptionController = new SubscriptionController(
  subscribeUser,
  getSubscription
);