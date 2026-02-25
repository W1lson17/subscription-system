import { Router } from 'express';
import { SubscriptionController } from '@api/controllers/SubscriptionController';
import { validateRequest } from '@api/middlewares/validateRequest';
import { createSubscriptionSchema } from '@api/schemas/subscriptionSchemas';

export const createSubscriptionRouter = (
  controller: SubscriptionController
): Router => {
  const router = Router();

  router.post(
    '/',
    validateRequest(createSubscriptionSchema),
    controller.subscribe
  );

  router.get('/:id', controller.getById);

  return router;
};