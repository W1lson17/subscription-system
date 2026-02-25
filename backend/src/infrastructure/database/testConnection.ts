import { Pool } from 'pg';

let testPool: Pool | null = null;

export const getTestPool = (): Pool => {
  if (!testPool) {
    testPool = new Pool({
      host: 'localhost',
      port: 5433,
      user: 'postgres',
      password: 'postgres',
      database: 'subscriptions_test_db',
      max: 5,
    });
  }
  return testPool;
};

export const closeTestPool = async (): Promise<void> => {
  if (testPool) {
    await testPool.end();
    testPool = null;
  }
};

export const cleanDatabase = async (): Promise<void> => {
  const pool = getTestPool();
  await pool.query('TRUNCATE TABLE subscriptions RESTART IDENTITY CASCADE');
};