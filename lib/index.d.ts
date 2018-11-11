import { Application, NextFunction, Request, Response } from 'express';
export default function routeMapper<R>(app: Application, routeDefinitions: RouteDefinition<R>[]): Application;
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
export {};
//# sourceMappingURL=index.d.ts.map