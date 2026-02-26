import { Router } from 'express'
import { SubscriptionController } from '@api/controllers/SubscriptionController'
import { validateRequest } from '@api/middlewares/validateRequest'
import { createSubscriptionSchema, getSubscriptionSchema } from '@api/schemas/subscriptionSchemas'

export const createSubscriptionRouter = (
  controller: SubscriptionController
): Router => {
  const router = Router()

  router.post(
    '/',
    validateRequest({ body: createSubscriptionSchema }),
    controller.subscribe
  )

  router.get(
    '/:id',
    validateRequest({ params: getSubscriptionSchema }),
    controller.getById
  )

  return router
}