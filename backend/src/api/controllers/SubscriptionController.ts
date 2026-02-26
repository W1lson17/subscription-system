import { Request, Response, NextFunction } from 'express';
import { SubscribeUser } from '@application/use-cases/SubscribeUser';
import { GetSubscription } from '@application/use-cases/GetSubscription';

export class SubscriptionController {
  constructor(
    private readonly subscribeUser: SubscribeUser,
    private readonly getSubscription: GetSubscription
  ) { }

  subscribe = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.subscribeUser.execute(req.body);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getSubscription.execute(req.params.id);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}