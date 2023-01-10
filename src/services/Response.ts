import { ServerResponse } from 'http';
import IResponse from '../contracts/IResponse';

class Response {
  constructor(private response: ServerResponse) {
    this.setDefaultHeaders();
  }

  public setHeader(name: string, value: string): void {
    this.response.setHeader(name, value);
  }

  public setStatusCode(statusCode: number): void {
    this.response.writeHead(statusCode);
  }

  public setBody(result: IResponse): void {
    const body = JSON.stringify(result);

    this.response.write(body);
  }

  public end(): void {
    this.response.end();
  }

  public get statusCode(): number {
    return this.response.statusCode;
  }

  public static make(
    data: {} | [] | null = null,
    message: string = '',
  ): IResponse {
    return {
      data,
      message,
    };
  }

  private setDefaultHeaders(): void {
    this.setHeader('Content-Type', 'application/json');
  }
}

export default Response;
