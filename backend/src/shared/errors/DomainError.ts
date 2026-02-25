import { AppError } from './AppError';

export class DomainError extends AppError {
  constructor(message: string, code: string) {
    super(message, 422, code);
    this.name = 'DomainError';
  }
}