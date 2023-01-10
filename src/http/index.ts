import { IncomingMessage, ServerResponse } from 'http';
import { Buffer } from 'buffer';
import Request from '../services/Request';
import Response from '../services/Response';
import { errorHandler, httpErrorHandler } from '../handlers/ErrorHandler';
import router from '../services/Router';
import IResponse from '../contracts/IResponse';
import NotFoundError from '../errors/NotFoundError';
import controllers from './controllers';

const requestHandler = async (request: Request, response: Response) => {
  const route = router.findRoute(request.method, request.url);

  if (route === null) {
    throw new NotFoundError('Route not found');
  }

  const controllerClass = controllers[route.className];

  if (controllerClass === undefined) {
    throw new NotFoundError(`${route.className} controller not found`);
  }

  /* eslint new-cap: ["error", { "newIsCap": false }] */
  const controller = new controllerClass(request, response);
  const methodIsNotFound = typeof controller[route.methodName] !== 'function';

  if (methodIsNotFound) {
    throw new NotFoundError(`Class method ${route.methodName}() ${route.className} not found`);
  }

  const slugs = route.slugs === undefined
    ? []
    : Object.values(route.slugs);
  const result: IResponse = await controller[route.methodName](...slugs);

  response.setBody(result);
};

const getRequestData = async (request: IncomingMessage) => {
  const buffers = [];

  /* eslint no-restricted-syntax: ["off", "ForOfStatement"] */
  for await (const chunk of request) {
    buffers.push(chunk);
  }

  const body = Buffer
    .concat(buffers)
    .toString();

  try {
    return JSON.parse(body);
  } catch (e) {
    return {};
  }
};

const handler = async (
  serverRequest: IncomingMessage,
  serverResponse: ServerResponse,
): Promise<void> => {
  const data = await getRequestData(serverRequest);
  const request = new Request(serverRequest, data);
  const response = new Response(serverResponse);

  try {
    await requestHandler(request, response);
  } catch (e) {
    httpErrorHandler(e, response);
    errorHandler(e);
  }

  response.end();
};

export default handler;
