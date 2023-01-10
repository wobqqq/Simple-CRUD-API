import IRoute from '../contracts/IRoute';
import HttpMethods from '../http/HttpMethods';
import { parseUrlToSegments, parseSegmentsToUrl } from '../helpers/UrlParserHelper';

export class Router {
  private routes: IRoute[] = [];

  public get(url: string, controller: string): void {
    this.push(url, HttpMethods.GET, controller);
  }

  public post(url: string, controller: string): void {
    this.push(url, HttpMethods.POST, controller);
  }

  public put(url: string, controller: string): void {
    this.push(url, HttpMethods.PUT, controller);
  }

  public delete(url: string, controller: string): void {
    this.push(url, HttpMethods.DELETE, controller);
  }

  public findRoute(requestMethod: string, requestUrl: string): IRoute | null {
    const requestUrlSegments = parseUrlToSegments(requestUrl);
    const route = [...this.routes]
      .find((item) => Router.compareWithRoute(requestUrlSegments, requestMethod, item));

    return route ?? null;
  }

  private push(url: string, method: string, controller: string): void {
    const [className, methodName] = controller.split('@');
    const route = {
      url,
      method,
      className,
      methodName,
    };

    this.routes.push(route);
  }

  private static compareWithRoute(
    requestUrlSegments: string[],
    requestMethod: string,
    route: IRoute,
  ): IRoute | null {
    const routeUrlSegments = parseUrlToSegments(route.url);
    const routeMethod = route.method;
    const isNotSameByMethod = requestMethod !== routeMethod;
    const isNotSameBySegments = requestUrlSegments.length !== routeUrlSegments.length;

    if (isNotSameByMethod || isNotSameBySegments) {
      return null;
    }

    const slugs: { [key: string]: string } = {};
    const newRequestUrlSegments: string[] = [];

    routeUrlSegments.forEach((item, i) => {
      const isSlug = item.startsWith(':');

      if (isSlug) {
        const key = item.replace(':', '');
        newRequestUrlSegments.push(item);
        slugs[key] = requestUrlSegments[i];
      } else {
        newRequestUrlSegments.push(requestUrlSegments[i]);
      }
    });

    const requestUrl = parseSegmentsToUrl(newRequestUrlSegments);
    const routeUrl = parseSegmentsToUrl(routeUrlSegments);
    const isNotSameByUrl = requestUrl !== routeUrl;

    if (isNotSameByUrl) {
      return null;
    }

    return Object.assign(route, { slugs });
  }
}

export default new Router();
