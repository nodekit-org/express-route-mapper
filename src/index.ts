import { 
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import chalk from 'chalk';

const tag = chalk.hex('D1D2FD')('[routeMapper]');

export const createRouter: CreateRouter = function (routes, postAsyncHandlers) {
  const router: Router = Router();
  console.log(
    `${tag} Following routes (%s) will be registered with postAsyncHandlers (%s)`,
    routes.length, 
    postAsyncHandlers.length
  );

  routes.map((route) => {
    console.debug(`${tag} Route is registered: [%s] ${chalk.green('%s')}`, route.method, route.path);
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
