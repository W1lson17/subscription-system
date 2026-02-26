import { DomainError } from '@shared/errors';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL';

export interface SubscriptionProps {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: SubscriptionStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Subscription {
  private readonly props: SubscriptionProps;

  private constructor(props: SubscriptionProps) {
    this.props = props;
  }

  // --- Factory method ---
  static create(
    props: Omit<SubscriptionProps, 'status' | 'startDate' | 'endDate' | 'createdAt' | 'updatedAt'>
  ): Subscription {
    Subscription.validateEmail(props.userEmail);
    Subscription.validateAmount(props.amount);

    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    return new Subscription({
      ...props,
      status: 'ACTIVE',
      startDate: now,
      endDate,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Reconstruct from DB
  static reconstitute(props: SubscriptionProps): Subscription {
    return new Subscription(props);
  }

  // --- Business rules ---
  cancel(): void {
    if (this.props.status === 'CANCELLED') {
      throw new DomainError(
        'Subscription is already cancelled',
        'SUBSCRIPTION_ALREADY_CANCELLED'
      );
    }
    if (this.props.status === 'EXPIRED') {
      throw new DomainError(
        'Cannot cancel an expired subscription',
        'SUBSCRIPTION_ALREADY_EXPIRED'
      );
    }
    this.props.status = 'CANCELLED';
    this.props.updatedAt = new Date();
  }

  expire(): void {
    if (this.props.status !== 'ACTIVE') {
      throw new DomainError(
        'Only active subscriptions can expire',
        'SUBSCRIPTION_NOT_ACTIVE'
      );
    }
    this.props.status = 'EXPIRED';
    this.props.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.props.status === 'ACTIVE' && new Date() < this.props.endDate;
  }

  // --- Validations ---
  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new DomainError('Invalid email format', 'INVALID_EMAIL');
    }
  }

  private static validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new DomainError('Amount must be greater than zero', 'INVALID_AMOUNT');
    }
  }

  // --- Getters ---
  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get userEmail(): string { return this.props.userEmail; }
  get userName(): string { return this.props.userName; }
  get status(): SubscriptionStatus { return this.props.status; }
  get paymentMethod(): PaymentMethod { return this.props.paymentMethod; }
  get amount(): number { return this.props.amount; }
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date { return this.props.endDate; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  toJSON(): SubscriptionProps {
    return { ...this.props };
  }
}