import AppError from './AppError';

class InMemoryDBError extends AppError {
  constructor(message?: string) {
    super(message);
    this.name = 'InMemoryDBError';
  }
}

export default InMemoryDBError;
