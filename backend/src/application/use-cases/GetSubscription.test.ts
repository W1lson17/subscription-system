import { GetSubscription } from './GetSubscription';
import { SubscriptionRepository } from '@domain/ports/SubscriptionRepository';
import { NotFoundError } from '@shared/errors';
import { Subscription } from '@domain/entities/Subscription';

const mockRepository: jest.Mocked<SubscriptionRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
};

describe('GetSubscription', () => {
  let useCase: GetSubscription;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetSubscription(mockRepository);
  });

  it('should return subscription when found', async () => {
    const sub = Subscription.create({
      id: 'sub-123',
      userId: 'user-123',
      userEmail: 'test@example.com',
      userName: 'John Doe',
      paymentMethod: 'CREDIT_CARD',
      amount: 99.99,
    });

    mockRepository.findById.mockResolvedValue(sub);

    const result = await useCase.execute('sub-123');

    expect(result.id).toBe('sub-123');
    expect(result.status).toBe('ACTIVE');
  });

  it('should throw NotFoundError when subscription does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundError);
  });
});