import { Subscription } from './Subscription';
import { DomainError } from '@shared/errors';

const makeSubscription = (overrides = {}) =>
  Subscription.create({
    id: 'sub-123',
    userId: 'user-123',
    userEmail: 'test@example.com',
    userName: 'John Doe',
    paymentMethod: 'CREDIT_CARD',
    amount: 99.99,
    ...overrides,
  });

describe('Subscription Entity', () => {
  describe('create()', () => {
    it('should create a subscription with ACTIVE status', () => {
      const sub = makeSubscription();
      expect(sub.status).toBe('ACTIVE');
    });

    it('should set endDate one year from now', () => {
      const sub = makeSubscription();
      const expectedYear = new Date().getFullYear() + 1;
      expect(sub.endDate.getFullYear()).toBe(expectedYear);
    });

    it('should throw DomainError for invalid email', () => {
      expect(() => makeSubscription({ userEmail: 'invalid-email' }))
        .toThrow(DomainError);
    });

    it('should throw DomainError for amount <= 0', () => {
      expect(() => makeSubscription({ amount: 0 }))
        .toThrow(DomainError);
    });

    it('should throw DomainError for negative amount', () => {
      expect(() => makeSubscription({ amount: -10 }))
        .toThrow(DomainError);
    });
  });

  describe('cancel()', () => {
    it('should cancel an active subscription', () => {
      const sub = makeSubscription();
      sub.cancel();
      expect(sub.status).toBe('CANCELLED');
    });

    it('should throw DomainError when cancelling an already cancelled subscription', () => {
      const sub = makeSubscription();
      sub.cancel();
      expect(() => sub.cancel()).toThrow(DomainError);
    });

    it('should throw DomainError when cancelling an expired subscription', () => {
      const sub = makeSubscription();
      sub.expire();
      expect(() => sub.cancel()).toThrow(DomainError);
    });
  });

  describe('expire()', () => {
    it('should expire an active subscription', () => {
      const sub = makeSubscription();
      sub.expire();
      expect(sub.status).toBe('EXPIRED');
    });

    it('should throw DomainError when expiring a non-active subscription', () => {
      const sub = makeSubscription();
      sub.cancel();
      expect(() => sub.expire()).toThrow(DomainError);
    });
  });

  describe('isActive()', () => {
    it('should return true for a fresh active subscription', () => {
      const sub = makeSubscription();
      expect(sub.isActive()).toBe(true);
    });

    it('should return false for a cancelled subscription', () => {
      const sub = makeSubscription();
      sub.cancel();
      expect(sub.isActive()).toBe(false);
    });
  });

  describe('reconstitute()', () => {
    it('should reconstitute a subscription from existing props', () => {
      const now = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      const sub = Subscription.reconstitute({
        id: 'sub-123',
        userId: 'user-123',
        userEmail: 'test@example.com',
        userName: 'John Doe',
        status: 'ACTIVE',
        paymentMethod: 'CREDIT_CARD',
        amount: 99.99,
        startDate: now,
        endDate,
        createdAt: now,
        updatedAt: now,
      });

      expect(sub.id).toBe('sub-123');
      expect(sub.status).toBe('ACTIVE');
      expect(sub.userEmail).toBe('test@example.com');
    });
  });

  describe('getters', () => {
    it('should return all props correctly', () => {
      const sub = makeSubscription();

      expect(sub.id).toBe('sub-123');
      expect(sub.userId).toBe('user-123');
      expect(sub.userEmail).toBe('test@example.com');
      expect(sub.userName).toBe('John Doe');
      expect(sub.paymentMethod).toBe('CREDIT_CARD');
      expect(sub.amount).toBe(99.99);
      expect(sub.startDate).toBeInstanceOf(Date);
      expect(sub.endDate).toBeInstanceOf(Date);
      expect(sub.createdAt).toBeInstanceOf(Date);
      expect(sub.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('toJSON()', () => {
    it('should return a plain object with all props', () => {
      const sub = makeSubscription();
      const json = sub.toJSON();

      expect(json.id).toBe('sub-123');
      expect(json.status).toBe('ACTIVE');
      expect(json.userEmail).toBe('test@example.com');
      expect(json.amount).toBe(99.99);
    });
  });
});