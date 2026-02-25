import { Request, Response, NextFunction } from 'express';
import { SubscriptionController } from './SubscriptionController';
import { SubscribeUser } from '@application/use-cases/SubscribeUser';
import { GetSubscription } from '@application/use-cases/GetSubscription';
import { NotFoundError, ConflictError } from '@shared/errors';

const mockSubscribeUser = {
  execute: jest.fn(),
} as unknown as jest.Mocked<SubscribeUser>;

const mockGetSubscription = {
  execute: jest.fn(),
} as unknown as jest.Mocked<GetSubscription>;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe('SubscriptionController', () => {
  let controller: SubscriptionController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new SubscriptionController(mockSubscribeUser, mockGetSubscription);
  });

  describe('subscribe()', () => {
    it('should return 201 with subscription data on success', async () => {
      const req = { body: { userId: 'user-001' } } as Request;
      const res = mockResponse();
      const subscriptionData = { id: 'sub-123', status: 'ACTIVE' };

      mockSubscribeUser.execute.mockResolvedValue(subscriptionData as any);

      await controller.subscribe(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: subscriptionData,
      });
    });

    it('should call next with error when use case throws', async () => {
      const req = { body: {} } as Request;
      const res = mockResponse();
      const error = new ConflictError('User already has an active subscription');

      mockSubscribeUser.execute.mockRejectedValue(error);

      await controller.subscribe(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('getById()', () => {
    it('should return 200 with subscription data on success', async () => {
      const req = { params: { id: 'sub-123' } } as Request<{ id: string }>;
      const res = mockResponse();
      const subscriptionData = { id: 'sub-123', status: 'ACTIVE' };

      mockGetSubscription.execute.mockResolvedValue(subscriptionData as any);

      await controller.getById(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: subscriptionData,
      });
    });

    it('should call next with error when subscription not found', async () => {
      const req = { params: { id: 'non-existent' } } as Request<{ id: string }>;
      const res = mockResponse();
      const error = new NotFoundError('Subscription');

      mockGetSubscription.execute.mockRejectedValue(error);

      await controller.getById(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});