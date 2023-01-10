import NotFoundError from '../errors/NotFoundError';
import ValidationError from '../errors/ValidationError';
import StatusCodes from '../http/StatusCodes';
import Response from '../services/Response';

const httpErrorHandler = (e: Error | unknown, response: Response): void => {
  let message = 'Internal server error';
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  if (e instanceof ValidationError) {
    message = e.message;
    statusCode = StatusCodes.BAD_REQUEST;
  }

  if (e instanceof NotFoundError) {
    message = 'Not found';
    statusCode = StatusCodes.NOT_FOUND;
  }

  const result = Response.make(null, message);

  response.setStatusCode(statusCode);
  response.setBody(result);
};

const errorHandler = (e: any): void => {
  /* eslint no-console: ["error", { allow: ["error"] }] */
  console.error(e.message);
};

export {
  httpErrorHandler,
  errorHandler,
};
