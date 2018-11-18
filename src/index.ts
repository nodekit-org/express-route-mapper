import { 
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import chalk from 'chalk';

export const createRouter: CreateRouter = function (routes, postAsyncHandlers) {
  const router: Router = Router();
  console.log(`[routeMapper] postAsyncHandlers (%s), routes (%s)`, postAsyncHandlers.length, routes.length);

  routes.map((route) => {
    console.debug(`[routeMapper] Route is registered: [%s] ${chalk.green('%s')}`, route.method, route.path);
    router[route.method](
      route.path, 
      [
        ...(route.beforeware && route.beforeware || []),
        (req: Request, res: Response, next: NextFunction) => {
          const param = route.createParam ? route.createParam(req) : null;

          postAsyncHandlers.reduce((acc, curr) => {
            return acc.then(curr(req, res, next));
          }, route.action(param))
            .catch(next);
        },
      ],
    );
  });

  return router;
};

interface Route<R> {
  action: (x: object | null) => Promise<R>;
  beforeware?: Array<(Request, res: Response, next: NextFunction) => void>;
  createParam?: (req: Request) => object;
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
}

interface PostAsyncHandler<R> {
  (req: Request, res: Response, next: NextFunction): (R: R) => R;
}

interface CreateRouter {
  <R>(
    routes: Route<R>[],
    postAsyncHandlers: PostAsyncHandler<R>[],
  ): Router;
}
