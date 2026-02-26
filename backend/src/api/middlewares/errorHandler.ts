import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors';
import { logger } from '@shared/utils';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    logger.warn('Controlled error', {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    });

    res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
    });
    return;
  }

  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
  });

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};