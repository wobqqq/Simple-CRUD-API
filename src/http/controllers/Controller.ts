import Request from '../../services/Request';
import Response from '../../services/Response';
import IResponse from '../../contracts/IResponse';

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["makeResponse"] }] */
class Controller {
  constructor(
    protected request: Request,
    protected response: Response,
  ) {
  }

  protected makeResponse(data: {} | [] | null = null): IResponse {
    return Response.make(data);
  }
}

export default Controller;
