import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errorHandler';
import { AppError, NotFoundError, ConflictError } from '@shared/errors';

const mockRequest = {} as Request;
const mockNext = jest.fn() as NextFunction;

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler middleware', () => {
  it('should handle AppError with correct status code', () => {
    const res = mockResponse();
    const error = new NotFoundError('Subscription');

    errorHandler(error, mockRequest, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        code: 'NOT_FOUND',
      })
    );
  });

  it('should handle ConflictError with 409 status', () => {
    const res = mockResponse();
    const error = new ConflictError('User already has an active subscription');

    errorHandler(error, mockRequest, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        code: 'CONFLICT',
      })
    );
  });

  it('should handle unknown errors with 500 status', () => {
    const res = mockResponse();
    const error = new Error('Unexpected error');

    errorHandler(error, mockRequest, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
      })
    );
  });

  it('should handle AppError subclass correctly', () => {
    const res = mockResponse();
    const error = new AppError('Custom error', 422, 'CUSTOM_ERROR');

    errorHandler(error, mockRequest, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        code: 'CUSTOM_ERROR',
        message: 'Custom error',
      })
    );
  });
});