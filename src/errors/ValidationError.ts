import AppError from './AppError';

class ValidationError extends AppError {
  constructor(message?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export default ValidationError;
