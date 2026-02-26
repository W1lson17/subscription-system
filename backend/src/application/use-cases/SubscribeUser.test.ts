import { SubscribeUser } from './SubscribeUser';
import { SubscriptionRepository } from '@domain/ports/SubscriptionRepository';
import { WebhookService } from '@domain/ports/WebhookService';
import { ConflictError } from '@shared/errors';
import { Subscription } from '@domain/entities/Subscription';

const makeSubscription = () =>
  Subscription.create({
    id: 'sub-123',
    userId: 'user-123',
    userEmail: 'test@example.com',
    userName: 'John Doe',
    paymentMethod: 'CREDIT_CARD',
    amount: 99.99,
  });

const mockRepository: jest.Mocked<SubscriptionRepository> = {
  save: jest.fn(),
  findById: jest.fn(),
  findByUserId: jest.fn(),
  update: jest.fn(),
};

const mockWebhook: jest.Mocked<WebhookService> = {
  notify: jest.fn(),
};

const dto = {
  userId: 'user-123',
  userEmail: 'test@example.com',
  userName: 'John Doe',
  paymentMethod: 'CREDIT_CARD' as const,
  amount: 99.99,
};

describe('SubscribeUser', () => {
  let useCase: SubscribeUser;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SubscribeUser(mockRepository, mockWebhook);
  });

  it('should create a subscription successfully', async () => {
    mockRepository.findByUserId.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue();
    mockWebhook.notify.mockResolvedValue();

    const result = await useCase.execute(dto);

    expect(result.status).toBe('ACTIVE');
    expect(result.userEmail).toBe('test@example.com');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockWebhook.notify).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'PAYMENT_SUCCESS' })
    );
  });

  it('should throw ConflictError if user already has active subscription', async () => {
    mockRepository.findByUserId.mockResolvedValue(makeSubscription());

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictError);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should still create subscription if webhook fails', async () => {
    mockRepository.findByUserId.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue();
    mockWebhook.notify.mockRejectedValue(new Error('Webhook timeout'));

    const result = await useCase.execute(dto);

    expect(result.status).toBe('ACTIVE');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});