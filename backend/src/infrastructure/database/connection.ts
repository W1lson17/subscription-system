import { Pool } from 'pg';
import { logger } from '@shared/utils';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'subscriptions_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err.message });
});

export const connectDatabase = async (): Promise<void> => {
  const client = await pool.connect();
  client.release();
  logger.info('Database connected successfully');
};

export default pool;