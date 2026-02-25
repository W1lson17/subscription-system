import path from 'path';
import dotenv from 'dotenv';
import app from './app';
import { connectDatabase } from '@infrastructure/database/connection';
import { logger } from '@shared/utils';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  await connectDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start().catch((error) => {
  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});