import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createSubscriptionRouter } from '@api/routes/subscriptionRoutes';
import { subscriptionController } from '@infrastructure/container';
import { errorHandler } from '@api/middlewares/errorHandler';

const app: Express = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/subscriptions', createSubscriptionRouter(subscriptionController));

// 404 handler — rutas no encontradas
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: 'Route not found',
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler — debe ser el último middleware
app.use(errorHandler);

export default app;