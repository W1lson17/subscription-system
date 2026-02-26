import axios from 'axios';
import { WebhookNotifier } from './WebhookNotifier';
import { WebhookPayload } from '@domain/ports/WebhookService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const payload: WebhookPayload = {
  event: 'PAYMENT_SUCCESS',
  subscriptionId: 'sub-123',
  userId: 'user-123',
  userEmail: 'test@example.com',
  amount: 99.99,
  timestamp: new Date(),
};

describe('WebhookNotifier (integration)', () => {
  let notifier: WebhookNotifier;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.WEBHOOK_URL = 'http://localhost:9999/webhook';
    process.env.WEBHOOK_TIMEOUT_MS = '1000';
    process.env.WEBHOOK_MAX_RETRIES = '3';
    process.env.WEBHOOK_RETRY_DELAY_MS = '100';
    notifier = new WebhookNotifier();
  });

  it('should notify webhook successfully', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200, data: { ok: true } });

    await notifier.notify(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:9999/webhook',
      payload,
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    );
  });

  it('should retry on failure and succeed on second attempt', async () => {
    mockedAxios.post
      .mockRejectedValueOnce(new Error('Service unavailable'))
      .mockResolvedValueOnce({ status: 200, data: { ok: true } });

    await notifier.notify(payload);

    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
  });

  it('should throw after exhausting all retries', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Service unavailable'));

    await expect(notifier.notify(payload)).rejects.toThrow(
      'Webhook failed after 3 retries'
    );

    expect(mockedAxios.post).toHaveBeenCalledTimes(3);
  });

  it('should use exponential backoff between retries', async () => {
    const delays: number[] = [];
    const originalSetTimeout = global.setTimeout;

    jest.spyOn(global, 'setTimeout').mockImplementation((fn: any, ms?: number) => {
      delays.push(ms || 0);
      return originalSetTimeout(fn, 0);
    });

    mockedAxios.post.mockRejectedValue(new Error('Service unavailable'));

    await expect(notifier.notify(payload)).rejects.toThrow();

    expect(delays[0]).toBe(100);  // retryDelay * 1
    expect(delays[1]).toBe(200);  // retryDelay * 2

    jest.restoreAllMocks();
  });
});