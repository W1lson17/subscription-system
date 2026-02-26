import { Subscription } from '@domain/entities/Subscription';
import { SubscriptionRepository } from '@domain/ports/SubscriptionRepository';
import { WebhookService } from '@domain/ports/WebhookService';
import { CreateSubscriptionDto, SubscriptionResponseDto } from '@application/dtos/SubscriptionDtos';
import { ConflictError } from '@shared/errors';
import { generateId } from '@shared/utils';
import { logger } from '@shared/utils';

export class SubscribeUser {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly webhookService: WebhookService
  ) { }

  async execute(dto: CreateSubscriptionDto): Promise<SubscriptionResponseDto> {
    // 1. Verificar si el usuario ya tiene suscripción activa
    const existing = await this.subscriptionRepository.findByUserId(dto.userId);
    if (existing && existing.isActive()) {
      throw new ConflictError('User already has an active subscription');
    }

    // 2. Crear la entidad — las reglas de negocio se validan aquí
    const subscription = Subscription.create({
      id: generateId(),
      ...dto,
    });

    // 3. Persistir
    await this.subscriptionRepository.save(subscription);
    logger.info('Subscription created', { subscriptionId: subscription.id });

    // 4. Notificar webhook — si falla no debe romper la suscripción
    try {
      await this.webhookService.notify({
        event: 'PAYMENT_SUCCESS',
        subscriptionId: subscription.id,
        userId: subscription.userId,
        userEmail: subscription.userEmail,
        amount: subscription.amount,
        timestamp: new Date(),
      });
    } catch (error) {
      logger.warn('Webhook notification failed', { subscriptionId: subscription.id });
    }

    // 5. Retornar DTO de respuesta
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