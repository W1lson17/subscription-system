import { Pool } from 'pg';
import { Subscription, SubscriptionStatus, PaymentMethod } from '@domain/entities/Subscription';
import { SubscriptionRepository } from '@domain/ports/SubscriptionRepository';

interface SubscriptionDatabaseRow {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  status: SubscriptionStatus;
  payment_method: PaymentMethod;
  amount: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export class PostgresSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly pool: Pool) { }

  async save(subscription: Subscription): Promise<void> {
    const query = `
      INSERT INTO subscriptions (
        id, user_id, user_email, user_name, status,
        payment_method, amount, start_date, end_date,
        created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    `;

    await this.pool.query(query, [
      subscription.id,
      subscription.userId,
      subscription.userEmail,
      subscription.userName,
      subscription.status,
      subscription.paymentMethod,
      subscription.amount,
      subscription.startDate,
      subscription.endDate,
      subscription.createdAt,
      subscription.updatedAt,
    ]);
  }

  async findById(id: string): Promise<Subscription | null> {
    const result = await this.pool.query<SubscriptionDatabaseRow>(
      'SELECT * FROM subscriptions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) return null;

    return this.toDomain(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const result = await this.pool.query<SubscriptionDatabaseRow>(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) return null;

    return this.toDomain(result.rows[0]);
  }

  async update(subscription: Subscription): Promise<void> {
    const query = `
      UPDATE subscriptions
      SET status = $1, updated_at = $2
      WHERE id = $3
    `;

    await this.pool.query(query, [
      subscription.status,
      subscription.updatedAt,
      subscription.id,
    ]);
  }

  private toDomain(row: SubscriptionDatabaseRow): Subscription {
    return Subscription.reconstitute({
      id: row.id,
      userId: row.user_id,
      userEmail: row.user_email,
      userName: row.user_name,
      status: row.status,
      paymentMethod: row.payment_method,
      amount: parseFloat(row.amount),
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}