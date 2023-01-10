import AppError from './AppError';

class NotFoundError extends AppError {
  constructor(message?: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
