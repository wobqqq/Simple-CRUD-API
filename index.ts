import startServer from './src';
import { errorHandler } from './src/handlers/ErrorHandler';

process
  .on('unhandledRejection', (r) => { throw r; })
  .on('uncaughtException', (e) => errorHandler(e));

const app = startServer();

export default app;
