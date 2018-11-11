import { 
  Application,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import chalk from 'chalk';

export default function routeMapper<R>(app: Application, routeDefinitions: RouteDefinition<R>[]) {
  routeDefinitions.map((rmap) => {
    registerRouter(app, rmap.mapPath, rmap.map, rmap.postAsyncHandlers);
  });
  return app;
};

const registerRouter: RegisterRouter = function (app, mapPath, routeMap, postAsyncHandlers) {
  const router: Router = Router();
  console.log(`[routeMapper] mapPath: ${chalk.green('%s')}, postAsyncHandlers (%s)`, mapPath, postAsyncHandlers.length);

  routeMap.map((route) => {
    console.debug('[routeMapper] Route is registered: [%s] %s', route.method, route.path);
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
  app.use(mapPath, router);
}

export interface Route<R> {
  action: (x: object | null) => Promise<R>;
  beforeware?: Array<(Request, res: Response, next: NextFunction) => void>;
  createParam?: (req: Request) => object;
  method: 'get' | 'post' | 'put' | 'delete';
  path: string;
}

export interface RegisterRouter {
  <R>(
    app: Application, 
    mapPath: string, 
    routeMap: Route<R>[], 
    postAsyncHandlers: Array<PostAsyncHandler<R>>,
  ): void;
}

export interface RouteDefinition<R> {
  map: Route<R>[],
  mapPath: string;
  postAsyncHandlers: Array<(req: Request, res: Response, next: NextFunction) => (R: R) => R>,
}

interface PostAsyncHandler<R> {
  (req: Request, res: Response, next: NextFunction): (R: R) => R;
}
