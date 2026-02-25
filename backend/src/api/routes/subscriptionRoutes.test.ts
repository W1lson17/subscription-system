import request from 'supertest';
import app from '../../app';

const mockSubscribe = jest.fn();
const mockGetById = jest.fn();

jest.mock('@infrastructure/container', () => ({
  subscriptionController: {
    subscribe: (req: any, res: any, next: any) => mockSubscribe(req, res, next),
    getById: (req: any, res: any, next: any) => mockGetById(req, res, next),
  },
}));

const validPayload = {
  userId: 'user-001',
  userEmail: 'john@example.com',
  userName: 'John Doe',
  paymentMethod: 'CREDIT_CARD',
  amount: 99.99,
};

describe('Subscription Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/subscriptions', () => {
    it('should pass valid payload to controller', async () => {
      mockSubscribe.mockImplementation((_req, res) => {
        res.status(201).json({ status: 'success', data: { id: 'sub-123' } });
      });

      const response = await request(app)
        .post('/api/subscriptions')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(mockSubscribe).toHaveBeenCalledTimes(1);
    });

    it('should return 400 for invalid payload', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .send({ userEmail: 'invalid', amount: -10 });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid paymentMethod', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .send({ ...validPayload, paymentMethod: 'BITCOIN' });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].field).toBe('paymentMethod');
    });
  });

  describe('GET /api/subscriptions/:id', () => {
    it('should pass id to controller', async () => {
      mockGetById.mockImplementation((_req, res) => {
        res.status(200).json({ status: 'success', data: { id: 'sub-123' } });
      });

      const response = await request(app).get('/api/subscriptions/sub-123');

      expect(response.status).toBe(200);
      expect(mockGetById).toHaveBeenCalledTimes(1);
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.code).toBe('NOT_FOUND');
    });
  });
});