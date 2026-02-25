import axios from 'axios';
import { WebhookService, WebhookPayload } from '@domain/ports/WebhookService';
import { logger } from '@shared/utils';

export class WebhookNotifier implements WebhookService {
  private readonly url: string;
  private readonly timeout: number;
  private readonly maxRetries: number;
  private readonly retryDelay: number;

  constructor() {
    this.url = process.env.WEBHOOK_URL || '';
    this.timeout = Number(process.env.WEBHOOK_TIMEOUT_MS) || 5000;
    this.maxRetries = Number(process.env.WEBHOOK_MAX_RETRIES) || 3;
    this.retryDelay = Number(process.env.WEBHOOK_RETRY_DELAY_MS) || 1000;
  }

  async notify(payload: WebhookPayload): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await axios.post(this.url, payload, {
          timeout: this.timeout,
          headers: { 'Content-Type': 'application/json' },
        });

        logger.info('Webhook notified successfully', {
          attempt,
          event: payload.event,
          subscriptionId: payload.subscriptionId,
        });

        return;
      } catch (error) {
        lastError = error as Error;

        logger.warn('Webhook attempt failed', {
          attempt,
          maxRetries: this.maxRetries,
          event: payload.event,
          error: lastError.message,
        });

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    logger.error('Webhook failed after all retries', {
      maxRetries: this.maxRetries,
      event: payload.event,
      subscriptionId: payload.subscriptionId,
      error: lastError?.message,
    });

    throw new Error(`Webhook failed after ${this.maxRetries} retries: ${lastError?.message}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}