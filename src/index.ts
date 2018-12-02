import { 
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import chalk from 'chalk';

const tag = chalk.cyan('[express-route-mapper]');

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

export interface Route<R, P> {
  action: (x: P | undefined) => Promise<R>;
  beforeware?: Array<(Request, res: Response, next: NextFunction) => void>;
  createParam?: (req: Request) => P;
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
}

interface PostAsyncHandler<R> {
  (req: Request, res: Response, next: NextFunction): (R: R) => R;
}

interface CreateRouter {
  <R>(
    routes: Route<R, unknown>[],
    postAsyncHandlers: PostAsyncHandler<R>[],
  ): Router;
}
