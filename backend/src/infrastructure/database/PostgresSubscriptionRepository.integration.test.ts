import { randomUUID } from 'crypto';
import { PostgresSubscriptionRepository } from './PostgresSubscriptionRepository';
import { Subscription } from '@domain/entities/Subscription';
import { getTestPool, closeTestPool, cleanDatabase } from './testConnection';

const makeSubscription = (overrides = {}) =>
  Subscription.create({
    id: randomUUID(),
    userId: randomUUID(),
    userEmail: 'test@example.com',
    userName: 'John Doe',
    paymentMethod: 'CREDIT_CARD',
    amount: 99.99,
    ...overrides,
  });

describe('PostgresSubscriptionRepository (integration)', () => {
  let repository: PostgresSubscriptionRepository;

  beforeAll(() => {
    repository = new PostgresSubscriptionRepository(getTestPool());
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await closeTestPool();
  });

  describe('save()', () => {
    it('should persist a subscription to the database', async () => {
      const subscription = makeSubscription();

      await repository.save(subscription);

      const found = await repository.findById(subscription.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(subscription.id);
      expect(found?.status).toBe('ACTIVE');
    });

    it('should persist all fields correctly', async () => {
      const subscription = makeSubscription({
        userEmail: 'specific@example.com',
        paymentMethod: 'PAYPAL',
        amount: 49.99,
      });

      await repository.save(subscription);

      const found = await repository.findById(subscription.id);
      expect(found?.userEmail).toBe('specific@example.com');
      expect(found?.paymentMethod).toBe('PAYPAL');
      expect(found?.amount).toBe(49.99);
    });
  });

  describe('findById()', () => {
    it('should return null when subscription does not exist', async () => {
      const found = await repository.findById(randomUUID());
      expect(found).toBeNull();
    });

    it('should return subscription when it exists', async () => {
      const subscription = makeSubscription();
      await repository.save(subscription);

      const found = await repository.findById(subscription.id);
      expect(found?.id).toBe(subscription.id);
    });
  });

  describe('findByUserId()', () => {
    it('should return null when user has no subscriptions', async () => {
      const found = await repository.findByUserId('non-existent-user');
      expect(found).toBeNull();
    });

    it('should return the most recent subscription for a user', async () => {
      const userId = randomUUID(); // ← UUID válido
      const first = makeSubscription({ userId, id: randomUUID() });
      await repository.save(first);

      await new Promise((resolve) => setTimeout(resolve, 10));

      const second = makeSubscription({ userId, id: randomUUID() });
      await repository.save(second);

      const found = await repository.findByUserId(userId);
      expect(found?.id).toBe(second.id);
    });
  });

  describe('update()', () => {
    it('should update subscription status', async () => {
      const subscription = makeSubscription();
      await repository.save(subscription);

      subscription.cancel();
      await repository.update(subscription);

      const updated = await repository.findById(subscription.id);
      expect(updated?.status).toBe('CANCELLED');
    });

    it('should update updatedAt timestamp', async () => {
      const subscription = makeSubscription();
      await repository.save(subscription);

      const originalUpdatedAt = subscription.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 10));
      subscription.cancel();
      await repository.update(subscription);

      const updated = await repository.findById(subscription.id);
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });
  });
});