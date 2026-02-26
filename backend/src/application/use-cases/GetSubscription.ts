import { SubscriptionRepository } from '@domain/ports/SubscriptionRepository';
import { SubscriptionResponseDto } from '@application/dtos/SubscriptionDtos';
import { NotFoundError } from '@shared/errors';
import { Subscription } from '@domain/entities/Subscription';

export class GetSubscription {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository
  ) { }

  async execute(subscriptionId: string): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);

    if (!subscription) {
      throw new NotFoundError('Subscription');
    }

    return this.toResponseDto(subscription);
  }

  private toResponseDto(subscription: Subscription): SubscriptionResponseDto {
    return {
      id: subscription.id,
      userId: subscription.userId,
      userEmail: subscription.userEmail,
      userName: subscription.userName,
      status: subscription.status,
      paymentMethod: subscription.paymentMethod,
      amount: subscription.amount,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      createdAt: subscription.createdAt,
    };
  }
}