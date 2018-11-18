import { Application, NextFunction, Request, Response, Router } from 'express';
export declare const createRouter: CreateRouter;
export interface Route<R> {
    action: (x: object | null) => Promise<R>;
    beforeware?: Array<(Request: any, res: Response, next: NextFunction) => void>;
    createParam?: (req: Request) => object;
    method: 'get' | 'post' | 'put' | 'delete';
    path: string;
}
export interface RegisterRouter {
    <R>(app: Application, mapPath: string, routeMap: Route<R>[], postAsyncHandlers: Array<PostAsyncHandler<R>>): void;
}
export interface RouteDefinition<R> {
    map: Route<R>[];
    mapPath: string;
    postAsyncHandlers: Array<(req: Request, res: Response, next: NextFunction) => (R: R) => R>;
}
interface PostAsyncHandler<R> {
    (req: Request, res: Response, next: NextFunction): (R: R) => R;
}
interface CreateRouter {
    <R>(routes: Route<R>[], postAsyncHandlers: PostAsyncHandler<R>[]): Router;
}
export {};
//# sourceMappingURL=index.d.ts.map