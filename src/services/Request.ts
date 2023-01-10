import { IncomingMessage } from 'http';
import { parseFullUrlToUrl } from '../helpers/UrlParserHelper';
import AppError from '../errors/AppError';

class Request {
  public readonly url: string;

  public readonly method: string;

  public readonly data: any;

  private readonly request: IncomingMessage;

  constructor(request: IncomingMessage, data: any) {
    if (request.method === undefined) {
      throw new AppError('Request method not found');
    }
    if (request.url === undefined) {
      throw new AppError('Request url not found');
    }

    this.request = request;
    this.url = parseFullUrlToUrl(request.url);
    this.method = request.method;
    this.data = data;
  }
}

export default Request;
